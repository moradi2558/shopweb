'use client'

import { motion } from 'framer-motion'
import { BookOpen, ShoppingCart, Calendar } from 'lucide-react'
import { getImageUrl } from '@/lib/api'

interface BookCardProps {
  book: {
    id: number
    name: string
    price?: number
    sell?: boolean
    available_copy?: number
    date?: string
    category?: Array<{ id: number; name: string }>
    cover_image?: string
    cover_image_url?: string
    description?: string
  }
  variant?: 'default' | 'compact' | 'large'
  showProgress?: boolean
  progress?: number
}

export default function BookCard({ 
  book, 
  variant = 'default',
  showProgress = false,
  progress = 0 
}: BookCardProps) {
  const cardVariants = {
    default: 'w-48',
    compact: 'w-36',
    large: 'w-56',
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${cardVariants[variant]} flex-shrink-0 cursor-pointer group`}
    >
      <div className="relative h-64 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-600 group-hover:border-yellow-400 transition-all">
        {/* Book Cover */}
        {(() => {
          const imageUrl = book.cover_image_url || getImageUrl(book.cover_image);
          return imageUrl ? (
            <img
              src={imageUrl}
              alt={book.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const placeholder = e.currentTarget.nextElementSibling;
                if (placeholder) placeholder.classList.remove('hidden');
              }}
            />
          ) : null;
        })()}
        <div className={`absolute inset-0 flex items-center justify-center ${book.cover_image_url || book.cover_image ? 'hidden' : ''}`}>
          <BookOpen className="w-16 h-16 text-slate-500" />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
              {book.name}
            </h3>
            {book.price && book.sell && (
              <div className="flex items-center justify-between">
                <span className="text-yellow-400 font-bold">${book.price}</span>
                <button className="p-1.5 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-colors">
                  <ShoppingCart className="w-4 h-4 text-slate-900" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-yellow-400"
            />
          </div>
        )}
      </div>

      {/* Book Info (for compact variant) */}
      {variant === 'compact' && (
        <div className="mt-2">
          <h4 className="text-white text-sm font-medium line-clamp-1">{book.name}</h4>
          {book.date && (
            <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(book.date).getFullYear()}
            </p>
          )}
        </div>
      )}
    </motion.div>
  )
}

