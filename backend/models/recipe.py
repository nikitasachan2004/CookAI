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
    cook_time = db.Column(db.Integer, nullable=True)
    servings = db.Column(db.Integer, nullable=True, default=2)
    difficulty = db.Column(db.String(50), nullable=True)
    tags = db.Column(db.JSON, nullable=False, default=list)
    image_url = db.Column(db.Text, nullable=True)
    local_image_path = db.Column(db.Text, nullable=True)
    source_url = db.Column(db.Text, nullable=True)
    view_count = db.Column(db.Integer, nullable=False, default=0)
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
    steps = db.relationship(
        "RecipeStep",
        back_populates="recipe",
        cascade="all, delete-orphan",
        order_by="RecipeStep.step_number",
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
            "cook_time": self.cook_time,
            "servings": self.servings,
            "difficulty": self.difficulty,
            "tags": self.tags or [],
            "image_url": self.image_url,
            "local_image_path": self.local_image_path,
            "source_url": self.source_url,
            "view_count": self.view_count,
            "ingredient_records": [ingredient.to_dict() for ingredient in self.ingredient_records],
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
