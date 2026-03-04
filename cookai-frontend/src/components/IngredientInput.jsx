import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Search, X } from 'lucide-react'
import PropTypes from 'prop-types'
import { getAllIngredients } from '../data/mockRecipes'
import { debounce } from '../utils/helpers'

const IngredientInput = ({
  ingredients = [],
  onChange,
  placeholder = 'Type an ingredient and press Enter',
  maxIngredients = 10,
}) => {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const inputRef = useRef(null)
  const suggestionRefs = useRef([])
  const allIngredients = getAllIngredients()

  const debouncedSearch = debounce((query) => {
    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const filtered = allIngredients
      .filter((ingredient) => ingredient.toLowerCase().includes(query.toLowerCase()) && !ingredients.includes(ingredient))
      .slice(0, 8)
    setSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
  }, 250)

  const addIngredient = (ingredient) => {
    const normalized = ingredient.trim().toLowerCase()
    if (!normalized || ingredients.includes(normalized) || ingredients.length >= maxIngredients) return
    onChange([...ingredients, normalized])
    setInputValue('')
    setSuggestions([])
    setShowSuggestions(false)
    setActiveSuggestionIndex(-1)
    inputRef.current?.focus()
  }

  const removeIngredient = (indexToRemove) => {
    onChange(ingredients.filter((_, index) => index !== indexToRemove))
  }

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
          addIngredient(suggestions[activeSuggestionIndex])
        } else {
          addIngredient(inputValue)
        }
        break
      case 'ArrowDown':
        event.preventDefault()
        setActiveSuggestionIndex((current) => (current < suggestions.length - 1 ? current + 1 : current))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveSuggestionIndex((current) => (current > 0 ? current - 1 : -1))
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

  useEffect(() => {
    if (activeSuggestionIndex >= 0 && suggestionRefs.current[activeSuggestionIndex]) {
      suggestionRefs.current[activeSuggestionIndex].scrollIntoView({ block: 'nearest' })
    }
  }, [activeSuggestionIndex])

  return (
    <div className="relative">
      <div className="rounded-[28px] border border-[color:var(--border-soft)] bg-[rgba(255,252,246,0.88)] p-4 shadow-[var(--shadow-soft)]">
        <div className="mb-3 flex flex-wrap gap-2">
          <AnimatePresence>
            {ingredients.map((ingredient, index) => (
              <motion.button
                key={`${ingredient}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => removeIngredient(index)}
                className="inline-flex items-center gap-2 rounded-full bg-[rgba(184,92,56,0.12)] px-4 py-2 text-sm font-semibold text-[color:var(--brand-deep)]"
              >
                <span className="capitalize">{ingredient}</span>
                <X className="h-4 w-4" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 rounded-[22px] border border-[rgba(112,71,33,0.08)] bg-white/70 px-4 py-3">
          <Search className="h-4 w-4 text-[color:var(--text-muted)]" />
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value)
              setActiveSuggestionIndex(-1)
              debouncedSearch(event.target.value)
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true)
            }}
            placeholder={ingredients.length === 0 ? placeholder : 'Add another ingredient'}
            disabled={ingredients.length >= maxIngredients}
            className="w-full bg-transparent text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-muted)]"
          />
          {inputValue ? (
            <button onClick={() => addIngredient(inputValue)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(184,92,56,0.12)] text-[color:var(--brand-deep)]">
              <Plus className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-[color:var(--text-muted)]">
          <p>Use commas or Enter to capture everything already in your kitchen.</p>
          <p>{ingredients.length}/{maxIngredients}</p>
        </div>
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-x-0 top-full z-30 mt-3 overflow-hidden rounded-[24px] border border-[color:var(--border-soft)] bg-[rgba(255,252,246,0.98)] shadow-glass"
          >
            <div className="border-b border-[color:var(--border-soft)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
              Pantry suggestions
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  ref={(element) => {
                    suggestionRefs.current[index] = element
                  }}
                  onClick={() => addIngredient(suggestion)}
                  className={`w-full rounded-[18px] px-4 py-3 text-left text-sm transition-colors ${
                    index === activeSuggestionIndex
                      ? 'bg-[rgba(184,92,56,0.12)] text-[color:var(--brand-deep)]'
                      : 'text-[color:var(--text-secondary)] hover:bg-[rgba(184,92,56,0.08)]'
                  }`}
                >
                  <span className="capitalize">{suggestion}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

IngredientInput.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  maxIngredients: PropTypes.number,
}

export default IngredientInput
