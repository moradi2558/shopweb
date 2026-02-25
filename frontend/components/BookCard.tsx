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

const fallbackCovers = [
  '/images/covers/classic-1.jpg',
  '/images/covers/classic-2.jpg',
  '/images/covers/classic-3.jpg',
  '/images/covers/classic-4.jpg',
]

export default function BookCard({
  book,
  variant = 'default',
  showProgress = false,
  progress = 0,
}: BookCardProps) {
  const sizes = {
    default: 'w-44 min-w-[11rem]',
    compact: 'w-32 min-w-[8rem]',
    large: 'w-52 min-w-[13rem]',
  }

  const coverIndex = book.id % fallbackCovers.length
  const resolvedCover =
    book.cover_image_url || getImageUrl(book.cover_image) || fallbackCovers[coverIndex]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={`${sizes[variant]} flex-shrink-0 cursor-pointer group`}
    >
      <div className="relative">
        {/* Back layer for double-card effect */}
        <div className="pointer-events-none absolute inset-0 translate-x-1.5 translate-y-2 rounded-2xl bg-[var(--bg-elevated)] opacity-70 blur-[1px]" />

        <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-[0_18px_40px_rgba(0,0,0,0.55)] transition-colors group-hover:border-[var(--accent-warm)]/60 clip-shelf">
          {/* Geometric accent corner */}
          <div className="absolute top-0 right-0 w-12 h-12 bg-[var(--accent-warm)]/10 rounded-bl-[2rem] z-10 pointer-events-none" />

          <div className="relative h-56 overflow-hidden">
            {resolvedCover ? (
              <motion.img
                src={resolvedCover}
                alt={book.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.4 }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const placeholder = e.currentTarget.nextElementSibling
                  if (placeholder) (placeholder as HTMLElement).classList.remove('hidden')
                }}
              />
            ) : null}
            <div
              className={`absolute inset-0 flex items-center justify-center bg-[var(--bg-elevated)] ${
                resolvedCover ? 'hidden' : ''
              }`}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                className="w-14 h-14 rounded-lg bg-[var(--accent-warm)]/20 flex items-center justify-center clip-corner"
              >
                <BookOpen className="w-7 h-7 text-[var(--accent-gold)]" />
              </motion.div>
            </div>

            {/* Hover overlay */}
            <motion.div
              initial={false}
              className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-[var(--text-primary)] font-medium text-sm line-clamp-2">
                  {book.name}
                </h3>
                {book.price != null && book.sell && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[var(--accent-gold)] font-semibold text-sm">
                      ${book.price}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 rounded-lg bg-[var(--accent-warm)] text-[var(--bg-base)]"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>

            {showProgress && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--bg-base)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-[var(--accent-gold)]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {variant === 'compact' && (
        <div className="mt-2 px-0.5">
          <h4 className="text-[var(--text-primary)] text-sm font-medium line-clamp-1">
            {book.name}
          </h4>
          {book.date && (
            <p className="text-[var(--text-muted)] text-xs mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              {new Date(book.date).getFullYear()}
            </p>
          )}
        </div>
      )}
    </motion.div>
  )
}

