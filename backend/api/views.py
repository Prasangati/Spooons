import json
from django.http import JsonResponse
from django.contrib.auth import get_user_model, login, logout, authenticate
from django.views.decorators.http import require_GET, require_POST
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from datetime import datetime, timezone  # Correct import for UTC handling
from rest_framework import status
from .serializers import LoginSerializer,PasswordResetSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
import logging

logger = logging.getLogger(__name__)




@ensure_csrf_cookie
def csrf_view(request):
    return JsonResponse({'csrfToken': get_token(request)})

@require_POST
def google_signup(request):
    try:
        raw_body = request.body
        logger.debug(f"Raw request body: {raw_body}")

        data = json.loads(raw_body.decode('utf-8'))

        token = data.get("token")
        if not token:
            logger.warning("Token not provided in request")
            return JsonResponse({"error": "Token not provided"}, status=400)

        try:
            id_info = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                settings.GOOGLE_OAUTH_CLIENT_ID
            )
        except ValueError as e:
            logger.warning(f"Token verification failed: {str(e)}")
            return JsonResponse({"error": "Invalid token"}, status=400)

        expiry_timestamp = id_info.get("exp")
        if expiry_timestamp and datetime.now(timezone.utc).timestamp() > expiry_timestamp:
            logger.info("Expired Google token")
            return JsonResponse({"error": "Expired token"}, status=401)

        email = id_info.get('email')
        if not email:
            logger.warning("Email not found in token")
            return JsonResponse({"error": "Email not found in token"}, status=400)

        User = get_user_model()
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": id_info.get('given_name', ''),
                "last_name": id_info.get('family_name', ''),
            }
        )

        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)

        logger.info(f"{'Created' if created else 'Logged in'} user: {email}")

        return JsonResponse({
            "status": "success",
            "user": {"email": email}
        })

    except Exception as e:
        logger.exception("Unexpected error during Google signup")
        return JsonResponse({"error": "Internal server error"}, status=500)

@require_POST
def signup(request):


    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    email = data.get("email")
    full_name = data.get("name", "").strip()
    password = data.get("password")
    if not email or not full_name or not password:
        return JsonResponse({"error": "Email, name, and password are required."}, status=400)

    if " " in full_name:
        first_name, last_name = full_name.split(" ", 1)
    else:
        first_name = full_name
        last_name = ""

    User = get_user_model()

    try:
        User.objects.get(email=email)
        return JsonResponse({"error": "Email already exists."}, status=400)
    except User.DoesNotExist:
        pass

    try:
        # Create the new user
        User.objects.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password
        )
        # Authenticate the user using the credentials
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)  # login now sets the backend automatically
        else:
            return JsonResponse({"error": "Authentication failed."}, status=400)
    except Exception as e:
        return JsonResponse({"error": f"Error creating user: {e}"}, status=500)

    return JsonResponse({
        "status": "success",
        "user": {
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    })

@require_GET
def authcontext(request):
    if request.user.is_authenticated:
        # Prepare a user info object with the data you want to expose.
        user_info = {
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            # You can include other fields as needed.
            # 'profile_picture': request.user.profile_picture,
        }
        return JsonResponse({
            'isAuthenticated': True,
            'user': user_info
        })
    else:
        return JsonResponse({
            'isAuthenticated': False,
            'user': None
        })



@require_POST
def logout_view(request):
    user = request.user if request.user.is_authenticated else None
    logout(request)

    if user:
        logger.info(f"User logged out: {user.email}")
    else:
        logger.info("Anonymous user session logged out.")

    return JsonResponse({"message": "Successfully logged out."})



@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {"errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    User = get_user_model()

    try:
        # First check if account exists
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"error": "Account with this email does not exist"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Now check password
    auth_user = authenticate(request, email=email, password=password)
    if not auth_user:
        return Response(
            {"error": "Incorrect password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Check if account is active
    if not auth_user.is_active:
        return Response(
            {"error": "Account is disabled"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, auth_user)

    return Response({
        "status": "success",
        "user": {
            "email": auth_user.email,
            "first_name": auth_user.first_name,
            "last_name": auth_user.last_name
            # "profile_picture": auth_user.profile_picture,
        }
    })


@api_view(['POST'])
def password_reset_request(request):
    serializer = PasswordResetSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        # Always return 200 even if email doesn't exist to prevent email enumeration
        return Response({'detail': 'If an account exists, you will receive a password reset email.'},
                        status=status.HTTP_200_OK)

    # Return validation errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




User = get_user_model()

@require_POST
def reset_password_confirm(request):
    try:
        data = json.loads(request.body)
        uid = data.get("uid")
        token = data.get("token")
        new_password = data.get("new_password")

        logger.debug(f"Reset request data: uid={uid}, token={token}, new_password={'***' if new_password else 'None'}")

        if not uid or not token or not new_password:
            logger.warning("Missing fields in password reset request")
            return JsonResponse({"message": "Missing data."}, status=400)

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)
            logger.info(f"Password reset requested for user: {user.email}")
        except (User.DoesNotExist, ValueError, TypeError) as e:
            logger.warning(f"Invalid UID or user does not exist: {e}")
            return JsonResponse({"message": "Invalid user."}, status=400)

        if not default_token_generator.check_token(user, token):
            logger.warning(f"Invalid or expired token for user: {user.email}")
            return JsonResponse({"message": "Invalid or expired token."}, status=400)

        user.set_password(new_password)
        user.save()
        logger.info(f"Password reset successful for user: {user.email}")

        return JsonResponse({"message": "Password reset successful."})

    except Exception as e:
        logger.exception("Unexpected error during password reset confirmation")
        return JsonResponse({"message": "An error occurred."}, status=500)


