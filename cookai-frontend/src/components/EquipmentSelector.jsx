import React from 'react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const equipmentOptions = [
  { id: 'stove', name: 'Stove', icon: '🔥', description: 'For sauteing, simmering, and comfort classics' },
  { id: 'oven', name: 'Oven', icon: '🍞', description: 'Roast, bake, and crisp with ease' },
  { id: 'microwave', name: 'Microwave', icon: '⚡', description: 'Fast reheats and quick meals' },
  { id: 'grill', name: 'Grill', icon: '🥩', description: 'Smoky char and open-fire flavor' },
  { id: 'blender', name: 'Blender', icon: '🥤', description: 'Sauces, soups, and smoothies' },
  { id: 'air fryer', name: 'Air Fryer', icon: '🍟', description: 'Crisp texture with less oil' },
  { id: 'slow cooker', name: 'Slow Cooker', icon: '🍲', description: 'Low effort, slow comfort' },
  { id: 'rice cooker', name: 'Rice Cooker', icon: '🍚', description: 'Perfect grains every time' },
]

const EquipmentSelector = ({ selectedEquipment = [], onChange, multiSelect = true }) => {
  const handleEquipmentToggle = (equipmentId) => {
    if (multiSelect) {
      onChange(selectedEquipment.includes(equipmentId)
        ? selectedEquipment.filter((id) => id !== equipmentId)
        : [...selectedEquipment, equipmentId])
      return
    }

    onChange(selectedEquipment.includes(equipmentId) ? [] : [equipmentId])
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {equipmentOptions.map((equipment) => {
          const selected = selectedEquipment.includes(equipment.id)

          return (
            <motion.button
              key={equipment.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => handleEquipmentToggle(equipment.id)}
              className={`rounded-[26px] border p-5 text-left transition-all ${
                selected
                  ? 'border-[rgba(184,92,56,0.24)] bg-[linear-gradient(180deg,rgba(184,92,56,0.12),rgba(217,143,43,0.12))] shadow-[var(--shadow-soft)]'
                  : 'border-[color:var(--border-soft)] bg-[rgba(255,252,246,0.72)] hover:border-[rgba(184,92,56,0.18)] hover:bg-white/80'
              }`}
            >
              <div className="mb-6 flex items-start justify-between gap-3">
                <span className="text-3xl">{equipment.icon}</span>
                <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                  selected ? 'bg-white/80 text-[color:var(--brand-deep)]' : 'bg-[rgba(255,255,255,0.7)] text-[color:var(--text-muted)]'
                }`}>
                  {selected ? 'Selected' : 'Available'}
                </span>
              </div>
              <h3 className="text-lg text-[color:var(--text-primary)]">{equipment.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">{equipment.description}</p>
            </motion.button>
          )
        })}
      </div>

      {selectedEquipment.length > 0 ? (
        <div className="rounded-[24px] border border-[rgba(93,123,93,0.16)] bg-[rgba(93,123,93,0.08)] px-5 py-4 text-sm text-[color:var(--text-secondary)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold text-[color:var(--secondary-700)] text-[color:var(--herb)]">
              Cooking with {selectedEquipment.length} tool{selectedEquipment.length > 1 ? 's' : ''}
            </p>
            {multiSelect ? (
              <button onClick={() => onChange([])} className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand-deep)]">
                Clear all
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

EquipmentSelector.propTypes = {
  selectedEquipment: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  multiSelect: PropTypes.bool,
}

export default EquipmentSelector
