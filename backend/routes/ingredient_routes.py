from flask import Blueprint, request

from models.ingredient import Ingredient
from utils.auth_utils import success_response

ingredient_bp = Blueprint("ingredients", __name__, url_prefix="/api/ingredients")


@ingredient_bp.route("", methods=["GET"])
def list_ingredients():
    search = (request.args.get("search") or "").strip().lower()
    query = Ingredient.query.order_by(Ingredient.name.asc())

    if search:
        query = query.filter(Ingredient.name.ilike(f"%{search}%"))

    ingredients = query.limit(50).all()
    return success_response({"ingredients": [ingredient.to_dict() for ingredient in ingredients]})
