from datetime import datetime, timezone

from db import db


class Rating(db.Model):
    __tablename__ = "ratings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = db.relationship("User", back_populates="ratings")
    recipe = db.relationship("Recipe", back_populates="ratings")

    __table_args__ = (
        db.UniqueConstraint("user_id", "recipe_id", name="uq_user_recipe_rating"),
        db.CheckConstraint("rating >= 1 AND rating <= 5", name="ck_rating_between_1_and_5"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "recipe_id": self.recipe_id,
            "rating": self.rating,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
