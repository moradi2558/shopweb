'use client'

import { motion } from 'framer-motion'
import { User } from 'lucide-react'

interface AuthorCardProps {
  author: {
    id: number
    name: string
    avatar?: string
  }
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0"
    >
      <div className="relative w-16 h-16 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden clip-corner group-hover:border-[var(--accent-warm)]/40 transition-colors">
        <div className="absolute top-0 right-0 w-6 h-6 bg-[var(--accent-warm)]/20 rounded-bl-lg" />
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-8 h-8 text-[var(--accent-gold)]" />
        )}
      </div>
      <span className="text-[var(--text-muted)] text-sm font-medium text-center group-hover:text-[var(--text-primary)] transition-colors max-w-[6rem] truncate">
        {author.name}
      </span>
    </motion.div>
  )
}
