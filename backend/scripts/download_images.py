from __future__ import annotations

import io
import os
import sys
import time

import requests
from PIL import Image

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from scripts.mealdb_utils import (
    IMAGE_DELAY_SECONDS,
    PLACEHOLDER_IMAGE_PATH,
    build_local_image_disk_path,
    build_local_image_web_path,
    ensure_image_directories,
    load_recipe_cache,
    save_image_map,
    slugify_recipe_title,
)


PLACEHOLDER_URL = "https://via.placeholder.com/400x300?text=CookAI"


def _save_as_jpg(content: bytes, destination: str) -> None:
    image = Image.open(io.BytesIO(content)).convert("RGB")
    image.save(destination, format="JPEG", quality=90)


def _ensure_placeholder() -> str:
    ensure_image_directories()
    if os.path.exists(PLACEHOLDER_IMAGE_PATH):
        return PLACEHOLDER_IMAGE_PATH

    try:
        response = requests.get(PLACEHOLDER_URL, timeout=30)
        response.raise_for_status()
        _save_as_jpg(response.content, PLACEHOLDER_IMAGE_PATH)
    except Exception:
        image = Image.new("RGB", (400, 300), color=(238, 227, 215))
        image.save(PLACEHOLDER_IMAGE_PATH, format="JPEG", quality=90)
    return PLACEHOLDER_IMAGE_PATH


def main() -> None:
    recipes = load_recipe_cache()
    if not recipes:
        raise RuntimeError("Recipe cache not found. Run python3 backend/scripts/download_recipes.py first.")

    placeholder_path = _ensure_placeholder()
    image_map: dict[str, str] = {}

    for index, recipe in enumerate(recipes, start=1):
        title = recipe.get("title") or "Untitled Recipe"
        slug = slugify_recipe_title(title)
        destination = build_local_image_disk_path(recipe)
        web_path = build_local_image_web_path(recipe)
        os.makedirs(os.path.dirname(destination), exist_ok=True)

        print(f"Downloading {index}/{len(recipes)} — {title}")

        if os.path.exists(destination):
            image_map[slug] = web_path
            time.sleep(IMAGE_DELAY_SECONDS)
            continue

        remote_url = (recipe.get("image_url") or "").strip()
        if remote_url:
            try:
                response = requests.get(remote_url, timeout=30)
                response.raise_for_status()
                _save_as_jpg(response.content, destination)
                image_map[slug] = web_path
            except Exception:
                image_map[slug] = "/recipe-images/placeholder.jpg"
        else:
            image_map[slug] = "/recipe-images/placeholder.jpg"

        if image_map[slug] == "/recipe-images/placeholder.jpg" and not os.path.exists(destination):
            # Keep a deterministic file target for successful future retries while using the placeholder now.
            pass

        time.sleep(IMAGE_DELAY_SECONDS)

    if not os.path.exists(placeholder_path):
        raise RuntimeError("Placeholder image could not be created")

    save_image_map(image_map)
    print(f"Saved image map for {len(image_map)} recipes")


if __name__ == "__main__":
    main()
