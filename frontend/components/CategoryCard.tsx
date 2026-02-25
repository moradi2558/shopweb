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
      type="button"
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative px-5 py-2.5 rounded-xl font-medium text-sm transition-colors overflow-hidden
        ${isActive
          ? 'bg-[var(--accent-warm)] text-[var(--bg-base)] shadow-lg shadow-[var(--accent-warm)]/30'
          : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:border-[var(--accent-warm)]/30 hover:text-[var(--text-primary)]'
        }
      `}
    >
      <span className="relative flex items-center gap-2">
        {category.name}
        {category.count !== undefined && category.count > 0 && (
          <span className="opacity-70 text-xs">
            ({category.count >= 1000 ? `${(category.count / 1000).toFixed(1)}K` : category.count})
          </span>
        )}
      </span>
    </motion.button>
  )
}
