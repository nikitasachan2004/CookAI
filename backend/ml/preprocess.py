from __future__ import annotations

import pandas as pd
from sqlalchemy import func

from db import db
from models.recipe import Recipe


def get_recipe_dataset_signature() -> tuple[int, str]:
    """Return a lightweight signature used to detect recipe dataset changes."""
    recipe_count, latest_created_at = db.session.query(
        func.count(Recipe.id),
        func.max(Recipe.created_at),
    ).one()
    return recipe_count or 0, latest_created_at.isoformat() if latest_created_at else ""


def _ingredients_to_text(ingredients) -> str:
    if not ingredients:
        return ""
    if isinstance(ingredients, list):
        return " ".join(str(item).strip().lower() for item in ingredients if str(item).strip())
    return str(ingredients).strip().lower()


def load_recipe_dataframe() -> pd.DataFrame:
    """Fetch recipes from PostgreSQL and convert them to a vectorizer-ready DataFrame."""
    recipes = Recipe.query.order_by(Recipe.id.asc()).all()

    rows = [
        {
            "id": recipe.id,
            "title": recipe.title,
            "ingredients": recipe.ingredients,
            "ingredients_text": _ingredients_to_text(recipe.ingredients),
            "cuisine": recipe.cuisine,
            "prep_time": recipe.prep_time,
        }
        for recipe in recipes
    ]

    return pd.DataFrame(
        rows,
        columns=["id", "title", "ingredients", "ingredients_text", "cuisine", "prep_time"],
    )


def preprocess_user_input(user_input) -> str:
    """Normalize incoming recommendation input into a vectorizable text string."""
    if isinstance(user_input, str):
        return user_input.strip().lower()
    if isinstance(user_input, list):
        return " ".join(str(item).strip().lower() for item in user_input if str(item).strip())
    return ""
