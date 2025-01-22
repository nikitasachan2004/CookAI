/**
 * Mock Recipe Data for CookAI Frontend
 * Matches the backend recipe schema with realistic cooking data
 */

export const mockRecipes = [
  {
    id: 1,
    name: "Grilled Chicken Salad",
    ingredients: [
      "chicken breast", "lettuce", "tomatoes", "cucumber", 
      "olive oil", "lemon juice", "salt", "pepper", "feta cheese"
    ],
    essentialIngredients: ["chicken breast", "lettuce", "olive oil"],
    equipment: ["grill", "mixing bowl"],
    tags: ["healthy", "protein", "low-carb", "mediterranean"],
    steps: [
      "Season chicken breast with salt, pepper, and olive oil",
      "Preheat grill to medium-high heat",
      "Grill chicken for 6-7 minutes per side until cooked through",
      "Let chicken rest for 5 minutes, then slice",
      "Wash and chop lettuce, tomatoes, and cucumber",
      "Combine vegetables in a large bowl",
      "Add sliced chicken on top",
      "Drizzle with olive oil and lemon juice",
      "Crumble feta cheese over salad",
      "Toss gently and serve immediately"
    ],
    time: 25,
    difficulty: "easy",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop",
    nutrition: {
      calories: 320,
      protein: "35g",
      carbs: "8g",
      fat: "16g",
      fiber: "4g"
    },
    cuisine: "Mediterranean",
    servings: 2
  },
  {
    id: 2,
    name: "Creamy Mushroom Pasta",
    ingredients: [
      "pasta", "mushrooms", "heavy cream", "garlic", "onion",
      "parmesan cheese", "butter", "white wine", "thyme", "salt", "pepper"
    ],
    essentialIngredients: ["pasta", "mushrooms", "heavy cream"],
    equipment: ["stove", "large pot", "pan"],
    tags: ["vegetarian", "creamy", "comfort food", "italian"],
    steps: [
      "Bring a large pot of salted water to boil",
      "Cook pasta according to package instructions",
      "Meanwhile, slice mushrooms and mince garlic",
      "Heat butter in a large pan over medium heat",
      "Sauté onion until translucent, about 3 minutes",
      "Add mushrooms and cook until golden, 5-7 minutes",
      "Add garlic and thyme, cook for 1 minute",
      "Pour in white wine and let it reduce by half",
      "Add heavy cream and simmer for 3 minutes",
      "Drain pasta and add to the sauce",
      "Toss with parmesan cheese and serve hot"
    ],
    time: 30,
    difficulty: "medium",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc92d2abb?w=800&h=600&fit=crop",
    nutrition: {
      calories: 485,
      protein: "18g",
      carbs: "52g",
      fat: "22g",
      fiber: "3g"
    },
    cuisine: "Italian",
    servings: 4
  },
  {
    id: 3,
    name: "Avocado Toast with Poached Egg",
    ingredients: [
      "whole grain bread", "avocado", "eggs", "lemon juice",
      "red pepper flakes", "salt", "black pepper", "olive oil"
    ],
    essentialIngredients: ["bread", "avocado", "eggs"],
    equipment: ["toaster", "pot", "slotted spoon"],
    tags: ["breakfast", "healthy", "vegetarian", "quick"],
    steps: [
      "Fill a pot with water and bring to a gentle simmer",
      "Toast bread slices until golden brown",
      "Cut avocado in half and mash with lemon juice, salt, and pepper",
      "Crack eggs into individual small bowls",
      "Create a gentle whirlpool in the simmering water",
      "Carefully drop eggs into the water, one at a time",
      "Poach for 3-4 minutes until whites are set",
      "Spread mashed avocado on toast",
      "Carefully lift poached eggs with slotted spoon",
      "Place eggs on top of avocado toast",
      "Sprinkle with red pepper flakes and serve"
    ],
    time: 15,
    difficulty: "easy",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop",
    nutrition: {
      calories: 280,
      protein: "14g",
      carbs: "24g",
      fat: "16g",
      fiber: "8g"
    },
    cuisine: "Modern",
    servings: 2
  },
  {
    id: 4,
    name: "Beef Stir Fry with Vegetables",
    ingredients: [
      "beef sirloin", "broccoli", "bell peppers", "carrots", "onion",
      "garlic", "ginger", "soy sauce", "oyster sauce", "sesame oil", "cornstarch"
    ],
    essentialIngredients: ["beef", "vegetables", "soy sauce"],
    equipment: ["wok", "knife", "cutting board"],
    tags: ["asian", "protein", "vegetables", "quick"],
    steps: [
      "Slice beef thinly against the grain",
      "Marinate beef in soy sauce and cornstarch for 10 minutes",
      "Cut all vegetables into uniform pieces",
      "Heat wok or large pan over high heat",
      "Add oil and swirl to coat",
      "Stir-fry beef until just cooked, remove and set aside",
      "Add more oil if needed, stir-fry vegetables starting with hardest",
      "Add garlic and ginger, stir-fry for 30 seconds",
      "Return beef to wok",
      "Add sauces and toss everything together",
      "Serve immediately over rice"
    ],
    time: 20,
    difficulty: "medium",
    image: "https://images.unsplash.com/photo-1603496987351-f84a3ba5ec85?w=800&h=600&fit=crop",
    nutrition: {
      calories: 340,
      protein: "28g",
      carbs: "18g",
      fat: "18g",
      fiber: "5g"
    },
    cuisine: "Asian",
    servings: 3
  },
  {
    id: 5,
    name: "Chocolate Chip Cookies",
    ingredients: [
      "all-purpose flour", "butter", "brown sugar", "white sugar", "eggs",
      "vanilla extract", "baking soda", "salt", "chocolate chips"
    ],
    essentialIngredients: ["flour", "butter", "sugar", "chocolate chips"],
    equipment: ["oven", "mixing bowls", "baking sheets"],
    tags: ["dessert", "baking", "sweet", "classic"],
    steps: [
      "Preheat oven to 375°F (190°C)",
      "Cream together butter and both sugars until fluffy",
      "Beat in eggs one at a time, then vanilla",
      "In separate bowl, whisk together flour, baking soda, and salt",
      "Gradually mix dry ingredients into wet ingredients",
      "Fold in chocolate chips",
      "Scoop dough onto lined baking sheets",
      "Bake for 9-11 minutes until edges are golden",
      "Cool on baking sheet for 5 minutes",
      "Transfer to wire rack to cool completely"
    ],
    time: 45,
    difficulty: "easy",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop",
    nutrition: {
      calories: 180,
      protein: "2g",
      carbs: "24g",
      fat: "9g",
      fiber: "1g"
    },
    cuisine: "American",
    servings: 24
  },
  {
    id: 6,
    name: "Mediterranean Quinoa Bowl",
    ingredients: [
      "quinoa", "chickpeas", "cucumber", "tomatoes", "red onion",
      "olives", "feta cheese", "olive oil", "lemon juice", "oregano", "parsley"
    ],
    essentialIngredients: ["quinoa", "chickpeas", "vegetables"],
    equipment: ["pot", "strainer", "mixing bowl"],
    tags: ["healthy", "vegetarian", "mediterranean", "protein", "vegan-option"],
    steps: [
      "Rinse quinoa under cold water until water runs clear",
      "Cook quinoa in 2:1 ratio water to quinoa for 15 minutes",
      "Let quinoa cool completely",
      "Drain and rinse chickpeas",
      "Dice cucumber, tomatoes, and red onion",
      "Make dressing with olive oil, lemon juice, and oregano",
      "Combine quinoa with all vegetables in large bowl",
      "Add chickpeas and olives",
      "Drizzle with dressing and toss",
      "Top with crumbled feta and fresh parsley",
      "Serve chilled or at room temperature"
    ],
    time: 35,
    difficulty: "easy",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop",
    nutrition: {
      calories: 380,
      protein: "16g",
      carbs: "52g",
      fat: "14g",
      fiber: "8g"
    },
    cuisine: "Mediterranean",
    servings: 4
  }
]

/**
 * Get all unique ingredients from mock recipes for autocomplete
 */
export const getAllIngredients = () => {
  const ingredients = new Set()
  mockRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      ingredients.add(ingredient.toLowerCase())
    })
  })
  return Array.from(ingredients).sort()
}

/**
 * Get all unique equipment from mock recipes
 */
export const getAllEquipment = () => {
  const equipment = new Set()
  mockRecipes.forEach(recipe => {
    recipe.equipment.forEach(item => {
      equipment.add(item.toLowerCase())
    })
  })
  return Array.from(equipment).sort()
}

/**
 * Get all unique tags from mock recipes
 */
export const getAllTags = () => {
  const tags = new Set()
  mockRecipes.forEach(recipe => {
    recipe.tags.forEach(tag => {
      tags.add(tag.toLowerCase())
    })
  })
  return Array.from(tags).sort()
}

/**
 * Get all unique cuisines from mock recipes
 */
export const getAllCuisines = () => {
  const cuisines = new Set()
  mockRecipes.forEach(recipe => {
    if (recipe.cuisine) {
      cuisines.add(recipe.cuisine)
    }
  })
  return Array.from(cuisines).sort()
}

export default mockRecipes