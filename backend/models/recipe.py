from db import db
from datetime import datetime, timezone


class Recipe(db.Model):
    __tablename__ = "recipes"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    ingredients = db.Column(db.JSON, nullable=False)       # stored as JSON array
    instructions = db.Column(db.Text, nullable=False)
    cuisine = db.Column(db.String(100), nullable=True)
    prep_time = db.Column(db.Integer, nullable=True)       # minutes
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    favorites = db.relationship("Favorite", back_populates="recipe", cascade="all, delete-orphan")
    ratings = db.relationship("Rating", back_populates="recipe", cascade="all, delete-orphan")
    ingredient_records = db.relationship(
        "Ingredient",
        secondary="recipe_ingredients",
        back_populates="recipes",
        lazy="selectin",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "ingredients": self.ingredients,
            "instructions": self.instructions,
            "cuisine": self.cuisine,
            "prep_time": self.prep_time,
            "ingredient_records": [ingredient.to_dict() for ingredient in self.ingredient_records],
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
