import uuid
from decimal import Decimal
from django.db import models
from django.utils import timezone


class Company(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    country = models.CharField(max_length=100, default='Netherlands')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Companies'

    def __str__(self):
        return self.name


class Client(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    industry = models.CharField(max_length=100, default='Technology & Financial')
    contact_name = models.CharField(max_length=255, blank=True)
    contact_email = models.EmailField(blank=True)
    country = models.CharField(max_length=100, default='Netherlands')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Associate(models.Model):
    EMPLOYMENT_TYPES = [
        ('PAYROLL', 'Payroll / Permanent'),
        ('ZZP', 'ZZP / Freelance'),
        ('SUBCONTRACTOR', 'Subcontractor / Partner'),
        ('INTERN', 'Intern / Trainee'),
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('ON_LEAVE', 'On Leave'),
        ('EXITED', 'Exited'),
    ]

    READINESS_CHOICES = [
        ('READY', 'Ready'),
        ('ACTION_REQUIRED', 'Action Required'),
        ('NOT_READY', 'Not Ready'),
        ('INACTIVE', 'Inactive'),
    ]

    ba_id = models.CharField(max_length=50, unique=True, db_index=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    secondary_email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True)
    secondary_phone = models.CharField(max_length=50, blank=True, null=True)
    photo_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(max_length=500, blank=True, null=True)

    
    primary_role = models.CharField(max_length=200, default='Business Analyst')

    employment_type = models.CharField(max_length=30, choices=EMPLOYMENT_TYPES, default='PAYROLL')
    employment_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='ACTIVE')
    readiness_status = models.CharField(max_length=30, choices=READINESS_CHOICES, default='READY')
    
    source = models.CharField(max_length=100, default='Direct Application')
    ba_company_name = models.CharField(max_length=255, blank=True, default='')
    passport_number = models.CharField(max_length=100, blank=True, default='')
    company_to_ba = models.CharField(max_length=255, blank=True, default='SAGEUS B.V.')
    company_to_client = models.CharField(max_length=255, blank=True, default='STARIDE')
    working_country = models.CharField(max_length=100, default='Netherlands')
    owner = models.CharField(max_length=150, default='Operations Team')
    
    joining_date = models.DateField(default=timezone.now)
    exit_date = models.DateField(null=True, blank=True)
    exit_reason = models.TextField(blank=True, null=True)

    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return f"{self.ba_id} - {self.full_name}"


class Assignment(models.Model):
    associate = models.ForeignKey(Associate, on_delete=models.CASCADE, related_name='assignments')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='assignments')
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name='assignments')
    role_title = models.CharField(max_length=200)
    department = models.CharField(max_length=150, blank=True, null=True)
    is_current = models.BooleanField(default=True)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.associate.full_name} @ {self.client.name}"


class Agreement(models.Model):
    STATUS_CHOICES = [
        ('UPCOMING', 'Upcoming'),
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    EXTENSION_CHOICES = [
        ('NOT_STARTED', 'Not Started'),
        ('CONTACTED', 'Contacted'),
        ('WAITING', 'Waiting / Negotiation'),
        ('CONFIRMED', 'Confirmed'),
        ('REJECTED', 'Rejected'),
        ('COMPLETED', 'Completed'),
    ]

    RATE_UNITS = [
        ('HOURLY', 'Hourly (€/hr)'),
        ('DAILY', 'Daily (€/day)'),
        ('MONTHLY', 'Monthly (€/mo)'),
    ]

    agreement_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    associate = models.ForeignKey(Associate, on_delete=models.CASCADE, related_name='agreements')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='agreements')
    agreement_number = models.CharField(max_length=100)
    sequence = models.PositiveIntegerField(default=1)
    
    start_date = models.DateField()
    end_date = models.DateField()
    
    client_rate = models.DecimalField(max_digits=10, decimal_places=2, help_text="Bill rate charged to client")
    ba_rate = models.DecimalField(max_digits=10, decimal_places=2, help_text="Pay rate paid to associate/consultant")
    currency = models.CharField(max_length=10, default='EUR')
    rate_unit = models.CharField(max_length=20, choices=RATE_UNITS, default='HOURLY')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    extension_status = models.CharField(max_length=30, choices=EXTENSION_CHOICES, default='NOT_STARTED')
    document_url = models.URLField(blank=True, null=True)
    
    difference = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    margin_percentage = models.DecimalField(max_digits=6, decimal_places=2, default=Decimal('0.00'))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date', '-sequence']

    def save(self, *args, **kwargs):
        if self.client_rate is not None and self.ba_rate is not None:
            self.difference = self.client_rate - self.ba_rate
            if self.client_rate > 0:
                self.margin_percentage = (self.difference / self.client_rate) * Decimal('100.00')
            else:
                self.margin_percentage = Decimal('0.00')
        super().save(*args, **kwargs)

    @property
    def days_remaining(self):
        today = timezone.now().date()
        if self.end_date:
            return (self.end_date - today).days
        return 0

    def __str__(self):
        return f"{self.agreement_number} ({self.associate.full_name} - {self.client.name})"


class ComplianceRecord(models.Model):
    BGC_CHOICES = [
        ('NOT_REQUIRED', 'Not Required'),
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('EXCEPTION', 'Exception'),
        ('EXPIRED', 'Expired'),
    ]

    VOG_CHOICES = [
        ('NOT_REQUIRED', 'Not Required'),
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('EXPIRED', 'Expired'),
    ]

    VISA_CHOICES = [
        ('CITIZEN_EU', 'EU / Dutch Citizen'),
        ('VALID_SPONSOR', 'Knowledge Migrant (HSM)'),
        ('SEARCH_YEAR', 'Zoekjaar / Search Year'),
        ('PENDING', 'Renewal Pending'),
        ('EXPIRED', 'Expired'),
    ]

    SNA_CHOICES = [
        ('VERIFIED', 'Verified / NEN 4400-1'),
        ('PENDING', 'Pending Audit'),
        ('EXEMPT', 'Exempt'),
    ]

    OVERALL_CHOICES = [
        ('COMPLIANT', 'Compliant'),
        ('WARNING', 'Warning / Action Needed'),
        ('NON_COMPLIANT', 'Non-Compliant'),
    ]

    associate = models.OneToOneField(Associate, on_delete=models.CASCADE, related_name='compliance')
    bgc_status = models.CharField(max_length=30, choices=BGC_CHOICES, default='COMPLETED')
    vog_status = models.CharField(max_length=30, choices=VOG_CHOICES, default='COMPLETED')
    visa_status = models.CharField(max_length=30, choices=VISA_CHOICES, default='CITIZEN_EU')
    visa_expiry_date = models.DateField(null=True, blank=True)
    sna_status = models.CharField(max_length=30, choices=SNA_CHOICES, default='VERIFIED')
    overall_status = models.CharField(max_length=30, choices=OVERALL_CHOICES, default='COMPLIANT')
    
    notes = models.TextField(blank=True, default='')
    last_verified_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Compliance - {self.associate.full_name} ({self.overall_status})"


class AssociateDocument(models.Model):
    DOC_TYPES = [
        ('RESUME', 'Consultant Resume / CV'),
        ('VOG', 'VOG Certificate'),
        ('PASSPORT', 'Passport / National ID'),
        ('AGREEMENT', 'Signed Agreement / SOW'),
        ('VISA', 'Work Permit / HSM Visa'),
        ('KVK', 'KVK Handelsregister Extract'),
        ('SNA', 'SNA NEN 4400-1 Certificate'),
        ('OTHER', 'Other Supporting Document'),
    ]


    associate = models.ForeignKey(Associate, on_delete=models.CASCADE, related_name='documents')
    doc_type = models.CharField(max_length=50, choices=DOC_TYPES, default='OTHER')
    title = models.CharField(max_length=255)
    file_name = models.CharField(max_length=255, blank=True, default='')
    file_url = models.URLField(max_length=1000, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.doc_type}: {self.title} ({self.associate.full_name})"


class ActivityLog(models.Model):
    associate = models.ForeignKey(Associate, on_delete=models.CASCADE, related_name='activities', null=True, blank=True)
    action_type = models.CharField(max_length=100)
    description = models.TextField()
    actor = models.CharField(max_length=150, default='System')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.created_at.strftime('%Y-%m-%d %H:%M')}] {self.action_type}: {self.description[:50]}"



from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('ADMIN', 'Administrator (Full Access)'),
        ('MANAGEMENT', 'Management (Executive Oversight)'),
        ('OPERATIONS', 'Operations Lead (Controller)'),
        ('ACCOUNT_MANAGER', 'Account Manager (Assigned BAs)'),
        ('COMPLIANCE', 'Compliance Officer (VOG/BGC/SNA)'),
        ('FINANCE', 'Finance Manager (Rates & Margins)'),
        ('READ_ONLY', 'Auditor / Read-Only'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='OPERATIONS')
    title = models.CharField(max_length=150, blank=True, default='Operations Controller')
    phone = models.CharField(max_length=50, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"

