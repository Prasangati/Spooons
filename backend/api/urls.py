from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import (
    signup, authcontext, logout_view, login_view,
    password_reset_request, reset_password_confirm, google_signup,
)
urlpatterns = [
    path('auth/google-signup/', google_signup, name='google-signup'),
    path('auth/signup/', signup, name='signup'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # 🔁 replace with JWT login
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    path('auth/me/', authcontext, name='auth-context'),
    path('auth/logout/', logout_view, name='logout'),  # You might not need this for JWT
    path('auth/reset/', password_reset_request, name='password_reset_request'),
    path("auth/reset-password-confirm/", reset_password_confirm, name="reset_password_confirm"),
]