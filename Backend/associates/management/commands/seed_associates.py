from datetime import date, timedelta
from decimal import Decimal
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone
from associates.models import Company, Client, Associate, Assignment, Agreement, ComplianceRecord, ActivityLog, UserProfile


class Command(BaseCommand):
    help = 'Seeds realistic sample data for Associate 360 / BA Control Tower'

    def handle(self, *args, **options):
        self.stdout.write("Seeding Associate 360 database & demo users...")

        # 0. Demo Users & Roles
        demo_users = [
            {
                'username': 'admin',
                'email': 'admin@associate360.io',
                'password': 'admin123',
                'first_name': 'Alex',
                'last_name': 'Vanderbilt',
                'role': 'ADMIN',
                'title': 'System Administrator (Full Control)',
                'is_staff': True,
                'is_superuser': True
            },
            {
                'username': 'management',
                'email': 'management@associate360.io',
                'password': 'manage123',
                'first_name': 'Maya',
                'last_name': 'de Boer',
                'role': 'MANAGEMENT',
                'title': 'Managing Director (Executive)',
                'is_staff': False,
                'is_superuser': False
            },
            {
                'username': 'operations',
                'email': 'operations@associate360.io',
                'password': 'ops123',
                'first_name': 'Karthik',
                'last_name': 'S.',
                'role': 'OPERATIONS',
                'title': 'Operations Lead (BA Control Tower)',
                'is_staff': False,
                'is_superuser': False
            },
            {
                'username': 'compliance',
                'email': 'compliance@associate360.io',
                'password': 'comp123',
                'first_name': 'Claire',
                'last_name': 'Visser',
                'role': 'COMPLIANCE',
                'title': 'Compliance & Legal Officer (VOG/BGC/SNA)',
                'is_staff': False,
                'is_superuser': False
            },
            {
                'username': 'finance',
                'email': 'finance@associate360.io',
                'password': 'fin123',
                'first_name': 'Felix',
                'last_name': 'van Dijk',
                'role': 'FINANCE',
                'title': 'Finance & Commercials Manager',
                'is_staff': False,
                'is_superuser': False
            },
        ]

        for u in demo_users:
            user, created = User.objects.get_or_create(
                username=u['username'],
                defaults={
                    'email': u['email'],
                    'first_name': u['first_name'],
                    'last_name': u['last_name'],
                    'is_staff': u['is_staff'],
                    'is_superuser': u['is_superuser'],
                }
            )
            user.set_password(u['password'])
            user.email = u['email']
            user.first_name = u['first_name']
            user.last_name = u['last_name']
            user.save()

            UserProfile.objects.update_or_create(
                user=user,
                defaults={
                    'role': u['role'],
                    'title': u['title']
                }
            )

        self.stdout.write(self.style.SUCCESS("Demo users created/updated successfully."))


        # 1. Companies
        comp1, _ = Company.objects.get_or_create(code='TS-NL', defaults={'name': 'TechStaff Netherlands B.V.', 'country': 'Netherlands'})
        comp2, _ = Company.objects.get_or_create(code='GA-EU', defaults={'name': 'Global Associates Europe', 'country': 'Netherlands'})

        # 2. Clients
        clients_data = [
            {'name': 'KLM Royal Dutch Airlines', 'code': 'KLM-NL', 'industry': 'Aviation & Logistics', 'contact_name': 'Peter van de Pol', 'contact_email': 'p.vandepol@klm.com'},
            {'name': 'ASML', 'code': 'ASML-NL', 'industry': 'Semiconductors & High Tech', 'contact_name': 'Jan de Vries', 'contact_email': 'j.devries@asml.com'},
            {'name': 'ING Group', 'code': 'ING-NL', 'industry': 'Banking & Financial Services', 'contact_name': 'Sophie van Dijk', 'contact_email': 'sophie.vandijk@ing.com'},
            {'name': 'Philips Healthcare', 'code': 'PHIL-NL', 'industry': 'Healthtech & MedTech', 'contact_name': 'Mark Bakker', 'contact_email': 'mark.bakker@philips.com'},
            {'name': 'Rabobank', 'code': 'RABO-NL', 'industry': 'Agri & Retail Banking', 'contact_name': 'Emma Visser', 'contact_email': 'emma.visser@rabobank.nl'},
            {'name': 'Booking.com', 'code': 'BKNG-NL', 'industry': 'E-Commerce & Travel', 'contact_name': 'Lars Jansen', 'contact_email': 'lars.jansen@booking.com'},
            {'name': 'Ahold Delhaize', 'code': 'AD-NL', 'industry': 'Retail & Supply Chain', 'contact_name': 'Anouk Meijer', 'contact_email': 'anouk.m@aholddelhaize.com'}
        ]

        clients = {}
        for c in clients_data:
            client, _ = Client.objects.get_or_create(code=c['code'], defaults=c)
            clients[c['code']] = client

        today = timezone.now().date()

        # 3. Associates (Benchmark profiles matching operational spreadsheet)
        associates_data = [
            {
                'ba_id': '2002896',
                'first_name': 'Maharraj',
                'last_name': 'Subramaniam',
                'email': 'maharraj.s@associate360.io',
                'phone': '+31 6 7812 3456',
                'photo_url': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
                'primary_role': 'Senior Aviation Process BA',
                'employment_type': 'ZZP',
                'employment_status': 'ACTIVE',
                'readiness_status': 'READY',
                'source': 'STARIDE',
                'ba_company_name': 'DV LINX B.V.',
                'passport_number': 'M7841029',
                'company_to_ba': 'SAGEUS Ltd',
                'company_to_client': 'STARIDE',
                'working_country': 'Netherlands',
                'owner': 'Operations Team',
                'joining_date': date(2025, 1, 15),
                'client_code': 'KLM-NL',
                'role_title': 'Flight Operations Business Analyst',
                'department': 'Operations IT',
                'start_date': date(2026, 1, 1),
                'end_date': date(2026, 12, 31),
                'client_rate': Decimal('105.00'),
                'ba_rate': Decimal('95.00'),
                'extension_status': 'CONFIRMED',
                'bgc': 'COMPLETED',
                'vog': 'COMPLETED',
                'visa': 'VALID_SPONSOR',
                'overall_comp': 'COMPLIANT',
                'historical_agreements': [
                    {'seq': 1, 'num': 'AGR-2002896-01', 'start': date(2025, 1, 15), 'end': date(2025, 7, 14), 'c_rate': Decimal('105.00'), 'b_rate': Decimal('95.00')},
                    {'seq': 2, 'num': 'AGR-2002896-02', 'start': date(2025, 7, 15), 'end': date(2025, 12, 31), 'c_rate': Decimal('105.00'), 'b_rate': Decimal('95.00')},
                    {'seq': 3, 'num': 'AGR-2002896-03', 'start': date(2026, 1, 1), 'end': date(2026, 12, 31), 'c_rate': Decimal('105.00'), 'b_rate': Decimal('95.00')},
                ]
            },
            {
                'ba_id': 'BA-1001',
                'first_name': 'Thijs',
                'last_name': 'van den Berg',
                'email': 'thijs.vandenberg@associate360.io',
                'phone': '+31 6 1234 5678',
                'photo_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                'primary_role': 'Lead Business Analyst',
                'employment_type': 'PAYROLL',
                'employment_status': 'ACTIVE',
                'readiness_status': 'READY',
                'source': 'Referral',
                'ba_company_name': 'SAGEUS B.V.',
                'passport_number': 'N8492015',
                'company_to_ba': 'SAGEUS B.V.',
                'company_to_client': 'STARIDE',
                'working_country': 'Netherlands',
                'owner': 'Karthik S.',
                'joining_date': today - timedelta(days=400),
                'client_code': 'ASML-NL',
                'role_title': 'EUV Lithography Systems Analyst',
                'department': 'D&E Software Core',
                'start_date': today - timedelta(days=180),
                'end_date': today + timedelta(days=120),
                'client_rate': Decimal('125.00'),
                'ba_rate': Decimal('88.00'),
                'extension_status': 'NOT_STARTED',
                'bgc': 'COMPLETED',
                'vog': 'COMPLETED',
                'visa': 'CITIZEN_EU',
                'overall_comp': 'COMPLIANT'
            },
            {
                'ba_id': 'BA-1002',
                'first_name': 'Priya',
                'last_name': 'Sharma',
                'email': 'priya.sharma@associate360.io',
                'phone': '+31 6 2345 6789',
                'photo_url': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                'primary_role': 'Senior Regulatory & AML Analyst',
                'employment_type': 'PAYROLL',
                'employment_status': 'ACTIVE',
                'readiness_status': 'ACTION_REQUIRED',
                'source': 'LinkedIn',
                'ba_company_name': 'SAGEUS B.V.',
                'passport_number': 'P6401928',
                'company_to_ba': 'SAGEUS B.V.',
                'company_to_client': 'STARIDE',
                'working_country': 'Netherlands',
                'owner': 'Karthik S.',
                'joining_date': today - timedelta(days=250),
                'client_code': 'ING-NL',
                'role_title': 'KYC / Transaction Monitoring BA',
                'department': 'Financial Crime Compliance',
                'start_date': today - timedelta(days=175),
                'end_date': today + timedelta(days=5),  # Critical: 5 days left!
                'client_rate': Decimal('115.00'),
                'ba_rate': Decimal('82.00'),
                'extension_status': 'WAITING',
                'bgc': 'COMPLETED',
                'vog': 'COMPLETED',
                'visa': 'VALID_SPONSOR',
                'overall_comp': 'COMPLIANT'
            },
            {
                'ba_id': 'BA-1003',
                'first_name': 'Lucas',
                'last_name': 'Vermeulen',
                'email': 'lucas.vermeulen@associate360.io',
                'phone': '+31 6 3456 7890',
                'photo_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                'primary_role': 'Healthcare Data & AI BA',
                'employment_type': 'ZZP',
                'employment_status': 'ACTIVE',
                'readiness_status': 'READY',
                'source': 'Direct Application',
                'ba_company_name': 'LV Tech Consulting B.V.',
                'passport_number': 'N1294850',
                'company_to_ba': 'SAGEUS Ltd',
                'company_to_client': 'STARIDE',
                'working_country': 'Netherlands',
                'owner': 'Operations Team',
                'joining_date': today - timedelta(days=120),
                'client_code': 'PHIL-NL',
                'role_title': 'Clinical Informatics Consultant',
                'department': 'Connected Care',
                'start_date': today - timedelta(days=110),
                'end_date': today + timedelta(days=70),
                'client_rate': Decimal('135.00'),
                'ba_rate': Decimal('95.00'),
                'extension_status': 'NOT_STARTED',
                'bgc': 'COMPLETED',
                'vog': 'COMPLETED',
                'visa': 'CITIZEN_EU',
                'overall_comp': 'COMPLIANT'
            },
            {
                'ba_id': 'BA-1004',
                'first_name': 'Elena',
                'last_name': 'Rostova',
                'email': 'elena.rostova@associate360.io',
                'phone': '+31 6 4567 8901',
                'photo_url': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
                'primary_role': 'Risk & Credit Flow BA',
                'employment_type': 'PAYROLL',
                'employment_status': 'ACTIVE',
                'readiness_status': 'ACTION_REQUIRED',
                'source': 'Referral',
                'ba_company_name': 'SAGEUS B.V.',
                'passport_number': 'E4920194',
                'company_to_ba': 'SAGEUS B.V.',
                'company_to_client': 'STARIDE',
                'working_country': 'Netherlands',
                'owner': 'Karthik S.',
                'joining_date': today - timedelta(days=320),
                'client_code': 'RABO-NL',
                'role_title': 'Credit Risk Data Modeler',
                'department': 'Wholesale Risk',
                'start_date': today - timedelta(days=165),
                'end_date': today + timedelta(days=12),  # Warning: 12 days left!
                'client_rate': Decimal('110.00'),
                'ba_rate': Decimal('78.00'),
                'extension_status': 'CONTACTED',
                'bgc': 'COMPLETED',
                'vog': 'EXPIRED',
                'visa': 'CITIZEN_EU',
                'overall_comp': 'WARNING'
            },
            {
                'ba_id': 'BA-1005',
                'first_name': 'Alex',
                'last_name': 'Chen',
                'email': 'alex.chen@associate360.io',
                'phone': '+31 6 5678 9012',
                'photo_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                'primary_role': 'E-Commerce Platform BA',
                'employment_type': 'SUBCONTRACTOR',
                'employment_status': 'ACTIVE',
                'readiness_status': 'READY',
                'source': 'Agency Partner',
                'ba_company_name': 'NexGen Digital B.V.',
                'passport_number': 'A9028471',
                'company_to_ba': 'SAGEUS Ltd',
                'company_to_client': 'STARIDE',
                'working_country': 'Netherlands',
                'owner': 'Operations Team',
                'joining_date': today - timedelta(days=90),
                'client_code': 'BKNG-NL',
                'role_title': 'Partner Payments Business Analyst',
                'department': 'Fintech Platform',
                'start_date': today - timedelta(days=80),
                'end_date': today + timedelta(days=200),
                'client_rate': Decimal('130.00'),
                'ba_rate': Decimal('92.00'),
                'extension_status': 'NOT_STARTED',
                'bgc': 'COMPLETED',
                'vog': 'COMPLETED',
                'visa': 'VALID_SPONSOR',
                'overall_comp': 'COMPLIANT'
            },
            {
                'ba_id': 'BA-1006',
                'first_name': 'Daan',
                'last_name': 'Schouten',
                'email': 'daan.schouten@associate360.io',
                'phone': '+31 6 6789 0123',
                'photo_url': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
                'primary_role': 'Supply Chain & ERP BA',
                'employment_type': 'ZZP',
                'employment_status': 'ACTIVE',
                'readiness_status': 'NOT_READY',
                'source': 'Direct Application',
                'ba_company_name': 'DS Solutions B.V.',
                'passport_number': 'N5910482',
                'company_to_ba': 'SAGEUS Ltd',
                'company_to_client': 'STARIDE',
                'working_country': 'Netherlands',
                'owner': 'Operations Team',
                'joining_date': today - timedelta(days=60),
                'client_code': 'AD-NL',
                'role_title': 'Warehouse Automation BA',
                'department': 'Supply Chain IT',
                'start_date': today - timedelta(days=50),
                'end_date': today + timedelta(days=22),  # Warning: 22 days left
                'client_rate': Decimal('120.00'),
                'ba_rate': Decimal('85.00'),
                'extension_status': 'NOT_STARTED',
                'bgc': 'PENDING',
                'vog': 'PENDING',
                'visa': 'CITIZEN_EU',
                'overall_comp': 'NON_COMPLIANT'
            },
            {
                'ba_id': 'BA-1007',
                'first_name': 'Fatima',
                'last_name': 'El Amrani',
                'email': 'fatima.elamrani@associate360.io',
                'phone': '+31 6 7890 1234',
                'photo_url': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                'primary_role': 'Digital Banking Experience BA',
                'employment_type': 'PAYROLL',
                'employment_status': 'ACTIVE',
                'readiness_status': 'READY',
                'source': 'LinkedIn',
                'ba_company_name': 'SAGEUS B.V.',
                'passport_number': 'F8291047',
                'company_to_ba': 'SAGEUS B.V.',
                'company_to_client': 'STARIDE',
                'working_country': 'Netherlands',
                'owner': 'Karthik S.',
                'joining_date': today - timedelta(days=150),
                'client_code': 'ING-NL',
                'role_title': 'Mobile Banking Journey BA',
                'department': 'Retail Core Experience',
                'start_date': today - timedelta(days=140),
                'end_date': today + timedelta(days=160),
                'client_rate': Decimal('118.00'),
                'ba_rate': Decimal('84.00'),
                'extension_status': 'NOT_STARTED',
                'bgc': 'COMPLETED',
                'vog': 'COMPLETED',
                'visa': 'CITIZEN_EU',
                'overall_comp': 'COMPLIANT'
            },
            {
                'ba_id': 'BA-1008',
                'first_name': 'Niels',
                'last_name': 'van Leeuwen',
                'email': 'niels.vanleeuwen@associate360.io',
                'phone': '+31 6 8901 2345',
                'photo_url': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
                'primary_role': 'Integration & API Architect BA',
                'employment_type': 'PAYROLL',
                'employment_status': 'ACTIVE',
                'readiness_status': 'READY',
                'source': 'Referral',
                'ba_company_name': 'SAGEUS B.V.',
                'passport_number': 'N2940185',
                'company_to_ba': 'SAGEUS B.V.',
                'company_to_client': 'STARIDE',
                'working_country': 'Netherlands',
                'owner': 'Operations Team',
                'joining_date': today - timedelta(days=280),
                'client_code': 'ASML-NL',
                'role_title': 'Fab MES Integration BA',
                'department': 'Manufacturing Operations',
                'start_date': today - timedelta(days=200),
                'end_date': today + timedelta(days=95),
                'client_rate': Decimal('140.00'),
                'ba_rate': Decimal('98.00'),
                'extension_status': 'NOT_STARTED',
                'bgc': 'COMPLETED',
                'vog': 'COMPLETED',
                'visa': 'CITIZEN_EU',
                'overall_comp': 'COMPLIANT'
            }
        ]


        for a in associates_data:
            client = clients[a['client_code']]
            assoc, created = Associate.objects.update_or_create(
                ba_id=a['ba_id'],
                defaults={
                    'first_name': a['first_name'],
                    'last_name': a['last_name'],
                    'email': a['email'],
                    'phone': a['phone'],
                    'photo_url': a['photo_url'],
                    'primary_role': a['primary_role'],
                    'employment_type': a['employment_type'],
                    'employment_status': a['employment_status'],
                    'readiness_status': a['readiness_status'],
                    'source': a['source'],
                    'ba_company_name': a.get('ba_company_name', ''),
                    'passport_number': a.get('passport_number', ''),
                    'company_to_ba': a.get('company_to_ba', 'SAGEUS B.V.'),
                    'company_to_client': a.get('company_to_client', 'STARIDE'),
                    'working_country': a['working_country'],
                    'owner': a['owner'],
                    'joining_date': a['joining_date'],
                }
            )

            # Assignment
            Assignment.objects.update_or_create(
                associate=assoc,
                client=client,
                defaults={
                    'company': comp1,
                    'role_title': a['role_title'],
                    'department': a['department'],
                    'is_current': True
                }
            )

            # Agreements: If historical agreements defined, create the full chain (1st, 2nd, 3rd...)
            if 'historical_agreements' in a:
                for h_agr in a['historical_agreements']:
                    Agreement.objects.update_or_create(
                        associate=assoc,
                        agreement_number=h_agr['num'],
                        defaults={
                            'client': client,
                            'sequence': h_agr['seq'],
                            'start_date': h_agr['start'],
                            'end_date': h_agr['end'],
                            'client_rate': h_agr['c_rate'],
                            'ba_rate': h_agr['b_rate'],
                            'currency': 'EUR',
                            'rate_unit': 'HOURLY',
                            'status': 'ACTIVE' if h_agr['seq'] == len(a['historical_agreements']) else 'COMPLETED',
                            'extension_status': a['extension_status'] if h_agr['seq'] == len(a['historical_agreements']) else 'CONFIRMED'
                        }
                    )
            else:
                Agreement.objects.update_or_create(
                    associate=assoc,
                    agreement_number=f"AGR-2026-{assoc.ba_id}-v1",
                    defaults={
                        'client': client,
                        'sequence': 1,
                        'start_date': a['start_date'],
                        'end_date': a['end_date'],
                        'client_rate': a['client_rate'],
                        'ba_rate': a['ba_rate'],
                        'currency': 'EUR',
                        'rate_unit': 'HOURLY',
                        'status': 'ACTIVE',
                        'extension_status': a['extension_status']
                    }
                )

            # Compliance Record
            ComplianceRecord.objects.update_or_create(
                associate=assoc,
                defaults={
                    'bgc_status': a['bgc'],
                    'vog_status': a['vog'],
                    'visa_status': a['visa'],
                    'sna_status': 'VERIFIED' if a['ba_id'] != '2002896' else 'PENDING',
                    'overall_status': a['overall_comp'],
                    'notes': 'Verified during Q1 onboarding review.'
                }
            )

            # Activity Log
            ActivityLog.objects.get_or_create(
                associate=assoc,
                action_type='PROFILE_INITIALIZED',
                defaults={
                    'description': f"Associate {assoc.ba_id} ({assoc.full_name}) profile with photo and sequential agreements created.",
                    'actor': 'Control Tower System'
                }
            )


        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {len(associates_data)} Associates, 6 Clients, and Agreements!"))
