from datetime import datetime, timezone

from db import db


class UserPreference(db.Model):
    __tablename__ = "user_preferences"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    diet_type = db.Column(db.String(100), nullable=True)
    preferred_cuisine = db.Column(db.String(100), nullable=True)
    max_prep_time = db.Column(db.Integer, nullable=True)

    user = db.relationship("User", back_populates="preference")

    def update_from_dict(self, data: dict):
        self.diet_type = (data.get("diet_type") or self.diet_type or None)
        self.preferred_cuisine = (data.get("preferred_cuisine") or self.preferred_cuisine or None)
        self.max_prep_time = data.get("max_prep_time", self.max_prep_time)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "diet_type": self.diet_type,
            "preferred_cuisine": self.preferred_cuisine,
            "max_prep_time": self.max_prep_time,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
