from __future__ import annotations

from sqlalchemy import func

from db import db
from ml.recommender import get_content_scores
from models.favorite import Favorite
from models.rating import Rating
from models.user_preference import UserPreference


def _normalize_map(values: dict[int, float]) -> dict[int, float]:
    if not values:
        return {}

    minimum = min(values.values())
    maximum = max(values.values())
    if maximum == minimum:
        return {key: 1.0 if value > 0 else 0.0 for key, value in values.items()}
    return {
        key: (value - minimum) / (maximum - minimum)
        for key, value in values.items()
    }


def _load_user_preference(user_id: int):
    return UserPreference.query.filter_by(user_id=user_id).first()


def _build_preference_scores(ranked_df, preference: UserPreference | None) -> tuple[dict[int, float], dict[int, str]]:
    preference_scores: dict[int, float] = {}
    explanations: dict[int, str] = {}

    if ranked_df.empty or preference is None:
        return preference_scores, explanations

    preferred_cuisine = (preference.preferred_cuisine or "").strip().lower()
    max_prep_time = preference.max_prep_time

    for _, row in ranked_df.iterrows():
        recipe_id = int(row["id"])
        boosts = 0.0
        reasons: list[str] = []

        recipe_cuisine = (row["cuisine"] or "").strip().lower() if row["cuisine"] else ""
        if preferred_cuisine and recipe_cuisine == preferred_cuisine:
            boosts += 0.6
            reasons.append(f"you like {row['cuisine']} cuisine")

        recipe_prep_time = row["prep_time"]
        if max_prep_time is not None and recipe_prep_time is not None and recipe_prep_time <= max_prep_time:
            boosts += 0.4
            reasons.append(f"it fits your preferred prep time of {max_prep_time} minutes")

        preference_scores[recipe_id] = min(boosts, 1.0)
        if reasons:
            explanations[recipe_id] = "Recommended because " + " and ".join(reasons)

    return preference_scores, explanations


def _build_popularity_scores(recipe_ids: list[int]) -> dict[int, float]:
    if not recipe_ids:
        return {}

    rating_rows = (
        db.session.query(
            Rating.recipe_id,
            func.avg(Rating.rating),
            func.count(Rating.id),
        )
        .filter(Rating.recipe_id.in_(recipe_ids))
        .group_by(Rating.recipe_id)
        .all()
    )
    favorite_rows = (
        db.session.query(
            Favorite.recipe_id,
            func.count(Favorite.id),
        )
        .filter(Favorite.recipe_id.in_(recipe_ids))
        .group_by(Favorite.recipe_id)
        .all()
    )

    average_ratings = {recipe_id: float(avg_rating) for recipe_id, avg_rating, _ in rating_rows}
    favorite_counts = {recipe_id: float(count) for recipe_id, count in favorite_rows}

    normalized_ratings = _normalize_map(average_ratings)
    normalized_favorites = _normalize_map(favorite_counts)

    popularity_scores: dict[int, float] = {}
    for recipe_id in recipe_ids:
        popularity_scores[recipe_id] = (
            normalized_ratings.get(recipe_id, 0.0) * 0.7
            + normalized_favorites.get(recipe_id, 0.0) * 0.3
        )

    return popularity_scores


def recommend_for_user(user_id: int, user_input, filters: dict | None = None, top_n: int = 5) -> list[dict]:
    """Combine content, preference, and popularity signals for personalized ranking."""
    ranked_df = get_content_scores(user_input, filters)
    if ranked_df.empty:
        return []

    preference = _load_user_preference(user_id)
    preference_scores, preference_explanations = _build_preference_scores(ranked_df, preference)

    recipe_ids = [int(recipe_id) for recipe_id in ranked_df["id"].tolist()]
    popularity_scores = _build_popularity_scores(recipe_ids)

    recommendations: list[dict] = []
    for _, row in ranked_df.iterrows():
        recipe_id = int(row["id"])
        content_score = float(row["similarity_score"])
        preference_score = preference_scores.get(recipe_id, 0.0)
        popularity_score = popularity_scores.get(recipe_id, 0.0)
        final_score = (
            (content_score * 0.6)
            + (preference_score * 0.2)
            + (popularity_score * 0.2)
        )

        explanation = preference_explanations.get(recipe_id)
        if explanation is None:
            if popularity_score > 0:
                explanation = "Recommended because it matches your ingredients and is popular with other users"
            else:
                explanation = "Recommended because it closely matches your ingredient input"

        recommendations.append(
            {
                "id": recipe_id,
                "title": row["title"],
                "final_score": round(final_score, 4),
                "similarity_score": round(content_score, 4),
                "explanation": explanation,
                "cuisine": row["cuisine"],
                "prep_time": int(row["prep_time"]) if row["prep_time"] is not None else None,
            }
        )

    recommendations.sort(key=lambda item: item["final_score"], reverse=True)
    return recommendations[:top_n]
