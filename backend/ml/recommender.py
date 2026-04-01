from __future__ import annotations

import re

from sklearn.metrics.pairwise import cosine_similarity

from ml.preprocess import preprocess_user_input
from ml.vectorizer import get_vector_store


DIETARY_EXCLUSIONS = {
    "vegetarian": {"beef", "pork", "chicken", "fish", "lamb"},
    "vegan": {"beef", "pork", "chicken", "fish", "lamb", "milk", "egg", "cream", "butter", "cheese"},
    "gluten_free": {"flour", "wheat", "bread", "pasta", "barley"},
    "dairy_free": {"milk", "cream", "butter", "cheese", "yogurt"},
}
DIFFICULTY_LEVELS = {"easy", "medium", "hard"}


def _tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z]+", (text or "").lower())


def _extract_preference_tokens(user_input: str, filters: dict | None = None) -> tuple[list[str], set[str], str | None, str | None]:
    tokens = _tokenize(user_input)
    token_set = set(tokens)
    cuisine_hint = str(filters.get("cuisine")).strip().lower() if filters and filters.get("cuisine") else None
    difficulty_hint = str(filters.get("difficulty")).strip().lower() if filters and filters.get("difficulty") else None

    if difficulty_hint is None:
        for token in tokens:
            if token in DIFFICULTY_LEVELS:
                difficulty_hint = token
                break

    ingredient_terms = [
        token
        for token in tokens
        if token not in DIFFICULTY_LEVELS and token != cuisine_hint
    ]
    return ingredient_terms, token_set, cuisine_hint, difficulty_hint


def _apply_filters(dataframe, filters: dict | None):
    if dataframe.empty or not filters:
        return dataframe

    filtered = dataframe

    cuisine = filters.get("cuisine")
    if cuisine:
        filtered = filtered[
            filtered["cuisine"].fillna("").str.lower() == str(cuisine).strip().lower()
        ]

    max_prep_time = filters.get("prep_time")
    if max_prep_time is not None:
        filtered = filtered[
            filtered["prep_time"].notna() & (filtered["prep_time"] <= max_prep_time)
        ]

    max_time = filters.get("max_time")
    if max_time is not None:
        filtered = filtered[
            (
                filtered["prep_time"].fillna(0)
                + filtered["cook_time"].fillna(0)
            ) <= max_time
        ]

    difficulty = filters.get("difficulty")
    if difficulty:
        filtered = filtered[
            filtered["difficulty"].fillna("").str.lower() == str(difficulty).strip().lower()
        ]

    dietary = filters.get("dietary")
    if dietary:
        exclusions = DIETARY_EXCLUSIONS.get(str(dietary).strip().lower(), set())
        if exclusions:
            pattern = "|".join(re.escape(term) for term in sorted(exclusions))
            filtered = filtered[
                ~filtered["ingredients_text"].fillna("").str.contains(pattern, case=False, regex=True)
            ]

    return filtered


def _calculate_total_time(row) -> int | None:
    prep_time = row.get("prep_time")
    cook_time = row.get("cook_time")
    if prep_time is None and cook_time is None:
        return None
    return int(prep_time or 0) + int(cook_time or 0)


def _build_explanation(row, ingredient_terms: list[str], input_tokens: set[str], cuisine_hint: str | None, difficulty_hint: str | None) -> str:
    matched_reasons: list[str] = []
    ingredients_text = row["ingredients_text"]
    matched_ingredients = [term for term in ingredient_terms if term in ingredients_text][:3]
    for term in matched_ingredients:
        matched_reasons.append(f"{term} ✓")

    recipe_cuisine = (row["cuisine"] or "").strip().lower()
    cuisine_tokens = set(_tokenize(recipe_cuisine))
    if (cuisine_hint and cuisine_hint == recipe_cuisine) or (cuisine_tokens and cuisine_tokens & input_tokens):
        matched_reasons.append(f"{recipe_cuisine} cuisine ✓")

    recipe_difficulty = (row["difficulty"] or "").strip().lower()
    if difficulty_hint and difficulty_hint == recipe_difficulty:
        matched_reasons.append(f"{recipe_difficulty} difficulty ✓")

    if not matched_reasons:
        matched_reasons.append("overall recipe profile ✓")

    return "Matched because: " + ", ".join(matched_reasons)


def get_content_scores(user_input, filters: dict | None = None):
    """Return ranked content-based scores for all matching recipes."""
    normalized_input = preprocess_user_input(user_input)
    if not normalized_input:
        raise ValueError("User input cannot be empty")

    vector_store = get_vector_store()
    recipes_df = vector_store.dataframe
    if recipes_df.empty or vector_store.matrix is None:
        return recipes_df

    filtered_df = _apply_filters(recipes_df, filters)
    if filtered_df.empty:
        return filtered_df

    input_vector = vector_store.vectorizer.transform([normalized_input])
    recipe_indices = filtered_df.index.tolist()
    filtered_matrix = vector_store.matrix[recipe_indices]
    similarity_scores = cosine_similarity(input_vector, filtered_matrix).flatten() if filtered_matrix is not None else []
    ingredient_terms, input_tokens, cuisine_hint, difficulty_hint = _extract_preference_tokens(normalized_input, filters)

    ranked = filtered_df.copy()
    ranked["cosine_score"] = similarity_scores

    def ingredient_score(row):
        if not ingredient_terms:
            return float(row["cosine_score"])
        matches = sum(1 for term in ingredient_terms if term in row["ingredients_text"])
        return matches / len(ingredient_terms) if ingredient_terms else 0.0

    def cuisine_score(row):
        recipe_cuisine = (row["cuisine"] or "").strip().lower()
        cuisine_tokens = set(_tokenize(recipe_cuisine))
        if cuisine_hint:
            return 1.0 if recipe_cuisine == cuisine_hint else 0.0
        if cuisine_tokens and cuisine_tokens & input_tokens:
            return 1.0
        return 0.0

    def difficulty_score(row):
        if not difficulty_hint:
            return 0.0
        return 1.0 if (row["difficulty"] or "").strip().lower() == difficulty_hint else 0.0

    max_views = float(ranked["view_count"].max()) if not ranked.empty else 0.0

    ranked["ingredient_match_score"] = ranked.apply(ingredient_score, axis=1)
    ranked["cuisine_match_score"] = ranked.apply(cuisine_score, axis=1)
    ranked["difficulty_match_score"] = ranked.apply(difficulty_score, axis=1)
    ranked["popularity_score"] = ranked["view_count"].apply(
        lambda value: (float(value) / max_views) if max_views else 0.0
    )
    ranked["final_score"] = (
        ranked["ingredient_match_score"] * 0.5
        + ranked["cuisine_match_score"] * 0.3
        + ranked["difficulty_match_score"] * 0.1
        + ranked["popularity_score"] * 0.1
    )
    ranked["similarity_score"] = ranked["final_score"]
    ranked["explanation"] = ranked.apply(
        lambda row: _build_explanation(row, ingredient_terms, input_tokens, cuisine_hint, difficulty_hint),
        axis=1,
    )
    ranked["total_time"] = ranked.apply(_calculate_total_time, axis=1)

    ranked = ranked[
        (ranked["final_score"] > 0) | (ranked["cosine_score"] > 0)
    ].sort_values(
        by="final_score",
        ascending=False,
    )

    return ranked


def recommend_recipes(user_input, filters: dict | None = None, top_n: int = 5) -> list[dict]:
    """Recommend recipes using weighted ingredient, cuisine, difficulty, and popularity signals."""
    ranked = get_content_scores(user_input, filters)
    if ranked.empty:
        return {
            "recommendations": [],
            "message": "No recipes found matching your ingredients. Try different ingredients!",
        }

    top_results = ranked.head(top_n)
    return [
        {
            "id": int(row["id"]),
            "title": row["title"],
            "similarity_score": round(float(row["similarity_score"]), 4),
            "final_score": round(float(row["final_score"]), 4),
            "cuisine": row["cuisine"],
            "prep_time": int(row["prep_time"]) if row["prep_time"] is not None else None,
            "cook_time": int(row["cook_time"]) if row["cook_time"] is not None else None,
            "difficulty": row["difficulty"],
            "image_url": row["image_url"],
            "explanation": row["explanation"],
        }
        for _, row in top_results.iterrows()
    ]
