from __future__ import annotations

from mealdb_utils import build_category_counts, fetch_recipes_from_mealdb, load_recipe_cache, save_recipe_cache


def main() -> None:
    cached_recipes = load_recipe_cache()
    if cached_recipes and len(cached_recipes) >= 500:
        recipes = cached_recipes
        category_counts = build_category_counts(recipes)
    else:
        recipes, category_counts = fetch_recipes_from_mealdb(existing_recipes=cached_recipes)
    destination = save_recipe_cache(recipes)
    category_counts = category_counts or build_category_counts(recipes)

    print(f"Saved {len(recipes)} recipes to {destination}")
    print(
        "Categories: "
        + ", ".join(f"{category}({count})" for category, count in category_counts.items())
    )


if __name__ == "__main__":
    main()
