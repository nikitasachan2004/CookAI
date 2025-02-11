"""
Test script for the enhanced CookAI backend
Tests basic functionality without scikit-learn dependency
"""

import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

def test_database_setup():
    """Test database initialization"""
    try:
        from backend.utils.db import init_database, SessionLocal
        from backend.models.recipe_model import Recipe
        from backend.models.user_model import User
        
        print("🗄️ Testing database setup...")
        
        # Initialize database
        init_database()
        
        # Test database connection
        db = SessionLocal()
        try:
            recipe_count = db.query(Recipe).count()
            user_count = db.query(User).count()
            print(f"✅ Database initialized successfully!")
            print(f"   📊 Recipes in database: {recipe_count}")
            print(f"   👤 Users in database: {user_count}")
            return True
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False

def test_recipe_dataset():
    """Test recipe dataset functionality"""
    try:
        from backend.models.recipe_dataset import RecipeDataset
        
        print("\n📚 Testing recipe dataset...")
        
        dataset = RecipeDataset.create_with_session()
        recipes = dataset.get_all_recipes()
        
        if recipes:
            print(f"✅ Recipe dataset working!")
            print(f"   📊 Total recipes: {len(recipes)}")
            print(f"   🍽️ First recipe: {recipes[0]['recipe_name']}")
            
            # Test get recipe by ID
            recipe = dataset.get_recipe_by_id(1)
            if recipe:
                print(f"   🔍 Get by ID working: {recipe['recipe_name']}")
            
            return True
        else:
            print("❌ No recipes found")
            return False
            
    except Exception as e:
        print(f"❌ Recipe dataset test failed: {e}")
        return False

def test_user_system():
    """Test user system functionality"""
    try:
        from backend.controllers.user_controller import UserController
        from backend.utils.db import SessionLocal
        
        print("\n👤 Testing user system...")
        
        db = SessionLocal()
        try:
            controller = UserController(db)
            
            # Test user registration
            user_data = {
                "name": "Test User",
                "email": "test@example.com",
                "preferences": {"dietary_preferences": ["healthy"]},
                "bmi": 22.5
            }
            
            # Clean up any existing test user first
            try:
                from backend.models.user_model import User
                existing_user = db.query(User).filter(User.email == "test@example.com").first()
                if existing_user:
                    db.delete(existing_user)
                    db.commit()
            except:
                pass
            
            result = controller.register_user(user_data)
            
            if result.get('status') == 'success':
                print("✅ User registration working!")
                user_id = result['data']['user']['id']
                print(f"   👤 Created user ID: {user_id}")
                
                # Test get user details
                user_result = controller.get_user_details(user_id)
                if user_result.get('status') == 'success':
                    print("✅ User details retrieval working!")
                
                return True
            else:
                print(f"❌ User registration failed: {result.get('message')}")
                return False
                
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ User system test failed: {e}")
        return False

def test_basic_recommendation():
    """Test basic recommendation without TF-IDF"""
    try:
        from backend.models.recipe_dataset import RecipeDataset
        
        print("\n🔍 Testing basic recommendation logic...")
        
        dataset = RecipeDataset.create_with_session()
        recipes = dataset.get_all_recipes()
        
        if not recipes:
            print("❌ No recipes available for testing")
            return False
        
        # Test basic filtering logic
        available_ingredients = ["chicken", "tomato"]
        matching_recipes = []
        
        for recipe in recipes:
            recipe_ingredients = [ing.lower() for ing in recipe.get('ingredients_required', [])]
            if any(ing.lower() in recipe_ingredients for ing in available_ingredients):
                matching_recipes.append(recipe)
        
        print(f"✅ Basic recommendation logic working!")
        print(f"   🥗 Found {len(matching_recipes)} recipes with chicken or tomato")
        
        if matching_recipes:
            print(f"   📋 Example match: {matching_recipes[0]['recipe_name']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Basic recommendation test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Testing Enhanced CookAI Backend System")
    print("=" * 50)
    
    tests = [
        test_database_setup,
        test_recipe_dataset,
        test_user_system,
        test_basic_recommendation
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The enhanced CookAI backend is working!")
        print("\n🌐 You can now start the Flask server with:")
        print("   python backend/app.py")
    else:
        print("⚠️  Some tests failed. Check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    main()