from __future__ import annotations

import os
import sys

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app import app
from db import db
from db_schema import ensure_schema
from ml.vectorizer import get_vector_store
from models.recipe import Recipe
from scripts.mealdb_utils import (
    build_category_counts,
    build_local_image_disk_path,
    build_local_image_web_path,
    fetch_recipes_from_mealdb,
    load_recipe_cache,
    save_recipe_cache,
)
from utils.recipe_utils import get_or_create_ingredient_records, normalize_ingredient_list, normalize_tag_list


def _load_seed_data() -> tuple[list[dict], dict[str, int]]:
    cached = load_recipe_cache()
    if cached and len(cached) >= 500:
        print(f"Using cached recipe dataset with {len(cached)} recipes")
        return cached, build_category_counts(cached)

    recipes, category_counts = fetch_recipes_from_mealdb(existing_recipes=cached)
    save_recipe_cache(recipes)
    return recipes, category_counts


def _resolve_image_fields(recipe_data: dict) -> tuple[str | None, str | None]:
    local_web_path = build_local_image_web_path(recipe_data)
    local_disk_path = build_local_image_disk_path(recipe_data)
    remote_url = (recipe_data.get("image_url") or "").strip() or None

    if os.path.exists(local_disk_path):
        return local_web_path, local_web_path
    return remote_url, None


def _upsert_recipes(recipes: list[dict]) -> tuple[int, int]:
    existing_recipes = {
        recipe.title.lower(): recipe
        for recipe in Recipe.query.all()
        if recipe.title
    }

    inserted = 0
    updated = 0
    pending_since_commit = 0

    for recipe_data in recipes:
        title = (recipe_data.get("title") or "").strip()
        title_key = title.lower()
        if not title:
            continue

        normalized_ingredients = normalize_ingredient_list(recipe_data.get("ingredients") or [])
        image_url, local_image_path = _resolve_image_fields(recipe_data)
        existing_recipe = existing_recipes.get(title_key)

        if existing_recipe is None:
            recipe = Recipe(title=title)
            existing_recipes[title_key] = recipe
            db.session.add(recipe)
            inserted += 1
        else:
            recipe = existing_recipe
            updated += 1

        recipe.description = (recipe_data.get("description") or "").strip() or None
        recipe.ingredients = normalized_ingredients
        recipe.instructions = (recipe_data.get("instructions") or "").strip()
        recipe.cuisine = (recipe_data.get("cuisine") or "").strip() or None
        recipe.prep_time = recipe_data.get("prep_time")
        recipe.cook_time = recipe_data.get("cook_time")
        recipe.servings = recipe_data.get("servings") or 4
        recipe.difficulty = (recipe_data.get("difficulty") or "").strip() or None
        recipe.tags = normalize_tag_list(recipe_data.get("tags") or [])
        recipe.image_url = image_url
        recipe.local_image_path = local_image_path
        recipe.source_url = (recipe_data.get("source_url") or "").strip() or None
        recipe.view_count = recipe.view_count or 0
        recipe.ingredient_records = get_or_create_ingredient_records(normalized_ingredients)
        pending_since_commit += 1

        if pending_since_commit >= 50:
            db.session.commit()
            pending_since_commit = 0

    db.session.commit()
    return inserted, updated


def main() -> None:
    recipes, category_counts = _load_seed_data()

    with app.app_context():
        db.create_all()
        ensure_schema()
        inserted, updated = _upsert_recipes(recipes)
        get_vector_store(force_refresh=True)

    print(f"✅ Successfully inserted {inserted} recipes into cookai_db")
    print(f"Updated existing recipes: {updated}")
    if category_counts:
        print("Categories: " + ", ".join(f"{category}({count})" for category, count in category_counts.items()))


if __name__ == "__main__":
    main()
