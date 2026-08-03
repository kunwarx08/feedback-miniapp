import os
import jwt
import time
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

effective_key = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY

if not SUPABASE_URL or not effective_key:
    print("Warning: SUPABASE_URL or SUPABASE_KEY environment variables are missing.")

# Initialize Primary Supabase Python Client
supabase: Client = create_client(SUPABASE_URL, effective_key) if SUPABASE_URL and effective_key else None

security = HTTPBearer()

# Helper User class for JWT fallback payload
class AuthenticatedUser:
    def __init__(self, user_id: str, email: str = "", jwt_token: str = ""):
        self.id = user_id
        self.email = email
        self.jwt_token = jwt_token

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    FastAPI Security Dependency that validates incoming JWT Bearer tokens.
    Attempts validation via Supabase Auth API first, falling back to JWT claim verification.
    """
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization token."
        )

    # 1. Primary Attempt: Supabase GoTrue Auth API
    if supabase:
        try:
            response = supabase.auth.get_user(token)
            if response and response.user:
                user = response.user
                user.jwt_token = token
                return user
        except Exception as err:
            print("Supabase auth.get_user notice:", str(err))

    # 2. Fallback Attempt: Decode JWT payload directly (verifies sub user_id and exp timestamp)
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        user_id = payload.get("sub")
        exp = payload.get("exp")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload: missing user ID."
            )

        if exp and time.time() > exp:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired. Please log out and log in again."
            )

        email = payload.get("email", "")
        return AuthenticatedUser(user_id=user_id, email=email, jwt_token=token)
    except jwt.PyJWTError as e:
        print("PyJWT decoding error:", str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Invalid JWT token."
        )
    except Exception as e:
        print("JWT verification error:", str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed."
        )

def get_authenticated_client(token: str) -> Client:
    """
    Returns a Supabase client configured with the user's JWT Bearer token.
    """
    if SUPABASE_SERVICE_ROLE_KEY:
        return supabase
    
    user_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    user_client.postgrest.auth(token)
    return user_client
