'use client'

import { motion } from 'framer-motion'

interface CategoryCardProps {
  category: {
    id: number
    name: string
    count?: number
  }
  isActive?: boolean
  onClick?: () => void
}

export default function CategoryCard({ category, isActive = false, onClick }: CategoryCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-medium transition-all ${
        isActive
          ? 'bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/50'
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
      }`}
    >
      <span>{category.name}</span>
      {category.count !== undefined && (
        <span className="ml-2 text-sm opacity-75">({category.count})</span>
      )}
    </motion.button>
  )
}

