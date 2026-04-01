from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from ml.hybrid_recommender import recommend_for_user
from ml.recommender import recommend_recipes
from utils.auth_utils import error_response

recommend_bp = Blueprint("recommend", __name__, url_prefix="/api/recommend")


def _format_content_recommendations(recommendations: list[dict]) -> list[dict]:
    return [
        {
            "id": recommendation["id"],
            "title": recommendation["title"],
            "final_score": recommendation["similarity_score"],
            "similarity_score": recommendation["similarity_score"],
            "explanation": "Recommended because it closely matches your ingredient input",
            "cuisine": recommendation.get("cuisine"),
            "prep_time": recommendation.get("prep_time"),
        }
        for recommendation in recommendations
    ]


@recommend_bp.route("", methods=["POST"])
def get_recommendations():
    data = request.get_json(silent=True)
    if data is None:
        return error_response("Request body must be valid JSON", 400)

    user_input = data.get("user_input")
    if user_input is None:
        user_input = data.get("ingredients")
    if user_input is None:
        user_input = data.get("available_ingredients")

    filters = {}
    if data.get("cuisine"):
        filters["cuisine"] = data.get("cuisine")
    if data.get("prep_time") is not None:
        filters["prep_time"] = data.get("prep_time")

    if filters.get("prep_time") is not None and (
        not isinstance(filters["prep_time"], int) or filters["prep_time"] < 0
    ):
        return error_response("Field 'prep_time' must be a non-negative integer", 400)

    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        identity = get_jwt_identity()
        user_id = int(identity) if identity is not None else None
    except Exception:
        user_id = None

    try:
        if user_id is not None:
            recommendations = recommend_for_user(
                user_id=user_id,
                user_input=user_input,
                filters=filters,
                top_n=5,
            )
        else:
            recommendations = _format_content_recommendations(
                recommend_recipes(user_input=user_input, filters=filters, top_n=5)
            )
    except ValueError as exc:
        return error_response(str(exc), 400)
    except Exception:
        return error_response("Failed to generate recommendations", 500)

    return {"recommendations": recommendations}, 200
