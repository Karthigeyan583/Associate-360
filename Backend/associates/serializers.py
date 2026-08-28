from rest_framework import serializers
from .models import Company, Client, Associate, Assignment, Agreement, ComplianceRecord, ActivityLog


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class ClientSerializer(serializers.ModelSerializer):
    active_associates_count = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = ['id', 'name', 'code', 'industry', 'contact_name', 'contact_email', 'country', 'created_at', 'active_associates_count']

    def get_active_associates_count(self, obj):
        return obj.assignments.filter(is_current=True, associate__employment_status='ACTIVE').count()


class ComplianceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceRecord
        fields = '__all__'
        read_only_fields = ['id']


class AgreementSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    associate_name = serializers.CharField(source='associate.full_name', read_only=True)
    days_remaining = serializers.IntegerField(read_only=True)

    class Meta:
        model = Agreement
        fields = [
            'id', 'agreement_id', 'associate', 'associate_name', 'client', 'client_name',
            'agreement_number', 'sequence', 'start_date', 'end_date',
            'client_rate', 'ba_rate', 'currency', 'rate_unit',
            'status', 'extension_status', 'document_url',
            'difference', 'margin_percentage', 'days_remaining',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'agreement_id', 'difference', 'margin_percentage', 'created_at', 'updated_at']


class AssignmentSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = Assignment
        fields = '__all__'


class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'


class AssociateListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    current_client = serializers.SerializerMethodField()
    current_agreement = serializers.SerializerMethodField()
    compliance_status = serializers.CharField(source='compliance.overall_status', default='UNKNOWN', read_only=True)

    class Meta:
        model = Associate
        fields = [
            'id', 'ba_id', 'first_name', 'last_name', 'full_name', 'email', 'secondary_email', 'phone', 'secondary_phone', 'photo_url', 'linkedin_url',
            'primary_role', 'employment_type', 'employment_status', 'readiness_status',
            'source', 'ba_company_name', 'passport_number', 'company_to_ba', 'company_to_client',
            'working_country', 'owner', 'joining_date', 'exit_date', 'exit_reason',
            'current_client', 'current_agreement', 'compliance_status', 'created_at', 'updated_at'
        ]

    def get_current_client(self, obj):
        assignment = obj.assignments.filter(is_current=True).first()
        if assignment and assignment.client:
            return {
                'id': assignment.client.id,
                'name': assignment.client.name,
                'role_title': assignment.role_title
            }
        return None

    def get_current_agreement(self, obj):
        agreement = obj.agreements.filter(status='ACTIVE').first() or obj.agreements.order_by('-end_date').first()
        if agreement:
            return {
                'id': agreement.id,
                'agreement_number': agreement.agreement_number,
                'start_date': agreement.start_date,
                'end_date': agreement.end_date,
                'client_rate': agreement.client_rate,
                'ba_rate': agreement.ba_rate,
                'difference': agreement.difference,
                'margin_percentage': agreement.margin_percentage,
                'days_remaining': agreement.days_remaining,
                'status': agreement.status,
                'extension_status': agreement.extension_status
            }
        return None


class AssociateDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    assignments = AssignmentSerializer(many=True, read_only=True)
    agreements = AgreementSerializer(many=True, read_only=True)
    compliance = ComplianceRecordSerializer(read_only=True)
    activities = ActivityLogSerializer(many=True, read_only=True)
    current_agreement = serializers.SerializerMethodField()

    class Meta:
        model = Associate
        fields = [
            'id', 'ba_id', 'first_name', 'last_name', 'full_name', 'email', 'secondary_email', 'phone', 'secondary_phone', 'photo_url', 'linkedin_url',
            'primary_role', 'employment_type', 'employment_status', 'readiness_status',
            'source', 'ba_company_name', 'passport_number', 'company_to_ba', 'company_to_client',
            'working_country', 'owner', 'joining_date', 'exit_date', 'exit_reason',
            'assignments', 'agreements', 'current_agreement', 'compliance', 'activities',
            'created_at', 'updated_at'
        ]




    def get_current_agreement(self, obj):
        agreement = obj.agreements.filter(status='ACTIVE').first() or obj.agreements.order_by('-end_date').first()
        if agreement:
            return AgreementSerializer(agreement).data
        return None


from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['role', 'role_display', 'title', 'phone']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    role = serializers.CharField(source='profile.role', read_only=True, default='OPERATIONS')
    role_display = serializers.CharField(source='profile.get_role_display', read_only=True, default='Operations Lead')

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'role_display', 'profile']

