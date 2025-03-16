from django.urls import path
from .views import google_signup, signup, authcontext, logout_view, login_view, password_reset_request

urlpatterns = [
    path('auth/google-signup/', google_signup,name='google-signup'),
    path('auth/signup/', signup, name='signup'),
    path('auth/me/', authcontext, name='auth-context'),
    path('auth/logout/',logout_view, name='logout' ),
    path('auth/login/', login_view, name='login'),
    path('auth/reset/', password_reset_request, name='password_reset_request'),
]