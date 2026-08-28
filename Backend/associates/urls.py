from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    login_view, me_view, register_view,
    health_check, dashboard_stats,
    reports_analytics, reports_catalogue, reports_custom, reports_export_csv,
    AssociateViewSet, ClientViewSet, AgreementViewSet,
    ComplianceViewSet, CompanyViewSet, ActivityLogViewSet
)

router = DefaultRouter()
router.register(r'associates', AssociateViewSet, basename='associate')
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'agreements', AgreementViewSet, basename='agreement')
router.register(r'compliance', ComplianceViewSet, basename='compliance')
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'activities', ActivityLogViewSet, basename='activity')

urlpatterns = [
    # Auth Endpoints
    path('auth/login/', login_view, name='auth_login'),
    path('auth/me/', me_view, name='auth_me'),
    path('auth/register/', register_view, name='auth_register'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Reports & Analytics Endpoints
    path('reports/analytics/', reports_analytics, name='reports_analytics'),
    path('reports/catalogue/', reports_catalogue, name='reports_catalogue'),
    path('reports/custom/', reports_custom, name='reports_custom'),
    path('reports/export/', reports_export_csv, name='reports_export_csv'),

    # Core Endpoints
    path('health/', health_check, name='health_check'),
    path('dashboard/stats/', dashboard_stats, name='dashboard_stats'),
    path('', include(router.urls)),
]
