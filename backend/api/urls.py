from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UploadStatementView, DashboardView, PersonAnalysisView, 
    PersonTransactionsView, DayTransactionsView, UPISearchView, 
    HealthView, RegisterView, ClearDataView
)

urlpatterns = [
    path('health/', HealthView.as_view(), name='api_health'),
    path('register/', RegisterView.as_view(), name='api_register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('clear-data/', ClearDataView.as_view(), name='api_clear_data'),
    path('upload/', UploadStatementView.as_view(), name='api_upload'),
    path('dashboard/', DashboardView.as_view(), name='api_dashboard'),
    path('person-analysis/', PersonAnalysisView.as_view(), name='api_person_analysis'),
    path('person-transactions/', PersonTransactionsView.as_view(), name='person-transactions'),
    path('day-transactions/', DayTransactionsView.as_view(), name='day-transactions'),
    path('upi-search/', UPISearchView.as_view(), name='api_upi_search'),
]
