"""
Test the running Flask API endpoints
"""

import requests
import json
import time

def test_api_endpoints():
    """Test all API endpoints"""
    base_url = "http://localhost:5000"
    
    print("🧪 Testing Recipe Recommender API Endpoints\n")
    
    # Test 1: Health check
    print("1️⃣ Testing health check endpoint...")
    try:
        response = requests.get(f"{base_url}/api/health")
        if response.status_code == 200:
            print(f"✅ Health check: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    # Test 2: Get all recipes
    print("\n2️⃣ Testing get all recipes...")
    try:
        response = requests.get(f"{base_url}/api/recipes")
        if response.status_code == 200:
            data = response.json()
            total_recipes = len(data['data']['recipes'])
            print(f"✅ Found {total_recipes} recipes")
            print(f"   First recipe: {data['data']['recipes'][0]['recipe_name']}")
        else:
            print(f"❌ Get all recipes failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Get all recipes error: {e}")
    
    # Test 3: Get specific recipe
    print("\n3️⃣ Testing get specific recipe...")
    try:
        response = requests.get(f"{base_url}/api/recipes/1")
        if response.status_code == 200:
            data = response.json()
            recipe = data['data']
            print(f"✅ Recipe details for ID 1:")
            print(f"   Name: {recipe['recipe_name']}")
            print(f"   Difficulty: {recipe['difficulty']}")
            print(f"   Estimated time: {recipe['estimated_time']}")
            print(f"   Ingredients: {len(recipe['ingredients_required'])} items")
        else:
            print(f"❌ Get recipe failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Get recipe error: {e}")
    
    # Test 4: Search by tags
    print("\n4️⃣ Testing search by tags...")
    try:
        response = requests.get(f"{base_url}/api/recipes/search?tags=healthy,veg")
        if response.status_code == 200:
            data = response.json()
            found_recipes = len(data['data']['recipes'])
            print(f"✅ Found {found_recipes} healthy vegetarian recipes")
            if found_recipes > 0:
                print(f"   Example: {data['data']['recipes'][0]['recipe_name']}")
        else:
            print(f"❌ Search by tags failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Search by tags error: {e}")
    
    # Test 5: Recipe recommendations
    print("\n5️⃣ Testing recipe recommendations...")
    try:
        payload = {
            "available_ingredients": ["chicken", "tomato", "onion", "garlic"],
            "health_preference": "healthy",
            "equipment": ["stove", "oven", "pot", "pan"]
        }
        
        response = requests.post(
            f"{base_url}/api/recommend",
            headers={'Content-Type': 'application/json'},
            data=json.dumps(payload)
        )
        
        if response.status_code == 200:
            data = response.json()
            recommendations = data['data']['recipes']
            print(f"✅ Got {len(recommendations)} recommendations")
            
            for i, recipe in enumerate(recommendations, 1):
                print(f"   {i}. {recipe['recipe_name']} (Score: {recipe['similarity_score']})")
                print(f"      Difficulty: {recipe['difficulty']}, Tags: {recipe['tags']}")
        else:
            print(f"❌ Recommendations failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Recommendations error: {e}")
    
    # Test 6: Recipe recommendations - vegetarian
    print("\n6️⃣ Testing vegetarian recipe recommendations...")
    try:
        payload = {
            "available_ingredients": ["quinoa", "spinach", "avocado", "tomato"],
            "health_preference": "veg",
            "equipment": ["stove", "pot", "bowl"]
        }
        
        response = requests.post(
            f"{base_url}/api/recommend",
            headers={'Content-Type': 'application/json'},
            data=json.dumps(payload)
        )
        
        if response.status_code == 200:
            data = response.json()
            recommendations = data['data']['recipes']
            print(f"✅ Got {len(recommendations)} vegetarian recommendations")
            
            for i, recipe in enumerate(recommendations, 1):
                print(f"   {i}. {recipe['recipe_name']} (Score: {recipe['similarity_score']})")
        else:
            print(f"❌ Vegetarian recommendations failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Vegetarian recommendations error: {e}")
    
    print("\n✅ API testing completed!")

if __name__ == '__main__':
    # Give the server a moment to fully start
    time.sleep(2)
    test_api_endpoints()
