from __future__ import annotations

from models.recipe import Recipe
from utils.ingredient_parser import parse_ingredient_list


def serialize_recipe_detail(recipe: Recipe) -> dict:
    return {
        "id": recipe.id,
        "title": recipe.title,
        "description": recipe.description,
        "cuisine": recipe.cuisine,
        "image_url": recipe.image_url or recipe.local_image_path,
        "prep_time": recipe.prep_time,
        "cook_time": recipe.cook_time,
        "servings": recipe.servings,
        "difficulty": recipe.difficulty,
        "ingredients": parse_ingredient_list(recipe.ingredients if isinstance(recipe.ingredients, list) else []),
        "steps": [step.to_dict() for step in recipe.steps],
        "tags": recipe.tags or [],
        "source_url": recipe.source_url,
    }
