import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Search } from 'lucide-react'
import PropTypes from 'prop-types'
import { getAllIngredients } from '../data/mockRecipes'
import { debounce } from '../utils/helpers'

/**
 * IngredientInput component with autocomplete and chip-based input
 * @param {Object} props - Component props
 * @param {string[]} props.ingredients - Array of selected ingredients
 * @param {Function} props.onChange - Callback when ingredients change
 * @param {string} props.placeholder - Input placeholder text
 * @param {number} props.maxIngredients - Maximum number of ingredients allowed
 */
const IngredientInput = ({ 
  ingredients = [], 
  onChange, 
  placeholder = "Type an ingredient and press Enter",
  maxIngredients = 10
}) => {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  
  const inputRef = useRef(null)
  const suggestionRefs = useRef([])
  
  // All available ingredients for autocomplete
  const allIngredients = getAllIngredients()
  
  // Debounced search function
  const debouncedSearch = debounce((query) => {
    if (query.length >= 2) {
      const filtered = allIngredients
        .filter(ingredient => 
          ingredient.toLowerCase().includes(query.toLowerCase()) &&
          !ingredients.includes(ingredient)
        )
        .slice(0, 8)
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, 300)
  
  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    setActiveSuggestionIndex(-1)
    debouncedSearch(value)
  }
  
  // Add ingredient
  const addIngredient = (ingredient) => {
    const trimmedIngredient = ingredient.trim().toLowerCase()
    
    if (trimmedIngredient && 
        !ingredients.includes(trimmedIngredient) && 
        ingredients.length < maxIngredients) {
      onChange([...ingredients, trimmedIngredient])
      setInputValue('')
      setSuggestions([])
      setShowSuggestions(false)
      setActiveSuggestionIndex(-1)
      inputRef.current?.focus()
    }
  }
  
  // Remove ingredient
  const removeIngredient = (indexToRemove) => {
    onChange(ingredients.filter((_, index) => index !== indexToRemove))
  }
  
  // Handle key down events
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
          addIngredient(suggestions[activeSuggestionIndex])
        } else if (inputValue.trim()) {
          addIngredient(inputValue)
        }
        break
        
      case 'ArrowDown':
        e.preventDefault()
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
        
      case 'ArrowUp':
        e.preventDefault()
        setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
        break
        
      case 'Escape':
        setShowSuggestions(false)
        setActiveSuggestionIndex(-1)
        break
        
      case 'Backspace':
        if (!inputValue && ingredients.length > 0) {
          removeIngredient(ingredients.length - 1)
        }
        break
        
      default:
        break
    }
  }
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    addIngredient(suggestion)
  }
  
  // Handle blur to hide suggestions
  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => {
      setShowSuggestions(false)
      setActiveSuggestionIndex(-1)
    }, 200)
  }
  
  // Scroll active suggestion into view
  useEffect(() => {
    if (activeSuggestionIndex >= 0 && suggestionRefs.current[activeSuggestionIndex]) {
      suggestionRefs.current[activeSuggestionIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }, [activeSuggestionIndex])
  
  return (
    <div className="relative">
      {/* Input Container */}
      <div className="relative min-h-[3.5rem] p-4 border-2 border-gray-200 dark:border-gray-800 rounded-2xl 
                    bg-white dark:bg-gray-900 focus-within:border-orange-500 focus-within:ring-4 
                    focus-within:ring-orange-500/10 transition-all duration-200 shadow-sm focus-within:shadow-md">
        
        {/* Selected Ingredients */}
        <div className="flex flex-wrap gap-2 mb-2">
          <AnimatePresence>
            {ingredients.map((ingredient, index) => (
              <motion.div
                key={`${ingredient}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/20 
                         text-orange-700 dark:text-orange-300 px-3 py-1.5 rounded-xl text-sm font-semibold
                         border border-orange-200 dark:border-orange-800/30"
              >
                <span className="capitalize">{ingredient}</span>
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeIngredient(index)}
                  className="text-orange-500 hover:text-orange-700 transition-colors"
                  aria-label={`Remove ${ingredient}`}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Input Field */}
        <div className="flex items-center space-x-3">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={() => inputValue.length >= 2 && setShowSuggestions(true)}
            placeholder={ingredients.length === 0 ? placeholder : "Add another ingredient..."}
            disabled={ingredients.length >= maxIngredients}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 
                     dark:placeholder-gray-500 focus:outline-none text-base"
            aria-label="Add ingredient"
            aria-describedby="ingredient-help"
            autoComplete="off"
          />
          
          {inputValue && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => addIngredient(inputValue)}
              className="p-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
              aria-label="Add ingredient"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          )}
        </div>
        
        {/* Max ingredients warning */}
        {ingredients.length >= maxIngredients && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium"
            role="alert"
          >
            Maximum {maxIngredients} ingredients reached
          </motion.p>
        )}
      </div>
      
      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 max-h-64 overflow-y-auto 
                     bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 
                     rounded-2xl shadow-xl"
            role="listbox"
          >
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 border-b 
                            border-gray-200 dark:border-gray-800 mb-1">
                Suggestions ({suggestions.length})
              </div>
              
              {suggestions.map((suggestion, index) => {
                const isActive = index === activeSuggestionIndex
                return (
                  <motion.button
                    key={suggestion}
                    ref={el => suggestionRefs.current[index] = el}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 shadow-sm' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                    role="option"
                    aria-selected={isActive}
                  >
                    <span className="capitalize">{suggestion}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Helper Text */}
      <div id="ingredient-help" className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span className="font-medium">Press Enter to add • Select from suggestions</span>
        <span className="font-semibold">{ingredients.length}/{maxIngredients}</span>
      </div>
    </div>
  )
}

IngredientInput.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  maxIngredients: PropTypes.number
}

export default IngredientInput