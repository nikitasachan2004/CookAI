from __future__ import annotations

from sklearn.metrics.pairwise import cosine_similarity

from ml.preprocess import preprocess_user_input
from ml.vectorizer import get_vector_store


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

    return filtered


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
    similarity_scores = cosine_similarity(input_vector, filtered_matrix).flatten()

    ranked = filtered_df.copy()
    ranked["similarity_score"] = similarity_scores
    ranked = ranked[ranked["similarity_score"] > 0].sort_values(
        by="similarity_score",
        ascending=False,
    )

    return ranked


def recommend_recipes(user_input, filters: dict | None = None, top_n: int = 5) -> list[dict]:
    """Recommend recipes using TF-IDF ingredient similarity with optional filters."""
    ranked = get_content_scores(user_input, filters)
    if ranked.empty:
        return {
            "recommendations": [],
            "message": "No recipes found matching your ingredients. Try different ingredients!",
        }

    top_results = ranked.head(top_n)
    recommendations = [
        {
            "id": int(row["id"]),
            "title": row["title"],
            "similarity_score": round(float(row["similarity_score"]), 4),
            "cuisine": row["cuisine"],
            "prep_time": int(row["prep_time"]) if row["prep_time"] is not None else None,
        }
        for _, row in top_results.iterrows()
    ]
    return recommendations
