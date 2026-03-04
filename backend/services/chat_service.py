from __future__ import annotations

import re

from openai import OpenAI

from config import Config
from ml.hybrid_recommender import recommend_for_user
from ml.recommender import recommend_recipes
from models.recipe import Recipe
from services.prompt_builder import build_chat_prompt
from utils.logger import log_recommendation_event


COMMON_FILLER_WORDS = {
    "i", "want", "to", "make", "cook", "have", "some", "and",
    "a", "an", "the", "for", "please", "suggest", "recipe", "recipes", "dish", "dishes",
    "could", "should", "would", "can", "my", "me", "we", "us", "need", "something",
    "quick", "easy", "best", "help", "what", "make", "meal",
    "tonight", "today", "dinner", "lunch", "breakfast", "snack",
}
TRIM_FILLER_WORDS = COMMON_FILLER_WORDS | {"with", "using"}
SPLIT_PATTERN = re.compile(r",|\band\b|\bwith\b|\busing\b", re.IGNORECASE)


def _normalize_history(history: object) -> list[dict]:
    if not isinstance(history, list):
        return []

    normalized_history: list[dict] = []
    for item in history[-2:]:
        if not isinstance(item, dict):
            continue
        role = str(item.get("role") or "user").strip().lower()
        content = str(item.get("content") or "").strip()
        if content:
            normalized_history.append({"role": role, "content": content})
    return normalized_history


def extract_ingredient_terms(message: str) -> list[str]:
    lowered = (message or "").strip().lower()
    if not lowered:
        return []

    raw_parts = SPLIT_PATTERN.split(lowered)
    ingredients = []
    seen = set()
    for part in raw_parts:
        tokens = re.findall(r"[a-zA-Z]{2,}", part)
        if not tokens:
            continue

        while tokens and tokens[0] in TRIM_FILLER_WORDS:
            tokens.pop(0)
        while tokens and tokens[-1] in TRIM_FILLER_WORDS:
            tokens.pop()
        if not tokens:
            continue

        meaningful_tokens = [token for token in tokens if token not in COMMON_FILLER_WORDS]
        if not meaningful_tokens:
            continue

        phrase_tokens = meaningful_tokens[:3]
        ingredient = " ".join(phrase_tokens).strip()
        if ingredient and ingredient not in seen:
            seen.add(ingredient)
            ingredients.append(ingredient)
    return ingredients


def _build_retrieval_input(message: str):
    ingredients = extract_ingredient_terms(message)
    return ingredients if ingredients else message


def _get_recommended_recipes(user_id: int | None, message: str, limit: int = 5) -> list[dict]:
    retrieval_input = _build_retrieval_input(message)
    if user_id is not None:
        return recommend_for_user(user_id=user_id, user_input=retrieval_input, filters=None, top_n=limit)

    return recommend_recipes(user_input=retrieval_input, filters=None, top_n=limit)


def _build_client() -> OpenAI:
    if not Config.OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not configured")
    return OpenAI(api_key=Config.OPENAI_API_KEY, timeout=Config.OPENAI_TIMEOUT_SECONDS)


def _hydrate_recipe_context(recommendations: list[dict]) -> list[dict]:
    if not recommendations:
        return []

    recipe_ids = [int(recipe["id"]) for recipe in recommendations[:5]]
    recipe_rows = Recipe.query.filter(Recipe.id.in_(recipe_ids)).all()
    recipe_map = {recipe.id: recipe for recipe in recipe_rows}

    hydrated: list[dict] = []
    for recommendation in recommendations[:5]:
        recipe = recipe_map.get(int(recommendation["id"]))
        hydrated.append(
            {
                "id": recommendation["id"],
                "title": recommendation["title"],
                "ingredients": recipe.ingredients if recipe else [],
                "cuisine": recommendation.get("cuisine") or (recipe.cuisine if recipe else None),
                "prep_time": recommendation.get("prep_time") if recommendation.get("prep_time") is not None else (recipe.prep_time if recipe else None),
                "final_score": recommendation.get("final_score", recommendation.get("similarity_score")),
                "explanation": recommendation.get("explanation"),
            }
        )
    return hydrated


def _fallback_response(message: str, recipes: list[dict]) -> str:
    if recipes:
        titles = ", ".join(recipe["title"] for recipe in recipes[:3])
        return (
            f"I found a few likely matches for your request: {titles}. "
            "Please review the suggested recipes while the AI assistant is temporarily unavailable."
        )

    extracted = extract_ingredient_terms(message)
    if extracted:
        return (
            f"I could not reach the AI assistant right now, but based on your ingredients "
            f"({', '.join(extracted[:5])}), try a simple saute, pasta, stir-fry, or soup using what you have."
        )

    return "I could not reach the AI assistant right now, but I can still help once you try again with ingredients or a dish idea."


def _call_llm(prompt: dict[str, str]) -> str:
    client = _build_client()
    response = client.responses.create(
        model=Config.OPENAI_CHAT_MODEL,
        input=[
            {"role": "system", "content": prompt["system"]},
            {"role": "user", "content": prompt["user"]},
        ],
    )
    return response.output_text.strip()


def generate_chat_response(message: str, user_id: int | None = None, history: object = None) -> dict:
    cleaned_message = (message or "").strip()
    if not cleaned_message:
        raise ValueError("Message cannot be empty")

    extracted_ingredients = extract_ingredient_terms(cleaned_message)
    retrieved_recipes = _get_recommended_recipes(user_id=user_id, message=cleaned_message, limit=5)
    structured_recipes = _hydrate_recipe_context(retrieved_recipes)
    log_recommendation_event(
        {
            "user_id": user_id,
            "query": cleaned_message,
            "extracted_ingredients": extracted_ingredients,
            "recommended_recipe_ids": [recipe["id"] for recipe in structured_recipes],
        }
    )
    normalized_history = _normalize_history(history)
    prompt = build_chat_prompt(
        user_query=cleaned_message,
        extracted_ingredients=extracted_ingredients,
        recipes=structured_recipes,
        history=normalized_history,
    )

    try:
        response_text = _call_llm(prompt)
    except Exception:
        response_text = _fallback_response(cleaned_message, structured_recipes)

    return {
        "response": response_text,
        "recipes": structured_recipes,
        "sources": [recipe["title"] for recipe in structured_recipes],
    }
