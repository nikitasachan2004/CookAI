import React from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { getAllEquipment } from '../data/mockRecipes'

/**
 * EquipmentSelector component for selecting cooking equipment
 * @param {Object} props - Component props
 * @param {string[]} props.selectedEquipment - Array of selected equipment
 * @param {Function} props.onChange - Callback when equipment selection changes
 * @param {boolean} props.multiSelect - Allow multiple equipment selection
 */
const EquipmentSelector = ({ 
  selectedEquipment = [], 
  onChange, 
  multiSelect = true 
}) => {
  // Available equipment with icons and descriptions
  const equipmentOptions = [
    {
      id: 'stove',
      name: 'Stove/Cooktop',
      icon: '🔥',
      description: 'Gas or electric burners'
    },
    {
      id: 'oven',
      name: 'Oven',
      icon: '🔥',
      description: 'For baking and roasting'
    },
    {
      id: 'microwave',
      name: 'Microwave',
      icon: '📡',
      description: 'Quick heating and cooking'
    },
    {
      id: 'grill',
      name: 'Grill',
      icon: '🍖',
      description: 'Indoor or outdoor grilling'
    },
    {
      id: 'blender',
      name: 'Blender',
      icon: '🥤',
      description: 'For smoothies and purees'
    },
    {
      id: 'food processor',
      name: 'Food Processor',
      icon: '⚙️',
      description: 'Chopping and mixing'
    },
    {
      id: 'air fryer',
      name: 'Air Fryer',
      icon: '💨',
      description: 'Healthy frying with air'
    },
    {
      id: 'slow cooker',
      name: 'Slow Cooker',
      icon: '🍲',
      description: 'Low and slow cooking'
    },
    {
      id: 'pressure cooker',
      name: 'Pressure Cooker',
      icon: '💥',
      description: 'Fast pressure cooking'
    },
    {
      id: 'stand mixer',
      name: 'Stand Mixer',
      icon: '🧁',
      description: 'For baking and mixing'
    },
    {
      id: 'toaster',
      name: 'Toaster',
      icon: '🍞',
      description: 'For bread and pastries'
    },
    {
      id: 'rice cooker',
      name: 'Rice Cooker',
      icon: '🍚',
      description: 'Perfect rice every time'
    }
  ]

  // Handle equipment selection
  const handleEquipmentToggle = (equipmentId) => {
    if (multiSelect) {
      if (selectedEquipment.includes(equipmentId)) {
        onChange(selectedEquipment.filter(id => id !== equipmentId))
      } else {
        onChange([...selectedEquipment, equipmentId])
      }
    } else {
      onChange(selectedEquipment.includes(equipmentId) ? [] : [equipmentId])
    }
  }

  // Check if equipment is selected
  const isSelected = (equipmentId) => selectedEquipment.includes(equipmentId)

  return (
    <div className="space-y-4">
      {/* Equipment Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {equipmentOptions.map((equipment) => {
          const selected = isSelected(equipment.id)
          
          return (
            <motion.button
              key={equipment.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleEquipmentToggle(equipment.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                selected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
              }`}
              aria-pressed={selected}
              aria-label={`${selected ? 'Deselect' : 'Select'} ${equipment.name}`}
            >
              {/* Selection Indicator */}
              <motion.div
                initial={false}
                animate={{
                  scale: selected ? 1 : 0,
                  opacity: selected ? 1 : 0
                }}
                transition={{ duration: 0.2 }}
                className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"
              >
                <svg 
                  className="w-3 h-3 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </motion.div>

              {/* Equipment Icon */}
              <div className="text-3xl mb-3 transition-transform duration-200 group-hover:scale-110">
                {equipment.icon}
              </div>

              {/* Equipment Name */}
              <h3 className={`font-medium text-sm mb-1 transition-colors ${
                selected 
                  ? 'text-primary-700 dark:text-primary-300' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {equipment.name}
              </h3>

              {/* Equipment Description */}
              <p className={`text-xs transition-colors ${
                selected 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {equipment.description}
              </p>
            </motion.button>
          )
        })}
      </div>

      {/* Selected Equipment Summary */}
      {selectedEquipment.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Selected Equipment ({selectedEquipment.length})
            </span>
            
            {multiSelect && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange([])}
                className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 
                         dark:hover:text-primary-200 transition-colors underline"
              >
                Clear all
              </motion.button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedEquipment.map((equipmentId) => {
              const equipment = equipmentOptions.find(eq => eq.id === equipmentId)
              if (!equipment) return null
              
              return (
                <span
                  key={equipmentId}
                  className="inline-flex items-center space-x-1 bg-primary-100 dark:bg-primary-800/30 
                           text-primary-700 dark:text-primary-300 px-2 py-1 rounded-md text-xs"
                >
                  <span>{equipment.icon}</span>
                  <span>{equipment.name}</span>
                </span>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {multiSelect 
          ? 'Select all equipment you have available for cooking'
          : 'Select your primary cooking equipment'
        }
      </p>
    </div>
  )
}

EquipmentSelector.propTypes = {
  selectedEquipment: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  multiSelect: PropTypes.bool
}

export default EquipmentSelector