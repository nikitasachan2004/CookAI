#!/usr/bin/env python3
"""
Debug and testing utilities for CookAI system
Simple wrapper around the recommendation engine for testing
"""

import sys
import os
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from backend.models.recipe_dataset import RecipeDataset
from backend.utils.recommendation_engine import RecipeRecommendationEngine


class CookAITester:
    """Simple testing interface for CookAI components"""
    
    def __init__(self):
        self.dataset = RecipeDataset()
        self.recipes = self.dataset.get_all_recipes()
        self.engine = RecipeRecommendationEngine(self.recipes)
    
    def test_basic_recommendations(self):
        """Test basic recommendation functionality"""
        print("� Testing Basic Recommendations")
        print("-" * 50)
        
        test_ingredients = ['chicken', 'tomato', 'onion']
        test_equipment = ['stove', 'oven']
        
        print(f"Input ingredients: {test_ingredients}")
        print(f"Available equipment: {test_equipment}")
        
        # Test with different health preferences
        for health_pref in [None, 'healthy', 'veg']:
            print(f"\n🏷️  Health preference: {health_pref or 'None'}")
            
            recommendations = self.engine.recommend_recipes(
                available_ingredients=test_ingredients,
                health_preference=health_pref,
                equipment=test_equipment,
                top_k=3
            )
            
            if recommendations:
                for i, recipe in enumerate(recommendations, 1):
                    score = recipe.get('similarity_score', 'N/A')
                    fallback = recipe.get('fallback', False)
                    fallback_text = " (Fallback)" if fallback else ""
                    print(f"  {i}. {recipe['recipe_name']} - Score: {score}{fallback_text}")
                    
                    # Show component scores if available
                    if 'component_scores' in recipe:
                        comp_scores = recipe['component_scores']
                        print(f"     Equipment: {comp_scores.get('equipment_match', 'N/A')}, "
                              f"Health: {comp_scores.get('health_preference', 'N/A')}, "
                              f"Ingredients: {comp_scores.get('ingredient_match', 'N/A')}")
            else:
                print("  ❌ No recommendations found")
    
    def test_equipment_analysis(self):
        """Analyze equipment requirements across all recipes"""
        print("\n\n🔧 Equipment Analysis")
        print("-" * 50)
        
        all_equipment = set()
        equipment_count = {}
        
        for recipe in self.recipes:
            recipe_equipment = recipe.get('equipment_needed', [])
            for equipment in recipe_equipment:
                equipment_clean = equipment.lower().strip()
                all_equipment.add(equipment_clean)
                equipment_count[equipment_clean] = equipment_count.get(equipment_clean, 0) + 1
        
        print(f"Total unique equipment items: {len(all_equipment)}")
        print("\nMost common equipment:")
        sorted_equipment = sorted(equipment_count.items(), key=lambda x: x[1], reverse=True)
        for equipment, count in sorted_equipment[:10]:
            print(f"  {equipment}: {count} recipes")
        
        # Test compatibility with basic equipment
        basic_equipment = ['stove', 'oven', 'pot', 'pan']
        compatible_count = 0
        
        for recipe in self.recipes:
            recipe_equipment = [eq.lower().strip() for eq in recipe.get('equipment_needed', [])]
            if all(any(basic in req_eq or req_eq in basic for basic in basic_equipment) 
                   for req_eq in recipe_equipment if req_eq not in ['bowl', 'knife', 'cutting board']):
                compatible_count += 1
        
        print(f"\nRecipes compatible with basic equipment: {compatible_count}/{len(self.recipes)}")
    
    def test_ingredient_coverage(self):
        """Analyze ingredient coverage in recipes"""
        print("\n\n🥕 Ingredient Analysis")
        print("-" * 50)
        
        all_ingredients = set()
        ingredient_count = {}
        
        for recipe in self.recipes:
            recipe_ingredients = recipe.get('ingredients_required', [])
            for ingredient in recipe_ingredients:
                ingredient_clean = ingredient.lower().strip()
                all_ingredients.add(ingredient_clean)
                ingredient_count[ingredient_clean] = ingredient_count.get(ingredient_clean, 0) + 1
        
        print(f"Total unique ingredients: {len(all_ingredients)}")
        print("\nMost common ingredients:")
        sorted_ingredients = sorted(ingredient_count.items(), key=lambda x: x[1], reverse=True)
        for ingredient, count in sorted_ingredients[:15]:
            print(f"  {ingredient}: {count} recipes")
    
    def test_edge_cases(self):
        """Test edge cases and error handling"""
        print("\n\n⚠️  Edge Case Testing")
        print("-" * 50)
        
        # Test with empty ingredients
        print("1. Empty ingredients list:")
        empty_recs = self.engine.recommend_recipes(
            available_ingredients=[],
            top_k=2
        )
        print(f"   Found {len(empty_recs)} recommendations")
        
        # Test with non-existent ingredients
        print("\n2. Non-existent ingredients:")
        weird_recs = self.engine.recommend_recipes(
            available_ingredients=['unicorn_meat', 'dragon_scales'],
            top_k=2
        )
        print(f"   Found {len(weird_recs)} recommendations")
        
        # Test with very restrictive filters
        print("\n3. Very restrictive filters:")
        restrictive_recs = self.engine.recommend_recipes(
            available_ingredients=['salt'],
            health_preference='veg',
            equipment=['microwave'],
            top_k=2
        )
        print(f"   Found {len(restrictive_recs)} recommendations")


def main():
    """Main function to run all tests"""
    print("=" * 60)
    print("🍳 CookAI System Testing")
    print("=" * 60)
    
    try:
        tester = CookAITester()
        tester.test_basic_recommendations()
        tester.test_equipment_analysis()
        tester.test_ingredient_coverage()
        tester.test_edge_cases()
        
        print("\n" + "=" * 60)
        print("✅ All tests completed successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()