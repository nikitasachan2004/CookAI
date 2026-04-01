from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy import func

from db import db
from models.favorite import Favorite
from models.rating import Rating
from models.recipe import Recipe
from models.user import User
from models.user_preference import UserPreference
from utils.auth_utils import error_response

user_bp = Blueprint("user_personalization", __name__)


def _success(message: str, data: dict | None = None, status_code: int = 200):
    return {"message": message, "data": data or {}}, status_code


def _current_user():
    return db.session.get(User, int(get_jwt_identity()))


def _require_user():
    user = _current_user()
    if not user:
        return None, error_response("User not found", 404)
    return user, None


def _get_recipe_or_404(recipe_id: int):
    recipe = db.session.get(Recipe, recipe_id)
    if not recipe:
        return None, error_response("Recipe not found", 404)
    return recipe, None


@user_bp.route("/api/favorites", methods=["GET"])
@jwt_required()
def get_favorites():
    user, error = _require_user()
    if error:
        return error

    favorites = (
        Favorite.query.filter_by(user_id=user.id)
        .order_by(Favorite.created_at.desc())
        .all()
    )
    return _success(
        "Favorites fetched successfully",
        {
            "favorites": [
                {
                    **favorite.to_dict(),
                    "recipe": favorite.recipe.to_dict() if favorite.recipe else None,
                }
                for favorite in favorites
            ]
        },
    )


@user_bp.route("/api/favorites/<int:recipe_id>", methods=["POST"])
@jwt_required()
def add_favorite(recipe_id):
    user, error = _require_user()
    if error:
        return error

    _, error = _get_recipe_or_404(recipe_id)
    if error:
        return error

    existing = Favorite.query.filter_by(user_id=user.id, recipe_id=recipe_id).first()
    if existing:
        return error_response("Recipe is already in favorites", 409)

    favorite = Favorite(user_id=user.id, recipe_id=recipe_id)
    db.session.add(favorite)
    db.session.commit()

    return _success(
        "Recipe added to favorites",
        {"favorite": favorite.to_dict()},
        201,
    )


@user_bp.route("/api/favorites/<int:recipe_id>", methods=["DELETE"])
@jwt_required()
def remove_favorite(recipe_id):
    user, error = _require_user()
    if error:
        return error

    favorite = Favorite.query.filter_by(user_id=user.id, recipe_id=recipe_id).first()
    if not favorite:
        return error_response("Favorite not found", 404)

    db.session.delete(favorite)
    db.session.commit()
    return _success("Recipe removed from favorites", {"recipe_id": recipe_id})


@user_bp.route("/api/user/preferences", methods=["GET"])
@jwt_required()
def get_user_preferences():
    user, error = _require_user()
    if error:
        return error

    preference = user.preference
    if not preference:
        return _success("User preferences fetched successfully", {"preferences": None})

    return _success("User preferences fetched successfully", {"preferences": preference.to_dict()})


@user_bp.route("/api/user/preferences", methods=["POST"])
@jwt_required()
def upsert_user_preferences():
    data = request.get_json(silent=True)
    if data is None:
        return error_response("Request body must be valid JSON", 400)

    user, error = _require_user()
    if error:
        return error

    max_prep_time = data.get("max_prep_time")
    if max_prep_time is not None and (not isinstance(max_prep_time, int) or max_prep_time < 0):
        return error_response("Field 'max_prep_time' must be a non-negative integer", 400)

    preference = user.preference
    created = False
    if preference is None:
        preference = UserPreference(user_id=user.id)
        db.session.add(preference)
        created = True

    preference.update_from_dict(data)
    db.session.commit()

    message = "User preferences created successfully" if created else "User preferences updated successfully"
    return _success(message, {"preferences": preference.to_dict()})


@user_bp.route("/api/ratings/<int:recipe_id>", methods=["POST"])
@jwt_required()
def add_or_update_rating(recipe_id):
    data = request.get_json(silent=True)
    if data is None:
        return error_response("Request body must be valid JSON", 400)

    user, error = _require_user()
    if error:
        return error

    _, error = _get_recipe_or_404(recipe_id)
    if error:
        return error

    rating_value = data.get("rating")
    if not isinstance(rating_value, int) or not 1 <= rating_value <= 5:
        return error_response("Field 'rating' must be an integer between 1 and 5", 400)

    rating = Rating.query.filter_by(user_id=user.id, recipe_id=recipe_id).first()
    created = False
    if rating is None:
        rating = Rating(user_id=user.id, recipe_id=recipe_id, rating=rating_value)
        db.session.add(rating)
        created = True
    else:
        rating.rating = rating_value

    db.session.commit()
    message = "Rating created successfully" if created else "Rating updated successfully"
    return _success(message, {"rating": rating.to_dict()}, 201 if created else 200)


@user_bp.route("/api/ratings/<int:recipe_id>", methods=["GET"])
@jwt_required()
def get_recipe_rating(recipe_id):
    _, error = _get_recipe_or_404(recipe_id)
    if error:
        return error

    average_rating, rating_count = db.session.query(
        func.avg(Rating.rating),
        func.count(Rating.id),
    ).filter(Rating.recipe_id == recipe_id).one()

    average_value = float(average_rating) if average_rating is not None else None
    return _success(
        "Recipe rating fetched successfully",
        {
            "recipe_id": recipe_id,
            "average_rating": round(average_value, 2) if average_value is not None else None,
            "rating_count": rating_count,
        },
    )
