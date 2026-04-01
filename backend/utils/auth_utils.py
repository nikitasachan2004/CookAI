from flask_bcrypt import Bcrypt
from flask import jsonify
from flask_jwt_extended import create_access_token, create_refresh_token

bcrypt = Bcrypt()


def hash_password(plain_password: str) -> str:
    """Return a bcrypt hash of the given plaintext password."""
    return bcrypt.generate_password_hash(plain_password).decode("utf-8")


def verify_password(plain_password: str, password_hash: str) -> bool:
    """Return True if the plaintext matches the stored hash."""
    return bcrypt.check_password_hash(password_hash, plain_password)


def normalize_email(email: str | None) -> str:
    """Return a normalized email address for consistent lookup/storage."""
    return (email or "").strip().lower()


def validate_password_strength(password: str | None) -> str | None:
    """Return an error message when the password does not meet minimum rules."""
    if not password:
        return "Field 'password' is required"
    if len(password) < 8:
        return "Password must be at least 8 characters"
    return None


def build_token_pair(user_id: int) -> dict[str, str]:
    """Create a fresh access and refresh token pair for a user."""
    identity = str(user_id)
    return {
        "access_token": create_access_token(identity=identity),
        "refresh_token": create_refresh_token(identity=identity),
    }


def build_access_token(user_id: int | str) -> str:
    """Create a fresh access token for a user."""
    return create_access_token(identity=str(user_id))


def success_response(payload: dict, status_code: int = 200):
    """Return a consistent JSON success response."""
    return jsonify(payload), status_code


def error_response(message: str, status_code: int, *, details: dict | None = None):
    """Return a consistent JSON error response."""
    default_codes = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        409: "CONFLICT",
        429: "RATE_LIMITED",
        500: "INTERNAL_SERVER_ERROR",
        502: "BAD_GATEWAY",
    }
    payload = {
        "error": message,
        "code": default_codes.get(status_code, "ERROR"),
        "status": status_code,
    }
    if details:
        payload["details"] = details
    return jsonify(payload), status_code
