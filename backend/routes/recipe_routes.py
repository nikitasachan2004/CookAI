from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from db import db
from models.recipe import Recipe
from utils.auth_utils import error_response
from utils.recipe_serializers import serialize_recipe_detail
from utils.recipe_utils import get_or_create_ingredient_records, normalize_ingredient_list, normalize_tag_list

recipe_bp = Blueprint("recipes", __name__, url_prefix="/api/recipes")


def _paginate(query, page: int, per_page: int) -> dict:
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    total_pages = pagination.pages if pagination.pages else (1 if pagination.total else 0)
    return {
        "recipes": [recipe.to_dict() for recipe in pagination.items],
        "total": pagination.total,
        "page": page,
        "pages": total_pages,
    }


@recipe_bp.route("", methods=["GET"])
def get_recipes():
    """Return paginated recipes, newest first."""
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=20, type=int)

    if page < 1 or per_page < 1:
        return error_response("Query parameters 'page' and 'per_page' must be positive integers", 400)

    query = Recipe.query.order_by(Recipe.created_at.desc())
    return jsonify(_paginate(query, page, min(per_page, 100))), 200


@recipe_bp.route("/search", methods=["GET"])
def search_recipes():
    query_text = (request.args.get("q") or "").strip()
    if not query_text:
        return error_response("Query parameter 'q' is required", 400)

    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=20, type=int)
    if page < 1 or per_page < 1:
        return error_response("Query parameters 'page' and 'per_page' must be positive integers", 400)

    search_term = f"%{query_text}%"
    query = Recipe.query.filter(
        (Recipe.title.ilike(search_term))
        | (Recipe.cuisine.ilike(search_term))
        | (db.cast(Recipe.ingredients, db.Text).ilike(search_term))
    ).order_by(Recipe.created_at.desc())
    return jsonify(_paginate(query, page, min(per_page, 100))), 200


@recipe_bp.route("/categories", methods=["GET"])
def get_categories():
    rows = (
        db.session.query(Recipe.cuisine, db.func.count(Recipe.id))
        .filter(Recipe.cuisine.isnot(None))
        .group_by(Recipe.cuisine)
        .order_by(db.func.count(Recipe.id).desc(), Recipe.cuisine.asc())
        .all()
    )
    return jsonify({cuisine: count for cuisine, count in rows if cuisine}), 200


@recipe_bp.route("/<int:recipe_id>", methods=["GET"])
def get_recipe(recipe_id):
    """Return a single recipe by ID."""
    recipe = db.session.get(Recipe, recipe_id)
    if not recipe:
        return error_response("Recipe not found", 404)

    recipe.view_count = (recipe.view_count or 0) + 1
    db.session.commit()
    return jsonify(serialize_recipe_detail(recipe)), 200


@recipe_bp.route("", methods=["POST"])
@jwt_required()
def create_recipe():
    """Create a new recipe. Expects JSON body."""
    data = request.get_json(silent=True)
    if data is None:
        return error_response("Request body must be valid JSON", 400)

    title = data.get("title", "").strip()
    ingredients = data.get("ingredients")
    instructions = data.get("instructions", "").strip()

    if not title:
        return error_response("Field 'title' is required", 400)
    if not ingredients or not isinstance(ingredients, list):
        return error_response("Field 'ingredients' must be a non-empty list", 400)
    if not instructions:
        return error_response("Field 'instructions' is required", 400)

    normalized_ingredients = normalize_ingredient_list(ingredients)
    if not normalized_ingredients:
        return error_response("Field 'ingredients' must contain at least one valid ingredient", 400)

    recipe = Recipe(
        title=title,
        description=data.get("description", "").strip() or None,
        ingredients=normalized_ingredients,
        instructions=instructions,
        cuisine=data.get("cuisine", "").strip() or None,
        prep_time=data.get("prep_time"),
        cook_time=data.get("cook_time"),
        servings=data.get("servings"),
        difficulty=data.get("difficulty"),
        tags=normalize_tag_list(data.get("tags") or []),
        image_url=data.get("image_url"),
        local_image_path=data.get("local_image_path"),
        source_url=data.get("source_url"),
    )
    recipe.ingredient_records = get_or_create_ingredient_records(normalized_ingredients)

    db.session.add(recipe)
    db.session.commit()

    return jsonify(recipe.to_dict()), 201


@recipe_bp.route("/<int:recipe_id>", methods=["DELETE"])
@jwt_required()
def delete_recipe(recipe_id):
    """Delete a recipe by ID."""
    recipe = db.session.get(Recipe, recipe_id)
    if not recipe:
        return error_response("Recipe not found", 404)

    db.session.delete(recipe)
    db.session.commit()

    return jsonify({"message": f"Recipe {recipe_id} deleted"}), 200
