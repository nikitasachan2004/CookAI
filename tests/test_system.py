"""
Test script for the Recipe Recommendation API
Tests core functionality without requiring Flask server
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.models.recipe_dataset import RecipeDataset
from backend.utils.recommendation_engine import RecipeRecommendationEngine
from backend.utils.helpers import InputValidator, ResponseFormatter

def test_dataset():
    """Test the recipe dataset functionality"""
    print("🧪 Testing Recipe Dataset...")
    
    dataset = RecipeDataset()
    recipes = dataset.get_all_recipes()
    
    print(f"✅ Loaded {len(recipes)} recipes")
    print(f"✅ First recipe: {recipes[0]['recipe_name']}")
    
    # Test getting recipe by ID
    recipe = dataset.get_recipe_by_id(1)
    print(f"✅ Recipe by ID 1: {recipe['recipe_name']}")
    
    # Test filtering by tags
    healthy_recipes = dataset.get_recipes_by_tags(['healthy'])
    print(f"✅ Found {len(healthy_recipes)} healthy recipes")

def test_recommendation_engine():
    """Test the recommendation engine"""
    print("\n🧪 Testing Recommendation Engine...")
    
    dataset = RecipeDataset()
    recipes = dataset.get_all_recipes()
    engine = RecipeRecommendationEngine(recipes)
    
    # Test basic recommendation
    user_ingredients = ['chicken', 'tomato', 'onion']
    recommendations = engine.recommend_recipes(
        available_ingredients=user_ingredients,
        health_preference='healthy',
        equipment=['stove', 'oven'],
        top_k=3
    )
    
    print(f"✅ Generated {len(recommendations)} recommendations")
    for i, recipe in enumerate(recommendations, 1):
        print(f"  {i}. {recipe['recipe_name']} (Score: {recipe['similarity_score']})")

def test_validators():
    """Test input validation"""
    print("\n🧪 Testing Input Validation...")
    
    validator = InputValidator()
    
    # Test ingredient validation
    ingredients = validator.validate_ingredients(['chicken breast', 'tomatoes', '  onion  '])
    print(f"✅ Validated ingredients: {ingredients}")
    
    # Test health preference validation
    preference = validator.validate_health_preference('HEALTHY')
    print(f"✅ Validated health preference: {preference}")
    
    # Test equipment validation
    equipment = validator.validate_equipment(['Stove', 'OVEN', '  microwave  '])
    print(f"✅ Validated equipment: {equipment}")

def test_formatters():
    """Test response formatting"""
    print("\n🧪 Testing Response Formatters...")
    
    formatter = ResponseFormatter()
    
    # Create a sample recipe for testing
    sample_recipe = {
        'id': 1,
        'recipe_name': 'Test Recipe',
        'ingredients_required': ['ingredient1', 'ingredient2'],
        'steps': ['step1', 'step2'],
        'equipment_needed': ['stove'],
        'tags': ['healthy'],
        'similarity_score': 0.85
    }
    
    formatted = formatter.format_single_recipe(sample_recipe)
    print(f"✅ Formatted recipe with difficulty: {formatted['difficulty']}")
    print(f"✅ Estimated time: {formatted['estimated_time']}")

def test_full_workflow():
    """Test the complete recommendation workflow"""
    print("\n🧪 Testing Complete Workflow...")
    
    # Initialize components
    dataset = RecipeDataset()
    recipes = dataset.get_all_recipes()
    engine = RecipeRecommendationEngine(recipes)
    validator = InputValidator()
    formatter = ResponseFormatter()
    
    # Simulate user input
    raw_ingredients = ['chicken breast', 'lettuce', 'tomato']
    raw_preference = 'healthy'
    raw_equipment = ['grill', 'bowl']
    
    # Validate input
    ingredients = validator.validate_ingredients(raw_ingredients)
    preference = validator.validate_health_preference(raw_preference)
    equipment = validator.validate_equipment(raw_equipment)
    
    # Get recommendations
    recommendations = engine.recommend_recipes(
        available_ingredients=ingredients,
        health_preference=preference,
        equipment=equipment,
        top_k=5
    )
    
    # Format response
    formatted_recipes = formatter.format_recipe_list(recommendations)
    
    print(f"✅ Complete workflow successful!")
    print(f"✅ Input: {ingredients}")
    print(f"✅ Found {len(formatted_recipes)} recommendations")
    
    if formatted_recipes:
        best_match = formatted_recipes[0]
        print(f"✅ Best match: {best_match['recipe_name']} (Score: {best_match['similarity_score']})")

def main():
    """Run all tests"""
    print("🚀 Starting Recipe Recommendation System Tests\n")
    
    try:
        test_dataset()
        test_recommendation_engine()
        test_validators()
        test_formatters()
        test_full_workflow()
        
        print("\n✅ All tests passed! The system is working correctly.")
        print("\n🎉 Ready to start the Flask server with: python backend/app.py")
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
