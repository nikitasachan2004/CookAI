export const RECIPE_PLACEHOLDER_IMAGE = '/recipe-images/placeholder.jpg'

export const resolveRecipeImage = (recipe = {}) => {
  const candidate = recipe.image_url || recipe.image || ''
  if (typeof candidate === 'string' && candidate.trim()) {
    return candidate.trim()
  }
  return RECIPE_PLACEHOLDER_IMAGE
}
