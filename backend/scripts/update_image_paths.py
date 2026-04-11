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
from models.recipe import Recipe
from scripts.mealdb_utils import build_local_image_disk_path, load_image_map, slugify_recipe_title


def main() -> None:
    image_map = load_image_map()
    if not image_map:
        raise RuntimeError("Image map not found. Run python3 backend/scripts/download_images.py first.")

    updated = 0
    missing: list[str] = []

    with app.app_context():
        ensure_schema()
        recipes = Recipe.query.order_by(Recipe.id.asc()).all()
        for recipe in recipes:
            slug = slugify_recipe_title(recipe.title)
            mapped_path = image_map.get(slug)
            if not mapped_path:
                missing.append(recipe.title)
                continue

            recipe.image_url = mapped_path
            if mapped_path.startswith("/recipe-images/") and mapped_path != "/recipe-images/placeholder.jpg":
                recipe.local_image_path = mapped_path
            elif os.path.exists(build_local_image_disk_path({"title": recipe.title, "tags": recipe.tags or []})):
                recipe.local_image_path = mapped_path
            else:
                recipe.local_image_path = None if mapped_path == "/recipe-images/placeholder.jpg" else mapped_path
            updated += 1

        db.session.commit()

    print(f"Updated {updated}/{updated + len(missing)} recipes with local images")
    if missing:
        print("No image found for: " + ", ".join(missing[:20]))


if __name__ == "__main__":
    main()
