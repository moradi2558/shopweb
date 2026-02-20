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
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-2 cursor-pointer group"
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <User className="w-8 h-8 text-white" />
        )}
      </div>
      <span className="text-slate-300 text-sm font-medium text-center group-hover:text-white transition-colors">
        {author.name}
      </span>
    </motion.div>
  )
}

