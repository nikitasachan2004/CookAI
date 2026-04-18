# Import all models so SQLAlchemy registers them when this package is imported
from models.ingredient import Ingredient, recipe_ingredients
from models.user import User
from models.user_preference import UserPreference
from models.recipe import Recipe
from models.recipe_step import RecipeStep
from models.favorite import Favorite
from models.rating import Rating

__all__ = ["Ingredient", "recipe_ingredients", "User", "UserPreference", "Recipe", "RecipeStep", "Favorite", "Rating"]
