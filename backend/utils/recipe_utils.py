from db import db
from models.ingredient import Ingredient


def normalize_ingredient_name(value: str | None) -> str:
    return " ".join((value or "").strip().lower().split())


def normalize_ingredient_list(values: list[str] | None) -> list[str]:
    seen: set[str] = set()
    normalized: list[str] = []
    for value in values or []:
        name = normalize_ingredient_name(value)
        if name and name not in seen:
            seen.add(name)
            normalized.append(name)
    return normalized


def normalize_tag_list(values: list[str] | None) -> list[str]:
    seen: set[str] = set()
    normalized: list[str] = []
    for value in values or []:
        name = " ".join((value or "").strip().split())
        if name and name.lower() not in seen:
            seen.add(name.lower())
            normalized.append(name)
    return normalized


def get_or_create_ingredient_records(names: list[str]) -> list[Ingredient]:
    if not names:
        return []

    existing = Ingredient.query.filter(Ingredient.name.in_(names)).all()
    existing_map = {ingredient.name: ingredient for ingredient in existing}
    pending_map = {
        ingredient.name: ingredient
        for ingredient in db.session.new
        if isinstance(ingredient, Ingredient) and ingredient.name
    }

    records: list[Ingredient] = []
    for name in names:
        ingredient = existing_map.get(name) or pending_map.get(name)
        if ingredient is None:
            ingredient = Ingredient(name=name)
            pending_map[name] = ingredient
        records.append(ingredient)
    return records
