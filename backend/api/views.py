import json
import traceback  # Add at top of file
from django.contrib.auth import get_user_model, login, logout, authenticate
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from datetime import datetime, timezone  # Correct import for UTC handling

@csrf_exempt
def google_signup(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        # Debug raw request body (consider using proper logging)
        raw_body = request.body
        print(f"Raw request body: {raw_body}")

        # Parse JSON with error handling
        data = json.loads(raw_body.decode('utf-8'))

        # Extract token and ensure it is present
        token = data.get("token")
        if not token:
            return JsonResponse({"error": "Token not provided"}, status=400)

        # Verify token
        try:
            id_info = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                settings.GOOGLE_OAUTH_CLIENT_ID
            )
        except ValueError as e:
            print(f"Token Verification Error: {str(e)}")
            return JsonResponse({"error": "Invalid token"}, status=400)

        # Check token expiration
        expiry_timestamp = id_info.get("exp")
        if expiry_timestamp and datetime.now(timezone.utc).timestamp() > expiry_timestamp:
            return JsonResponse({"error": "Expired token"}, status=401)

        # Extract email
        email = id_info.get('email')
        if not email:
            return JsonResponse({"error": "Email not found in token"}, status=400)

        User = get_user_model()
        # Create/update user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": id_info.get('given_name', ''),
                "last_name": id_info.get('family_name', ''),
            }
        )
        # Assign backend for session-based login
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)

        return JsonResponse({
            "status": "success",
            "user": {"email": email}
        })

    except Exception as e:
        traceback.print_exc()  # Consider using proper logging in production
        return JsonResponse({"error": "Internal server error"}, status=500)


@csrf_exempt
def signup(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

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


@csrf_exempt
def logout_view(request):
    logout(request)
    print("Logged out user")
    return JsonResponse({"message": "Successfully logged out."})


@csrf_exempt
def login_view(request):
    # Allow only POST requests
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    # Parse JSON body
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    # Extract email and password from the data
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return JsonResponse({"error": "Email and password are required."}, status=400)

    # Authenticate the user
    user = authenticate(request, email=email, password=password)
    if user is None:
        return JsonResponse({"error": "Invalid email or password."}, status=401)
    else:
        print("ok this works.")

    # Log the user in
    login(request, user)
    if not user.is_authenticated:
        print("Not logged in")
    else:
        print("work")


    # Optionally, return user details upon successful login
    return JsonResponse({
        "status": "success",
        "user": {
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    })
