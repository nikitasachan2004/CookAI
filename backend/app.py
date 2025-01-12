from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/favicon.ico")
def favicon():
    return "", 204

@app.route("/")
def index():
    return jsonify({
        "message": "CookAI Recipe API", 
        "version": "3.0.0",
        "status": "running",
        "endpoints": {
            "GET /": "API information",
            "GET /health": "Health check", 
            "POST /recommend": "Get recipe recommendations",
            "GET /recipes": "List sample recipes"
        },
        "server_info": {
            "host": "127.0.0.1:5001",
            "debug_mode": True,
            "cors_enabled": True
        }
    })

@app.route("/health")
def health():
    return jsonify({"status": "healthy", "api": "CookAI", "timestamp": "2024-12-28"})

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json() if request.is_json else {}
    
    ingredients = data.get("ingredients", [])
    preferences = data.get("preferences", [])
    equipment = data.get("equipment", [])
    
    mock_recipes = [
        {
            "id": 1,
            "name": "Quick Pasta Primavera",
            "description": "Fresh vegetables with pasta in a light garlic sauce",
            "prep_time": "15 minutes",
            "cook_time": "20 minutes",
            "difficulty": "Easy",
            "ingredients": ["pasta", "bell peppers", "zucchini", "garlic", "olive oil"],
            "equipment": ["pot", "pan"],
            "rating": 4.5,
            "calories": 350
        },
        {
            "id": 2,
            "name": "Mediterranean Salad",
            "description": "Fresh mixed greens with feta, olives, and tomatoes",
            "prep_time": "10 minutes",
            "cook_time": "0 minutes",
            "difficulty": "Very Easy",
            "ingredients": ["mixed greens", "feta cheese", "olives", "tomatoes", "cucumber"],
            "equipment": ["bowl"],
            "rating": 4.2,
            "calories": 250
        },
        {
            "id": 3,
            "name": "Hearty Vegetable Soup",
            "description": "Warming soup with seasonal vegetables and herbs",
            "prep_time": "20 minutes",
            "cook_time": "30 minutes",
            "difficulty": "Easy",
            "ingredients": ["carrots", "celery", "onions", "vegetable broth", "herbs"],
            "equipment": ["pot", "ladle"],
            "rating": 4.7,
            "calories": 180
        }
    ]
    
    return jsonify({
        "recommendations": mock_recipes,
        "total_found": len(mock_recipes),
        "user_input": {
            "ingredients": ingredients,
            "preferences": preferences,
            "equipment": equipment
        },
        "message": "Here are your personalized recipe recommendations!"
    })

@app.route("/recipes")
def get_recipes():
    sample_recipes = [
        {"id": 1, "name": "Pasta Primavera", "category": "Italian", "difficulty": "Easy"},
        {"id": 2, "name": "Mediterranean Salad", "category": "Healthy", "difficulty": "Very Easy"},
        {"id": 3, "name": "Vegetable Soup", "category": "Comfort Food", "difficulty": "Easy"},
        {"id": 4, "name": "Chicken Stir Fry", "category": "Asian", "difficulty": "Medium"},
        {"id": 5, "name": "Chocolate Chip Cookies", "category": "Dessert", "difficulty": "Easy"}
    ]
    
    return jsonify({
        "recipes": sample_recipes,
        "total_count": len(sample_recipes),
        "categories": ["Italian", "Healthy", "Comfort Food", "Asian", "Dessert"]
    })

if __name__ == "__main__":
    print("Starting CookAI API Server...")
    print("Available at: http://127.0.0.1:5001")
    print("API Endpoints: /, /health, /recommend, /recipes")
    app.run(host="0.0.0.0", port=5001, debug=True)
