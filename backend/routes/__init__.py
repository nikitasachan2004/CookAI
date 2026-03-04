from routes.recipe_routes import recipe_bp
from routes.auth_routes import auth_bp
from routes.chat_routes import chat_bp
from routes.evaluation_routes import evaluation_bp
from routes.ingredient_routes import ingredient_bp
from routes.recommend_routes import recommend_bp
from routes.user_routes import user_bp


def register_routes(app):
    """Register all blueprints with the Flask app."""
    app.register_blueprint(recipe_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(evaluation_bp)
    app.register_blueprint(ingredient_bp)
    app.register_blueprint(recommend_bp)
    app.register_blueprint(user_bp)
