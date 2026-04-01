from __future__ import annotations

import json

from evaluation.metrics import hit_rate, precision_at_k
from ml.hybrid_recommender import recommend_for_user
from models.favorite import Favorite
from models.rating import Rating
from models.recipe import Recipe
from models.user import User
from utils.logger import LOG_FILE


def _get_relevant_item_ids(user_id: int) -> list[int]:
    favorite_ids = {
        favorite.recipe_id
        for favorite in Favorite.query.filter_by(user_id=user_id).all()
    }
    highly_rated_ids = {
        rating.recipe_id
        for rating in Rating.query.filter_by(user_id=user_id).all()
        if rating.rating >= 4
    }
    return sorted(favorite_ids | highly_rated_ids)


def _load_log_based_recommendations(user_id: int) -> list[int]:
    if not LOG_FILE.exists():
        return []

    try:
        lines = LOG_FILE.read_text(encoding="utf-8").splitlines()
    except Exception:
        return []

    for line in reversed(lines):
        if not line.strip():
            continue
        try:
            payload = json.loads(line)
        except json.JSONDecodeError:
            continue
        if payload.get("user_id") == user_id:
            return [int(recipe_id) for recipe_id in payload.get("recommended_recipe_ids", [])]
    return []


def _simulate_recommendations(user_id: int, relevant_ids: list[int], k: int) -> list[int]:
    if not relevant_ids:
        return []

    seed_recipe = Recipe.query.filter(Recipe.id.in_(relevant_ids)).order_by(Recipe.id.asc()).first()
    if not seed_recipe:
        return []

    candidate_recommendations = recommend_for_user(
        user_id=user_id,
        user_input=seed_recipe.ingredients,
        filters=None,
        top_n=max(k + len(relevant_ids), 10),
    )
    recommended_ids = []
    for recommendation in candidate_recommendations:
        recipe_id = int(recommendation["id"])
        if recipe_id == seed_recipe.id:
            continue
        if recipe_id not in recommended_ids:
            recommended_ids.append(recipe_id)
        if len(recommended_ids) >= k:
            break
    return recommended_ids


def evaluate_user(user_id: int, k: int = 5) -> dict | None:
    relevant_ids = _get_relevant_item_ids(user_id)
    if not relevant_ids:
        return None

    recommended_ids = _load_log_based_recommendations(user_id)
    evaluation_source = "logs"
    if not recommended_ids:
        recommended_ids = _simulate_recommendations(user_id=user_id, relevant_ids=relevant_ids, k=k)
        evaluation_source = "simulation"

    if not recommended_ids:
        return None

    return {
        "user_id": user_id,
        "precision_at_k": round(precision_at_k(recommended_ids, relevant_ids, k), 4),
        "hit_rate": hit_rate(recommended_ids[:k], relevant_ids),
        "num_relevant_items": len(relevant_ids),
        "evaluation_source": evaluation_source,
    }


def evaluate_all_users(k: int = 5) -> dict:
    evaluations = []
    for user in User.query.order_by(User.id.asc()).all():
        result = evaluate_user(user.id, k=k)
        if result is not None:
            evaluations.append(result)

    if not evaluations:
        return {
            "avg_precision_at_k": 0.0,
            "avg_hit_rate": 0.0,
            "num_users_evaluated": 0,
            "k": k,
        }

    avg_precision = sum(item["precision_at_k"] for item in evaluations) / len(evaluations)
    avg_hit_rate = sum(item["hit_rate"] for item in evaluations) / len(evaluations)

    return {
        "avg_precision_at_k": round(avg_precision, 4),
        "avg_hit_rate": round(avg_hit_rate, 4),
        "num_users_evaluated": len(evaluations),
        "k": k,
    }
