from __future__ import annotations

import json
import os
import re
import time
import urllib.parse
import urllib.error
import urllib.request


MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1"
CATEGORIES = [
    "Beef",
    "Chicken",
    "Seafood",
    "Vegetarian",
    "Pasta",
    "Dessert",
    "Breakfast",
    "Lamb",
    "Pork",
    "Side",
    "Starter",
    "Vegan",
    "Miscellaneous",
]
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SEED_DATA_DIR = os.path.join(ROOT_DIR, "database", "seed_data")
SEED_DATA_PATH = os.path.join(SEED_DATA_DIR, "recipes.json")
IMAGE_MAP_PATH = os.path.join(SEED_DATA_DIR, "image_map.json")
FRONTEND_IMAGE_DIR = os.path.join(ROOT_DIR, "cookai-frontend", "public", "recipe-images")
PLACEHOLDER_IMAGE_PATH = os.path.join(FRONTEND_IMAGE_DIR, "placeholder.jpg")
REQUEST_DELAY_SECONDS = 2
IMAGE_DELAY_SECONDS = 0.5
MAX_FETCH_RETRIES = 3


def slugify_recipe_title(title: str) -> str:
    lowered = (title or "").strip().lower()
    slug = re.sub(r"[^a-z0-9]+", "_", lowered).strip("_")
    return slug or "recipe"


def normalize_category_name(category: str | None) -> str:
    value = (category or "miscellaneous").strip().lower()
    return re.sub(r"[^a-z0-9]+", "_", value).strip("_") or "miscellaneous"


def get_recipe_category(recipe: dict) -> str:
    if recipe.get("category"):
        return str(recipe["category"]).strip()
    for tag in recipe.get("tags") or []:
        if any(str(tag).strip().lower() == category.lower() for category in CATEGORIES):
            return str(tag).strip()
    return "Miscellaneous"


def build_local_image_web_path(recipe: dict) -> str:
    category = normalize_category_name(get_recipe_category(recipe))
    filename = f"{slugify_recipe_title(recipe.get('title') or '')}.jpg"
    return f"/recipe-images/{category}/{filename}"


def build_local_image_disk_path(recipe: dict) -> str:
    category = normalize_category_name(get_recipe_category(recipe))
    filename = f"{slugify_recipe_title(recipe.get('title') or '')}.jpg"
    return os.path.join(FRONTEND_IMAGE_DIR, category, filename)


def ensure_image_directories() -> None:
    os.makedirs(FRONTEND_IMAGE_DIR, exist_ok=True)
    for category in CATEGORIES:
        os.makedirs(os.path.join(FRONTEND_IMAGE_DIR, normalize_category_name(category)), exist_ok=True)


def _fetch_json(path: str, params: dict[str, str] | None = None) -> dict:
    query = urllib.parse.urlencode(params or {})
    url = f"{MEALDB_BASE_URL}{path}"
    if query:
        url = f"{url}?{query}"

    last_error = None
    for attempt in range(1, MAX_FETCH_RETRIES + 1):
        try:
            with urllib.request.urlopen(url, timeout=30) as response:
                payload = json.loads(response.read().decode("utf-8"))
            time.sleep(REQUEST_DELAY_SECONDS)
            return payload
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            last_error = exc
            print(f"Request failed for {url} (attempt {attempt}/{MAX_FETCH_RETRIES}): {exc}")
            time.sleep(min(5 * attempt, 15))
    print(f"Skipping {url} after retries due to: {last_error}")
    return {}


def _estimate_time(instructions: str | None) -> int:
    length = len((instructions or "").strip())
    if length < 400:
        return 15
    if length < 900:
        return 30
    return 45


def _build_ingredients(meal: dict) -> list[str]:
    ingredients: list[str] = []
    for index in range(1, 21):
        ingredient = (meal.get(f"strIngredient{index}") or "").strip()
        measure = (meal.get(f"strMeasure{index}") or "").strip()
        if not ingredient:
            continue
        ingredients.append(" ".join(part for part in [measure, ingredient] if part).strip())
    return ingredients


def _build_tags(meal: dict, category: str) -> list[str]:
    tags = [category]
    raw_tags = (meal.get("strTags") or "").strip()
    if raw_tags:
        tags.extend(tag.strip() for tag in raw_tags.split(",") if tag.strip())

    seen: set[str] = set()
    normalized: list[str] = []
    for tag in tags:
        lowered = tag.lower()
        if lowered not in seen:
            seen.add(lowered)
            normalized.append(tag)
    return normalized


def _build_recipe_payload(meal: dict, category: str) -> dict:
    ingredients = _build_ingredients(meal)
    estimated_time = _estimate_time(meal.get("strInstructions"))

    if len(ingredients) < 5:
        difficulty = "Easy"
    elif len(ingredients) < 10:
        difficulty = "Medium"
    else:
        difficulty = "Hard"

    return {
        "title": (meal.get("strMeal") or "").strip(),
        "description": f"{(meal.get('strArea') or 'Global').strip()} {category.lower()} recipe".strip(),
        "category": category,
        "cuisine": (meal.get("strArea") or "").strip() or None,
        "instructions": (meal.get("strInstructions") or "").strip(),
        "ingredients": ingredients,
        "image_url": (meal.get("strMealThumb") or "").strip() or None,
        "prep_time": estimated_time,
        "cook_time": estimated_time,
        "servings": 4,
        "difficulty": difficulty,
        "tags": _build_tags(meal, category),
        "source_url": (meal.get("strSource") or "").strip() or None,
    }


def fetch_recipes_from_mealdb(existing_recipes: list[dict] | None = None) -> tuple[list[dict], dict[str, int]]:
    recipes_by_title: dict[str, dict] = {
        str(recipe.get("title")).strip().lower(): recipe
        for recipe in existing_recipes or []
        if recipe.get("title")
    }
    category_counts: dict[str, int] = {}

    for category in CATEGORIES:
        category_payload = _fetch_json("/filter.php", {"c": category})
        meals = category_payload.get("meals") or []
        category_counts[category] = len(meals)

        for index, meal_stub in enumerate(meals, start=1):
            title_key = str(meal_stub.get("strMeal") or "").strip().lower()
            if title_key in recipes_by_title:
                continue
            print(f"Fetching {category} recipes... {index}/{len(meals)}")
            meal_payload = _fetch_json("/lookup.php", {"i": str(meal_stub["idMeal"])})
            meal_details = (meal_payload.get("meals") or [None])[0]
            if not meal_details:
                continue

            recipe = _build_recipe_payload(meal_details, category)
            title_key = recipe["title"].strip().lower()
            if recipe["title"] and title_key not in recipes_by_title:
                recipes_by_title[title_key] = recipe

        save_recipe_cache(list(recipes_by_title.values()))

    return list(recipes_by_title.values()), category_counts


def save_recipe_cache(recipes: list[dict]) -> str:
    os.makedirs(SEED_DATA_DIR, exist_ok=True)
    with open(SEED_DATA_PATH, "w", encoding="utf-8") as handle:
        json.dump(recipes, handle, indent=2)
    return SEED_DATA_PATH


def load_recipe_cache() -> list[dict]:
    if not os.path.exists(SEED_DATA_PATH):
        return []
    with open(SEED_DATA_PATH, "r", encoding="utf-8") as handle:
        return json.load(handle)


def save_image_map(image_map: dict[str, str]) -> str:
    os.makedirs(SEED_DATA_DIR, exist_ok=True)
    with open(IMAGE_MAP_PATH, "w", encoding="utf-8") as handle:
        json.dump(image_map, handle, indent=2, sort_keys=True)
    return IMAGE_MAP_PATH


def load_image_map() -> dict[str, str]:
    if not os.path.exists(IMAGE_MAP_PATH):
        return {}
    with open(IMAGE_MAP_PATH, "r", encoding="utf-8") as handle:
        return json.load(handle)


def build_category_counts(recipes: list[dict]) -> dict[str, int]:
    counts = {category: 0 for category in CATEGORIES}
    for recipe in recipes:
        category = get_recipe_category(recipe)
        for known_category in CATEGORIES:
            if category.lower() == known_category.lower():
                counts[known_category] += 1
                break
    return {category: count for category, count in counts.items() if count > 0}
