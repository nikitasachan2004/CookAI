from flask import Blueprint, request
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required,
)
from db import db
from models.user import User
from models.user_preference import UserPreference
from utils.auth_utils import (
    build_access_token,
    build_token_pair,
    error_response,
    normalize_email,
    success_response,
    validate_password_strength,
)

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# ── Register ─────────────────────────────────────────────────

@auth_bp.route("/register", methods=["POST"])
def register():
    """Create a new user account and return JWT tokens."""
    data = request.get_json(silent=True)
    if data is None:
        return error_response("Request body must be valid JSON", 400)

    name = (data.get("name") or "").strip()
    email = normalize_email(data.get("email"))
    password = data.get("password") or ""

    if not name:
        return error_response("Field 'name' is required", 400)
    if not email:
        return error_response("Field 'email' is required", 400)

    password_error = validate_password_strength(password)
    if password_error:
        return error_response(password_error, 400)

    if User.query.filter_by(email=email).first():
        return error_response("Email already registered", 409)

    user = User(name=name, email=email)
    user.set_password(password)

    db.session.add(user)
    db.session.flush()
    db.session.add(UserPreference(user_id=user.id))
    db.session.commit()

    tokens = build_token_pair(user.id)
    return success_response({"user": user.to_dict(), **tokens}, 201)


# ── Login ────────────────────────────────────────────────────

@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate with email + password, return JWT tokens."""
    data = request.get_json(silent=True)
    if data is None:
        return error_response("Request body must be valid JSON", 400)

    email = normalize_email(data.get("email"))
    password = data.get("password") or ""

    if not email or not password:
        return error_response("Email and password are required", 400)

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return error_response("Invalid email or password", 401)

    tokens = build_token_pair(user.id)
    return success_response({"user": user.to_dict(), **tokens}, 200)


# ── Refresh Token ────────────────────────────────────────────

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Exchange a valid refresh token for a new access token."""
    identity = get_jwt_identity()
    return success_response({"access_token": build_access_token(identity)}, 200)


# ── Get Current User ─────────────────────────────────────────

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    """Return the currently authenticated user's profile."""
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return error_response("User not found", 404)

    return success_response({"user": user.to_dict()}, 200)
