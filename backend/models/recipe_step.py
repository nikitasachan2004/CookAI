from datetime import datetime, timezone

from db import db


class RecipeStep(db.Model):
    __tablename__ = "recipe_steps"

    id = db.Column(db.Integer, primary_key=True)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id", ondelete="CASCADE"), nullable=False)
    step_number = db.Column(db.Integer, nullable=False)
    instruction = db.Column(db.Text, nullable=False)
    timer_minutes = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    recipe = db.relationship("Recipe", back_populates="steps")

    def to_dict(self):
        return {
            "step": self.step_number,
            "instruction": self.instruction,
            "timer_minutes": self.timer_minutes,
        }
