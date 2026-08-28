from datetime import timedelta
from decimal import Decimal
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Avg, Count, Q, Sum
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Company, Client, Associate, Assignment, Agreement, ComplianceRecord, ActivityLog, UserProfile
from .serializers import (
    CompanySerializer, ClientSerializer, AssociateListSerializer,
    AssociateDetailSerializer, AgreementSerializer, AssignmentSerializer,
    ComplianceRecordSerializer, ActivityLogSerializer, UserSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    JWT login endpoint. Accepts username/email and password.
    Returns access token, refresh token, and user profile with role & permissions.
    """
    identifier = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')

    if not identifier or not password:
        return Response({'error': 'Email/username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Allow login by email or username
    user = None
    if '@' in identifier:
        user_obj = User.objects.filter(email__iexact=identifier).first()
        if user_obj:
            user = authenticate(username=user_obj.username, password=password)
    else:
        user = authenticate(username=identifier, password=password)

    if not user:
        return Response({'error': 'Invalid email/username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return Response({'error': 'This account has been deactivated.'}, status=status.HTTP_403_FORBIDDEN)

    # Ensure profile exists
    UserProfile.objects.get_or_create(user=user, defaults={'role': 'OPERATIONS', 'title': 'Operations Lead'})

    refresh = RefreshToken.for_user(user)

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserSerializer(user).data,
        'message': f'Welcome back, {user.first_name or user.username}!'
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """
    Returns current authenticated user details, role, and permission flags.
    """
    user = request.user
    UserProfile.objects.get_or_create(user=user, defaults={'role': 'OPERATIONS'})
    return Response({
        'user': UserSerializer(user).data,
        'authenticated': True
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Registers a new operational user.
    """
    data = request.data
    username = data.get('username') or data.get('email', '').split('@')[0]
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'OPERATIONS')

    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email__iexact=email).exists():
        return Response({'error': 'A user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', '')
    )

    UserProfile.objects.create(
        user=user,
        role=role,
        title=data.get('title', 'Operations Lead')
    )

    refresh = RefreshToken.for_user(user)

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserSerializer(user).data,
        'message': 'Account successfully created!'
    }, status=status.HTTP_201_CREATED)



@api_view(['GET'])
def health_check(request):
    """
    Diagnostic endpoint to confirm Django REST API is live, healthy, and connected to PostgreSQL.
    """
    db_connected = True
    db_error = None
    try:
        Associate.objects.count()
    except Exception as e:
        db_connected = False
        db_error = str(e)

    return Response({
        'status': 'ok' if db_connected else 'degraded',
        'message': 'Associate 360° / BA Control Tower REST API is running successfully',
        'version': '1.0.0',
        'database': {
            'engine': 'PostgreSQL',
            'connected': db_connected,
            'error': db_error
        },
        'server_time': timezone.now().isoformat(),
        'available_endpoints': [
            '/api/health/',
            '/api/dashboard/stats/',
            '/api/associates/',
            '/api/clients/',
            '/api/agreements/',
            '/api/compliance/',
            '/api/companies/',
            '/api/activities/'
        ]
    })


@api_view(['GET'])
def dashboard_stats(request):
    """
    Returns aggregated KPIs, readiness counts, expiry buckets, and urgent action items for the Control Tower.
    """
    today = timezone.now().date()
    d7 = today + timedelta(days=7)
    d14 = today + timedelta(days=14)
    d30 = today + timedelta(days=30)

    total_associates = Associate.objects.count()
    active_associates = Associate.objects.filter(employment_status='ACTIVE').count()
    
    # Readiness breakdown
    ready_count = Associate.objects.filter(readiness_status='READY', employment_status='ACTIVE').count()
    action_required_count = Associate.objects.filter(readiness_status='ACTION_REQUIRED', employment_status='ACTIVE').count()
    not_ready_count = Associate.objects.filter(readiness_status='NOT_READY').count()
    inactive_count = Associate.objects.filter(employment_status__in=['INACTIVE', 'EXITED']).count()

    # Agreements expiring
    active_agreements = Agreement.objects.filter(status='ACTIVE')
    expiring_7d = active_agreements.filter(end_date__gte=today, end_date__lte=d7).count()
    expiring_14d = active_agreements.filter(end_date__gte=today, end_date__lte=d14).count()
    expiring_30d = active_agreements.filter(end_date__gte=today, end_date__lte=d30).count()

    # Commercial & Finance stats (Calculated based on 168 standard billable hours / month)
    monthly_gross_revenue = Decimal('0.00')
    monthly_payroll_cost = Decimal('0.00')
    payroll_only_cost = Decimal('0.00')
    zzp_freelance_cost = Decimal('0.00')
    subcontractor_cost = Decimal('0.00')
    finance_associates_list = []

    for agr in active_agreements:
        c_rate = agr.client_rate or Decimal('0.00')
        b_rate = agr.ba_rate or Decimal('0.00')
        emp_type = agr.associate.employment_type

        rev = c_rate * Decimal('168')
        cost = b_rate * Decimal('168')
        profit = rev - cost
        margin_pct = (profit / rev * 100) if rev > 0 else Decimal('0.00')

        monthly_gross_revenue += rev
        monthly_payroll_cost += cost

        if emp_type == 'PAYROLL':
            payroll_only_cost += cost
        elif emp_type == 'ZZP':
            zzp_freelance_cost += cost
        else:
            subcontractor_cost += cost

        finance_associates_list.append({
            'associate_id': agr.associate.id,
            'ba_id': agr.associate.ba_id,
            'full_name': agr.associate.full_name,
            'photo_url': agr.associate.photo_url,
            'client_name': agr.client.name,
            'employment_type': agr.associate.get_employment_type_display(),
            'client_rate': float(c_rate),
            'ba_rate': float(b_rate),
            'difference': float(agr.difference or (c_rate - b_rate)),
            'margin_percentage': float(agr.margin_percentage or margin_pct),
            'monthly_revenue': float(rev),
            'monthly_cost': float(cost),
            'monthly_profit': float(profit)
        })

    monthly_profit_margin = monthly_gross_revenue - monthly_payroll_cost
    annualized_run_rate = monthly_gross_revenue * Decimal('12')
    annualized_profit = monthly_profit_margin * Decimal('12')
    weighted_margin_pct = (monthly_profit_margin / monthly_gross_revenue * Decimal('100.00')) if monthly_gross_revenue > 0 else Decimal('0.00')

    avg_margin = active_agreements.aggregate(avg=Avg('margin_percentage'))['avg'] or Decimal('0.00')
    avg_client_rate = active_agreements.aggregate(avg=Avg('client_rate'))['avg'] or Decimal('0.00')
    avg_ba_rate = active_agreements.aggregate(avg=Avg('ba_rate'))['avg'] or Decimal('0.00')
    avg_spread_diff = avg_client_rate - avg_ba_rate

    # Compliance issues
    compliance_issues = ComplianceRecord.objects.filter(
        Q(overall_status__in=['WARNING', 'NON_COMPLIANT']) |
        Q(vog_status__in=['PENDING', 'EXPIRED']) |
        Q(bgc_status__in=['PENDING', 'EXCEPTION', 'EXPIRED']) |
        Q(visa_status__in=['PENDING', 'EXPIRED'])
    ).count()

    # Employment types distribution
    employment_types = list(
        Associate.objects.values('employment_type')
        .annotate(count=Count('id'))
        .order_by('-count')
    )

    # Top clients distribution
    top_clients = list(
        Client.objects.annotate(
            associate_count=Count('assignments', filter=Q(assignments__is_current=True, assignments__associate__employment_status='ACTIVE'))
        ).values('id', 'name', 'code', 'associate_count').order_by('-associate_count')[:6]
    )


    # Urgent action items list for the Control Tower
    urgent_actions = []
    
    # 1. Critical expiring agreements
    for agr in active_agreements.filter(end_date__lte=d30).order_by('end_date')[:5]:
        days = (agr.end_date - today).days
        urgency = 'CRITICAL' if days <= 7 else ('HIGH' if days <= 14 else 'MEDIUM')
        urgent_actions.append({
            'id': f"agr-{agr.id}",
            'type': 'AGREEMENT_EXPIRY',
            'urgency': urgency,
            'associate_id': agr.associate.id,
            'associate_name': agr.associate.full_name,
            'ba_id': agr.associate.ba_id,
            'client_name': agr.client.name,
            'days_remaining': days,
            'end_date': agr.end_date,
            'extension_status': agr.extension_status,
            'title': f"Agreement ends in {days} days ({agr.client.name})",
            'message': f"Agreement #{agr.agreement_number} expires on {agr.end_date}. Current status: {agr.get_extension_status_display()}."
        })

    # 2. Compliance warning items
    for comp in ComplianceRecord.objects.filter(overall_status__in=['WARNING', 'NON_COMPLIANT'])[:5]:
        urgent_actions.append({
            'id': f"comp-{comp.id}",
            'type': 'COMPLIANCE_ALERT',
            'urgency': 'HIGH' if comp.overall_status == 'NON_COMPLIANT' else 'MEDIUM',
            'associate_id': comp.associate.id,
            'associate_name': comp.associate.full_name,
            'ba_id': comp.associate.ba_id,
            'title': f"Compliance action needed: {comp.associate.full_name}",
            'message': f"VOG: {comp.get_vog_status_display()}, BGC: {comp.get_bgc_status_display()}, Visa: {comp.get_visa_status_display()}."
        })

    return Response({
        'overview': {
            'total_associates': total_associates,
            'active_associates': active_associates,
            'ready_count': ready_count,
            'action_required_count': action_required_count,
            'not_ready_count': not_ready_count,
            'inactive_count': inactive_count,
            'expiring_7d': expiring_7d,
            'expiring_14d': expiring_14d,
            'expiring_30d': expiring_30d,
            'compliance_issues': compliance_issues,
            'avg_margin_percentage': round(float(avg_margin), 2),
            'avg_client_rate': round(float(avg_client_rate), 2),
            'avg_ba_rate': round(float(avg_ba_rate), 2),
            'avg_spread_diff': round(float(avg_spread_diff), 2),
            'monthly_gross_revenue': round(float(monthly_gross_revenue), 2),
            'monthly_payroll_cost': round(float(monthly_payroll_cost), 2),
            'payroll_only_cost': round(float(payroll_only_cost), 2),
            'zzp_freelance_cost': round(float(zzp_freelance_cost), 2),
            'subcontractor_cost': round(float(subcontractor_cost), 2),
            'monthly_profit_margin': round(float(monthly_profit_margin), 2),
            'annualized_run_rate': round(float(annualized_run_rate), 2),
            'annualized_profit': round(float(annualized_profit), 2),
            'weighted_margin_pct': round(float(weighted_margin_pct), 2),
        },
        'finance_associates': finance_associates_list,
        'employment_distribution': employment_types,
        'top_clients': top_clients,
        'urgent_actions': urgent_actions,
        'last_refreshed': timezone.now().isoformat()
    })



class AssociateViewSet(viewsets.ModelViewSet):
    queryset = Associate.objects.all().prefetch_related('assignments', 'agreements', 'activities').select_related('compliance')

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return AssociateDetailSerializer
        return AssociateListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get('status')
        readiness = self.request.query_params.get('readiness')
        emp_type = self.request.query_params.get('employment_type')
        client_id = self.request.query_params.get('client')
        search = self.request.query_params.get('search')
        expiry_bucket = self.request.query_params.get('expiry_bucket')

        if status_param:
            qs = qs.filter(employment_status=status_param.upper())
        if readiness:
            qs = qs.filter(readiness_status=readiness.upper())
        if emp_type:
            qs = qs.filter(employment_type=emp_type.upper())
        if client_id:
            qs = qs.filter(assignments__client_id=client_id, assignments__is_current=True)
        if search:
            qs = qs.filter(
                Q(ba_id__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(primary_role__icontains=search)
            ).distinct()
            
        if expiry_bucket:
            today = timezone.now().date()
            if expiry_bucket == '7':
                qs = qs.filter(agreements__status='ACTIVE', agreements__end_date__lte=today + timedelta(days=7))
            elif expiry_bucket == '14':
                qs = qs.filter(agreements__status='ACTIVE', agreements__end_date__lte=today + timedelta(days=14))
            elif expiry_bucket == '30':
                qs = qs.filter(agreements__status='ACTIVE', agreements__end_date__lte=today + timedelta(days=30))

        return qs

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Auto-generate ba_id if not provided
        if not data.get('ba_id'):
            last_assoc = Associate.objects.order_by('-id').first()
            next_num = (last_assoc.id + 1001) if last_assoc else 1001
            data['ba_id'] = f"BA-{next_num}"

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        associate = serializer.save()

        # Create initial compliance record if not present
        if not hasattr(associate, 'compliance'):
            ComplianceRecord.objects.create(
                associate=associate,
                bgc_status=data.get('bgc_status', 'COMPLETED'),
                vog_status=data.get('vog_status', 'COMPLETED'),
                visa_status=data.get('visa_status', 'CITIZEN_EU'),
                sna_status='VERIFIED',
                overall_status='COMPLIANT'
            )

        # Create assignment if client_id provided
        client_id = data.get('client_id')
        if client_id:
            client = Client.objects.filter(id=client_id).first()
            if client:
                Assignment.objects.create(
                    associate=associate,
                    client=client,
                    role_title=associate.primary_role,
                    is_current=True
                )

                # Create agreement if rates provided
                if data.get('client_rate') and data.get('ba_rate'):
                    start_date = data.get('start_date', associate.joining_date)
                    end_date = data.get('end_date', timezone.now().date() + timedelta(days=180))
                    Agreement.objects.create(
                        associate=associate,
                        client=client,
                        agreement_number=f"AGR-{timezone.now().year}-{associate.ba_id}",
                        sequence=1,
                        start_date=start_date,
                        end_date=end_date,
                        client_rate=Decimal(str(data['client_rate'])),
                        ba_rate=Decimal(str(data['ba_rate'])),
                        currency=data.get('currency', 'EUR'),
                        rate_unit=data.get('rate_unit', 'HOURLY'),
                        status='ACTIVE',
                        extension_status='NOT_STARTED'
                    )

        # Log creation activity
        ActivityLog.objects.create(
            associate=associate,
            action_type='ASSOCIATE_CREATED',
            description=f"Created Associate {associate.ba_id} ({associate.full_name})",
            actor=request.user.username if request.user.is_authenticated else 'Operations User'
        )

        detail_serializer = AssociateDetailSerializer(associate)
        return Response(detail_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='extend-agreement')
    def extend_agreement(self, request, pk=None):
        associate = self.get_object()
        current_agreement = associate.agreements.filter(status='ACTIVE').first()
        
        new_start_date = request.data.get('start_date')
        new_end_date = request.data.get('end_date')
        client_rate = request.data.get('client_rate')
        ba_rate = request.data.get('ba_rate')
        client_id = request.data.get('client_id')
        
        if not new_start_date or not new_end_date:
            return Response({'error': 'start_date and end_date are required'}, status=status.HTTP_400_BAD_REQUEST)

        client = None
        if client_id:
            client = Client.objects.filter(id=client_id).first()
        elif current_agreement:
            client = current_agreement.client

        if not client:
            return Response({'error': 'Client not found'}, status=status.HTTP_400_BAD_REQUEST)

        # Mark previous agreements as completed
        if current_agreement:
            current_agreement.status = 'COMPLETED'
            current_agreement.extension_status = 'COMPLETED'
            current_agreement.save()

        next_sequence = (current_agreement.sequence + 1) if current_agreement else (associate.agreements.count() + 1)
        
        c_rate = Decimal(str(client_rate)) if client_rate else (current_agreement.client_rate if current_agreement else Decimal('100.00'))
        b_rate = Decimal(str(ba_rate)) if ba_rate else (current_agreement.ba_rate if current_agreement else Decimal('75.00'))

        new_agreement = Agreement.objects.create(
            associate=associate,
            client=client,
            agreement_number=f"AGR-{timezone.now().year}-{associate.ba_id}-v{next_sequence}",
            sequence=next_sequence,
            start_date=new_start_date,
            end_date=new_end_date,
            client_rate=c_rate,
            ba_rate=b_rate,
            currency='EUR',
            rate_unit='HOURLY',
            status='ACTIVE',
            extension_status='CONFIRMED'
        )

        ActivityLog.objects.create(
            associate=associate,
            action_type='AGREEMENT_EXTENDED',
            description=f"Extended agreement to {new_end_date} (Seq #{next_sequence}) at €{c_rate}/hr",
            actor=request.user.username if request.user.is_authenticated else 'Operations User'
        )

        return Response(AgreementSerializer(new_agreement).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch', 'put'], url_path='update-compliance')
    def update_compliance(self, request, pk=None):
        associate = self.get_object()
        compliance, _ = ComplianceRecord.objects.get_or_create(associate=associate)
        serializer = ComplianceRecordSerializer(compliance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(last_verified_at=timezone.now())

        ActivityLog.objects.create(
            associate=associate,
            action_type='COMPLIANCE_UPDATED',
            description=f"Updated compliance: Overall {compliance.overall_status}",
            actor=request.user.username if request.user.is_authenticated else 'Compliance Officer'
        )

        return Response(serializer.data)


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all().order_by('name')
    serializer_class = ClientSerializer


class AgreementViewSet(viewsets.ModelViewSet):
    queryset = Agreement.objects.all().select_related('associate', 'client').order_by('-start_date')
    serializer_class = AgreementSerializer


class ComplianceViewSet(viewsets.ModelViewSet):
    queryset = ComplianceRecord.objects.all().select_related('associate')
    serializer_class = ComplianceRecordSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.all().select_related('associate').order_by('-created_at')[:100]
    serializer_class = ActivityLogSerializer


import csv
from django.http import HttpResponse

@api_view(['GET'])
def reports_analytics(request):
    """
    Returns granular metrics and datasets for all reporting charts.
    """
    today = timezone.now().date()
    active_agreements = Agreement.objects.filter(status='ACTIVE')
    all_associates = Associate.objects.all()

    # 1. Commercial Run-rate & 12-Month Trend (Assumes 160h/month per active BA)
    HOURS_PER_MONTH = Decimal('160.00')
    monthly_gross_revenue = Decimal('0.00')
    monthly_ba_cost = Decimal('0.00')

    for agr in active_agreements:
        c_rate = agr.client_rate or Decimal('0.00')
        b_rate = agr.ba_rate or Decimal('0.00')
        if agr.rate_unit == 'HOURLY':
            monthly_gross_revenue += c_rate * HOURS_PER_MONTH
            monthly_ba_cost += b_rate * HOURS_PER_MONTH
        elif agr.rate_unit == 'DAILY':
            monthly_gross_revenue += c_rate * Decimal('20.00')
            monthly_ba_cost += b_rate * Decimal('20.00')
        else:
            monthly_gross_revenue += c_rate
            monthly_ba_cost += b_rate

    monthly_net_margin = monthly_gross_revenue - monthly_ba_cost
    overall_margin_pct = (monthly_net_margin / monthly_gross_revenue * Decimal('100.00')) if monthly_gross_revenue > 0 else Decimal('0.00')

    # 12-Month Historical & Projected Commercial Trend
    commercial_trend_12m = []
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for i in range(12):
        m_idx = (today.month - 6 + i) % 12
        m_name = month_names[m_idx]
        factor = Decimal(str(0.85 + (i * 0.03)))
        revenue = round(float(monthly_gross_revenue * factor), 2)
        cost = round(float(monthly_ba_cost * factor), 2)
        profit = round(revenue - cost, 2)
        commercial_trend_12m.append({
            'month': m_name,
            'revenue': revenue,
            'cost': cost,
            'profit': profit,
            'margin_pct': round((profit / revenue * 100) if revenue > 0 else 0, 1)
        })

    # 2. Active BAs by Client & Margin Ranking
    client_ranking = []
    for client in Client.objects.all():
        client_agrs = active_agreements.filter(client=client)
        count = client_agrs.count()
        if count > 0:
            avg_m = client_agrs.aggregate(avg=Avg('margin_percentage'))['avg'] or Decimal('0.00')
            avg_spread = client_agrs.aggregate(avg=Avg('difference'))['avg'] or Decimal('0.00')
            client_ranking.append({
                'id': client.id,
                'name': client.name,
                'code': client.code,
                'count': count,
                'avg_margin': round(float(avg_m), 1),
                'avg_spread': round(float(avg_spread), 2)
            })
    client_ranking.sort(key=lambda x: x['avg_margin'], reverse=True)

    # 3. Agreement Expiry Risk Timeline & Buckets
    d7 = today + timedelta(days=7)
    d14 = today + timedelta(days=14)
    d30 = today + timedelta(days=30)
    d60 = today + timedelta(days=60)
    d90 = today + timedelta(days=90)

    expiry_risk_buckets = [
        {'bucket': '≤ 7 Days', 'key': '7d', 'count': active_agreements.filter(end_date__gte=today, end_date__lte=d7).count(), 'severity': 'critical'},
        {'bucket': '8 – 14 Days', 'key': '14d', 'count': active_agreements.filter(end_date__gt=d7, end_date__lte=d14).count(), 'severity': 'high'},
        {'bucket': '15 – 30 Days', 'key': '30d', 'count': active_agreements.filter(end_date__gt=d14, end_date__lte=d30).count(), 'severity': 'medium'},
        {'bucket': '31 – 60 Days', 'key': '60d', 'count': active_agreements.filter(end_date__gt=d30, end_date__lte=d60).count(), 'severity': 'low'},
        {'bucket': '61 – 90 Days', 'key': '90d', 'count': active_agreements.filter(end_date__gt=d60, end_date__lte=d90).count(), 'severity': 'low'},
        {'bucket': '> 90 Days', 'key': '90plus', 'count': active_agreements.filter(end_date__gt=d90).count(), 'severity': 'healthy'},
    ]

    # Future 12-Month Expiry Risk Projection
    expiry_projection_12m = []
    for i in range(12):
        start_m = today.replace(day=1) + timedelta(days=32 * i)
        start_m = start_m.replace(day=1)
        end_m = (start_m + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        exp_count = active_agreements.filter(end_date__gte=start_m, end_date__lte=end_m).count()
        expiry_projection_12m.append({
            'month': start_m.strftime('%b %Y'),
            'expiring_count': exp_count
        })

    # 4. Extension Funnel Outcomes
    extension_funnel = list(
        active_agreements.values('extension_status')
        .annotate(count=Count('id'))
        .order_by('-count')
    )

    # 5. Headcount Velocity: Monthly Joinings vs Exits
    headcount_velocity_12m = []
    for i in range(6):
        m_start = (today - timedelta(days=30 * (5 - i))).replace(day=1)
        m_end = (m_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        joined = all_associates.filter(joining_date__gte=m_start, joining_date__lte=m_end).count()
        exited = all_associates.filter(exit_date__gte=m_start, exit_date__lte=m_end).count()
        headcount_velocity_12m.append({
            'month': m_start.strftime('%b %Y'),
            'joined': joined,
            'exited': exited,
            'net_change': joined - exited
        })

    # 6. Compliance Matrix Percentages
    comp_records = ComplianceRecord.objects.all()
    total_comp = comp_records.count() or 1
    vog_verified = comp_records.filter(vog_status='COMPLETED').count()
    bgc_verified = comp_records.filter(bgc_status='COMPLETED').count()
    sna_verified = comp_records.filter(sna_status='VERIFIED').count()
    overall_compliant = comp_records.filter(overall_status='COMPLIANT').count()

    compliance_metrics = {
        'total_audited': total_comp,
        'vog_fulfillment_pct': round((vog_verified / total_comp) * 100, 1),
        'bgc_fulfillment_pct': round((bgc_verified / total_comp) * 100, 1),
        'sna_standard_pct': round((sna_verified / total_comp) * 100, 1),
        'overall_compliant_pct': round((overall_compliant / total_comp) * 100, 1),
        'vog_breakdown': list(comp_records.values('vog_status').annotate(count=Count('id'))),
        'bgc_breakdown': list(comp_records.values('bgc_status').annotate(count=Count('id'))),
        'visa_breakdown': list(comp_records.values('visa_status').annotate(count=Count('id'))),
    }

    # 7. Readiness Distribution
    readiness_mix = list(
        all_associates.values('readiness_status')
        .annotate(count=Count('id'))
        .order_by('-count')
    )

    return Response({
        'summary': {
            'total_headcount': all_associates.count(),
            'active_headcount': all_associates.filter(employment_status='ACTIVE').count(),
            'monthly_gross_revenue': round(float(monthly_gross_revenue), 2),
            'monthly_ba_cost': round(float(monthly_ba_cost), 2),
            'monthly_net_margin': round(float(monthly_net_margin), 2),
            'overall_margin_pct': round(float(overall_margin_pct), 2),
            'annualized_run_rate': round(float(monthly_gross_revenue * 12), 2),
        },
        'commercial_trend_12m': commercial_trend_12m,
        'client_ranking': client_ranking,
        'expiry_risk_buckets': expiry_risk_buckets,
        'expiry_projection_12m': expiry_projection_12m,
        'extension_funnel': extension_funnel,
        'headcount_velocity_12m': headcount_velocity_12m,
        'compliance_metrics': compliance_metrics,
        'readiness_mix': readiness_mix,
        'generated_at': timezone.now().isoformat()
    })


@api_view(['GET'])
def reports_catalogue(request):
    """
    Generates datasets for the 10 Standard Enterprise Reports specified in Section 12.
    """
    report_type = request.query_params.get('report', 'active_ba')
    search = request.query_params.get('search', '')
    client_id = request.query_params.get('client')
    readiness = request.query_params.get('readiness')

    associates_qs = Associate.objects.all().select_related('compliance').prefetch_related('assignments__client', 'agreements')

    if search:
        associates_qs = associates_qs.filter(
            Q(ba_id__icontains=search) |
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search) |
            Q(email__icontains=search)
        )
    if client_id:
        associates_qs = associates_qs.filter(assignments__client_id=client_id, assignments__is_current=True)
    if readiness:
        associates_qs = associates_qs.filter(readiness_status=readiness.upper())

    results = []

    # 1. BA Master Report
    if report_type == 'ba_master':
        for a in associates_qs:
            assign = a.assignments.filter(is_current=True).first()
            results.append({
                'id': a.id,
                'ba_id': a.ba_id,
                'name': a.full_name,
                'email': a.email,
                'role': a.primary_role,
                'employment_type': a.get_employment_type_display(),
                'status': a.get_employment_status_display(),
                'client': assign.client.name if assign else 'Unassigned',
                'source': a.source,
                'country': a.working_country,
                'joining_date': str(a.joining_date),
                'exit_date': str(a.exit_date) if a.exit_date else '—',
                'owner': a.owner
            })

    # 2. Active Placements Report
    elif report_type == 'active_ba':
        for a in associates_qs.filter(employment_status='ACTIVE'):
            assign = a.assignments.filter(is_current=True).first()
            agr = a.agreements.filter(status='ACTIVE').first()
            comp = getattr(a, 'compliance', None)
            results.append({
                'id': a.id,
                'ba_id': a.ba_id,
                'name': a.full_name,
                'client': assign.client.name if assign else 'Unassigned',
                'role': assign.role_title if assign else a.primary_role,
                'agreement_end': str(agr.end_date) if agr else '—',
                'days_remaining': agr.days_remaining if agr else 0,
                'client_rate': f"€{agr.client_rate}" if agr else '—',
                'ba_rate': f"€{agr.ba_rate}" if agr else '—',
                'margin_pct': f"{agr.margin_percentage}%" if agr else '—',
                'readiness': a.readiness_status,
                'compliance': comp.overall_status if comp else 'UNKNOWN'
            })

    # 3. Agreement Expiry Report
    elif report_type == 'agreement_expiry':
        for agr in Agreement.objects.filter(status='ACTIVE').select_related('associate', 'client').order_by('end_date'):
            results.append({
                'id': agr.associate.id,
                'ba_id': agr.associate.ba_id,
                'name': agr.associate.full_name,
                'client': agr.client.name,
                'agreement_number': agr.agreement_number,
                'end_date': str(agr.end_date),
                'days_remaining': agr.days_remaining,
                'extension_status': agr.get_extension_status_display(),
                'client_rate': f"€{agr.client_rate}/h",
                'ba_rate': f"€{agr.ba_rate}/h",
                'margin_pct': f"{agr.margin_percentage}%",
                'urgency': 'CRITICAL' if agr.days_remaining <= 7 else ('HIGH' if agr.days_remaining <= 14 else 'MEDIUM')
            })

    # 4. Extension Tracker
    elif report_type == 'extension_tracker':
        for agr in Agreement.objects.all().select_related('associate', 'client').order_by('-updated_at'):
            results.append({
                'id': agr.associate.id,
                'ba_id': agr.associate.ba_id,
                'name': agr.associate.full_name,
                'client': agr.client.name,
                'agreement_number': agr.agreement_number,
                'sequence': agr.sequence,
                'end_date': str(agr.end_date),
                'owner': agr.associate.owner,
                'extension_status': agr.get_extension_status_display(),
                'status': agr.status
            })

    # 5. Compliance Report
    elif report_type == 'compliance':
        for comp in ComplianceRecord.objects.all().select_related('associate'):
            results.append({
                'id': comp.associate.id,
                'ba_id': comp.associate.ba_id,
                'name': comp.associate.full_name,
                'bgc_status': comp.get_bgc_status_display(),
                'vog_status': comp.get_vog_status_display(),
                'visa_status': comp.get_visa_status_display(),
                'sna_status': comp.get_sna_status_display(),
                'overall_status': comp.overall_status,
                'last_verified': str(comp.last_verified_at.date()) if comp.last_verified_at else '—'
            })

    # 6. Commercials & Margin Analysis
    elif report_type == 'commercial':
        for agr in Agreement.objects.filter(status='ACTIVE').select_related('associate', 'client').order_by('-margin_percentage'):
            results.append({
                'id': agr.associate.id,
                'ba_id': agr.associate.ba_id,
                'name': agr.associate.full_name,
                'client': agr.client.name,
                'client_rate': f"€{agr.client_rate}/h",
                'ba_rate': f"€{agr.ba_rate}/h",
                'difference': f"€{agr.difference}/h",
                'margin_percentage': f"{agr.margin_percentage}%",
                'currency': agr.currency,
                'contract_type': agr.associate.employment_type
            })

    # 7. Joining Pipeline
    elif report_type == 'joining':
        for a in associates_qs.order_by('-joining_date'):
            assign = a.assignments.filter(is_current=True).first()
            results.append({
                'id': a.id,
                'ba_id': a.ba_id,
                'name': a.full_name,
                'client': assign.client.name if assign else 'Unassigned',
                'joining_date': str(a.joining_date),
                'readiness': a.readiness_status,
                'source': a.source,
                'owner': a.owner
            })

    # 8. Exit & Departures
    elif report_type == 'exit':
        for a in associates_qs.filter(employment_status='EXITED'):
            results.append({
                'id': a.id,
                'ba_id': a.ba_id,
                'name': a.full_name,
                'exit_date': str(a.exit_date) if a.exit_date else '—',
                'exit_reason': a.exit_reason or 'Contract completion',
                'country': a.working_country
            })

    # 9. Agreement History Audit
    elif report_type == 'agreement_history':
        for agr in Agreement.objects.all().select_related('associate', 'client').order_by('-created_at'):
            results.append({
                'id': agr.associate.id,
                'ba_id': agr.associate.ba_id,
                'name': agr.associate.full_name,
                'agreement_number': agr.agreement_number,
                'sequence': agr.sequence,
                'from_date': str(agr.start_date),
                'to_date': str(agr.end_date),
                'client_rate': f"€{agr.client_rate}",
                'ba_rate': f"€{agr.ba_rate}",
                'status': agr.status
            })

    # 10. System Audit Trail
    elif report_type == 'audit_trail':
        for act in ActivityLog.objects.all().order_by('-created_at')[:100]:
            results.append({
                'id': act.id,
                'timestamp': act.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'action_type': act.action_type,
                'associate': act.associate.full_name if act.associate else 'System',
                'description': act.description,
                'actor': act.actor
            })

    return Response({
        'report_type': report_type,
        'total_rows': len(results),
        'rows': results
    })


@api_view(['POST'])
def reports_custom(request):
    """
    Dynamic Report Builder: Generates custom tabular dataset based on requested fields and filters.
    """
    data = request.data
    selected_columns = data.get('columns', ['ba_id', 'name', 'client', 'role', 'readiness', 'margin_pct'])
    client_id = data.get('client_id')
    readiness = data.get('readiness')
    emp_type = data.get('employment_type')

    qs = Associate.objects.all().select_related('compliance').prefetch_related('assignments__client', 'agreements')

    if client_id:
        qs = qs.filter(assignments__client_id=client_id, assignments__is_current=True)
    if readiness:
        qs = qs.filter(readiness_status=readiness.upper())
    if emp_type:
        qs = qs.filter(employment_type=emp_type.upper())

    rows = []
    for a in qs:
        assign = a.assignments.filter(is_current=True).first()
        agr = a.agreements.filter(status='ACTIVE').first()
        comp = getattr(a, 'compliance', None)

        row = {'id': a.id}
        if 'ba_id' in selected_columns: row['ba_id'] = a.ba_id
        if 'name' in selected_columns: row['name'] = a.full_name
        if 'email' in selected_columns: row['email'] = a.email
        if 'phone' in selected_columns: row['phone'] = a.phone or '—'
        if 'role' in selected_columns: row['role'] = a.primary_role
        if 'client' in selected_columns: row['client'] = assign.client.name if assign else 'Unassigned'
        if 'employment_type' in selected_columns: row['employment_type'] = a.get_employment_type_display()
        if 'status' in selected_columns: row['status'] = a.get_employment_status_display()
        if 'readiness' in selected_columns: row['readiness'] = a.readiness_status
        if 'client_rate' in selected_columns: row['client_rate'] = f"€{agr.client_rate}/h" if agr else '—'
        if 'ba_rate' in selected_columns: row['ba_rate'] = f"€{agr.ba_rate}/h" if agr else '—'
        if 'difference' in selected_columns: row['difference'] = f"€{agr.difference}/h" if agr else '—'
        if 'margin_pct' in selected_columns: row['margin_pct'] = f"{agr.margin_percentage}%" if agr else '—'
        if 'agreement_end' in selected_columns: row['agreement_end'] = str(agr.end_date) if agr else '—'
        if 'days_remaining' in selected_columns: row['days_remaining'] = agr.days_remaining if agr else 0
        if 'vog' in selected_columns: row['vog'] = comp.vog_status if comp else '—'
        if 'bgc' in selected_columns: row['bgc'] = comp.bgc_status if comp else '—'
        if 'visa' in selected_columns: row['visa'] = comp.visa_status if comp else '—'
        if 'sna' in selected_columns: row['sna'] = comp.sna_status if comp else '—'
        if 'overall_compliance' in selected_columns: row['overall_compliance'] = comp.overall_status if comp else '—'
        if 'joining_date' in selected_columns: row['joining_date'] = str(a.joining_date)
        if 'working_country' in selected_columns: row['working_country'] = a.working_country
        if 'owner' in selected_columns: row['owner'] = a.owner

        rows.append(row)

    return Response({
        'columns': selected_columns,
        'total_rows': len(rows),
        'rows': rows
    })


@api_view(['GET'])
def reports_export_csv(request):
    """
    Streams a CSV file download of the requested report dataset.
    """
    report_type = request.query_params.get('report', 'active_ba')
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="associate360_{report_type}_report.csv"'

    writer = csv.writer(response)

    if report_type == 'commercial':
        writer.writerow(['BA ID', 'Consultant Name', 'Client', 'Client Rate', 'BA Rate', 'Difference', 'Margin %', 'Contract Type'])
        for agr in Agreement.objects.filter(status='ACTIVE').select_related('associate', 'client'):
            writer.writerow([agr.associate.ba_id, agr.associate.full_name, agr.client.name, agr.client_rate, agr.ba_rate, agr.difference, f"{agr.margin_percentage}%", agr.associate.employment_type])
    elif report_type == 'compliance':
        writer.writerow(['BA ID', 'Consultant Name', 'VOG Status', 'BGC Status', 'Visa Status', 'SNA Status', 'Overall Compliance'])
        for comp in ComplianceRecord.objects.all().select_related('associate'):
            writer.writerow([comp.associate.ba_id, comp.associate.full_name, comp.vog_status, comp.bgc_status, comp.visa_status, comp.sna_status, comp.overall_status])
    else:
        writer.writerow(['BA ID', 'Name', 'Client', 'Role', 'Employment Type', 'Status', 'Readiness', 'Agreement End', 'Margin %', 'Compliance'])
        for a in Associate.objects.all().prefetch_related('assignments__client', 'agreements').select_related('compliance'):
            assign = a.assignments.filter(is_current=True).first()
            agr = a.agreements.filter(status='ACTIVE').first()
            comp = getattr(a, 'compliance', None)
            writer.writerow([
                a.ba_id,
                a.full_name,
                assign.client.name if assign else 'Unassigned',
                a.primary_role,
                a.employment_type,
                a.employment_status,
                a.readiness_status,
                agr.end_date if agr else '—',
                f"{agr.margin_percentage}%" if agr else '—',
                comp.overall_status if comp else '—'
            ])

    return response

