from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from sqlalchemy.exc import IntegrityError
from config import Config
from db import db
from utils.auth_utils import bcrypt
from routes import register_routes


def create_app():
    """Application factory — creates and configures the Flask app."""
    app = Flask(__name__)
    app.config.from_object(Config)

    if not app.config.get("SQLALCHEMY_DATABASE_URI"):
        raise RuntimeError("DATABASE_URL is not configured")
    if not app.config.get("JWT_SECRET_KEY"):
        raise RuntimeError("JWT_SECRET_KEY is not configured")

    # Extensions
    CORS(app)
    db.init_app(app)
    bcrypt.init_app(app)
    jwt = JWTManager(app)

    # Register route blueprints
    register_routes(app)

    # ── Core routes ──────────────────────────────────────────

    @app.route("/")
    def index():
        return jsonify({
            "message": "CookAI Recipe API",
            "version": "1.0.0",
            "status": "running",
        })

    @app.route("/health")
    def health():
        return jsonify({"status": "ok", "api": "CookAI"})

    # ── Error handlers ───────────────────────────────────────

    @jwt.unauthorized_loader
    def handle_missing_jwt(reason):
        return jsonify({"error": "Authorization token is required", "details": {"reason": reason}}), 401

    @jwt.invalid_token_loader
    def handle_invalid_jwt(reason):
        return jsonify({"error": "Invalid authentication token", "details": {"reason": reason}}), 401

    @jwt.expired_token_loader
    def handle_expired_jwt(jwt_header, jwt_payload):
        return jsonify({"error": "Authentication token has expired"}), 401

    @jwt.needs_fresh_token_loader
    def handle_non_fresh_token(jwt_header, jwt_payload):
        return jsonify({"error": "Fresh authentication token required"}), 401

    @jwt.revoked_token_loader
    def handle_revoked_token(jwt_header, jwt_payload):
        return jsonify({"error": "Authentication token has been revoked"}), 401

    @jwt.user_lookup_error_loader
    def handle_missing_user(jwt_header, jwt_payload):
        return jsonify({"error": "Authenticated user could not be loaded"}), 401

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad request"}), 400

    @app.errorhandler(IntegrityError)
    def integrity_error(error):
        db.session.rollback()
        return jsonify({"error": "Database constraint violation"}), 409

    @app.errorhandler(500)
    def server_error(error):
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

    return app


# ── Entry point ──────────────────────────────────────────────

app = create_app()

if __name__ == "__main__":
    # Import models so create_all() sees every table
    import models  # noqa: F401

    with app.app_context():
        db.create_all()
        print("✓ Database tables created")

    print("Starting CookAI API …")
    print("→ http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
