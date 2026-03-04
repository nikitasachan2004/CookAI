from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from db import db
from models.recipe import Recipe
from utils.auth_utils import error_response
from utils.recipe_utils import get_or_create_ingredient_records, normalize_ingredient_list

recipe_bp = Blueprint("recipes", __name__, url_prefix="/api/recipes")


@recipe_bp.route("", methods=["GET"])
def get_recipes():
    """Return all recipes, newest first."""
    recipes = Recipe.query.order_by(Recipe.created_at.desc()).all()
    return jsonify([r.to_dict() for r in recipes]), 200


@recipe_bp.route("/<int:recipe_id>", methods=["GET"])
def get_recipe(recipe_id):
    """Return a single recipe by ID."""
    recipe = db.session.get(Recipe, recipe_id)
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404
    return jsonify(recipe.to_dict()), 200


@recipe_bp.route("", methods=["POST"])
@jwt_required()
def create_recipe():
    """Create a new recipe. Expects JSON body."""
    data = request.get_json(silent=True)
    if data is None:
        return error_response("Request body must be valid JSON", 400)

    # Required fields
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
