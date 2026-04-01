from db import db
from datetime import datetime, timezone
from utils.auth_utils import hash_password, verify_password


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    favorites = db.relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    ratings = db.relationship("Rating", back_populates="user", cascade="all, delete-orphan")
    preference = db.relationship(
        "UserPreference",
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
    )

    def set_password(self, plain_password: str):
        """Hash and store the password."""
        self.password_hash = hash_password(plain_password)

    def check_password(self, plain_password: str) -> bool:
        """Verify a plaintext password against the stored hash."""
        return verify_password(plain_password, self.password_hash)

    def to_dict(self):
        """Return user data — never includes password_hash."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "preferences": self.preference.to_dict() if self.preference else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
