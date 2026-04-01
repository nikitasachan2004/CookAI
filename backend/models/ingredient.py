from datetime import datetime, timezone

from db import db

recipe_ingredients = db.Table(
    "recipe_ingredients",
    db.Column("recipe_id", db.Integer, db.ForeignKey("recipes.id", ondelete="CASCADE"), primary_key=True),
    db.Column("ingredient_id", db.Integer, db.ForeignKey("ingredients.id", ondelete="CASCADE"), primary_key=True),
)


class Ingredient(db.Model):
    __tablename__ = "ingredients"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    recipes = db.relationship(
        "Recipe",
        secondary=recipe_ingredients,
        back_populates="ingredient_records",
        lazy="selectin",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
