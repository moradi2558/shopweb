'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, ChevronRight } from 'lucide-react'
import BookCard from '../BookCard'
import CategoryCard from '../CategoryCard'
import AuthorCard from '../AuthorCard'
import { bookAPI, categoryAPI } from '@/lib/api'

interface Book {
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

interface Category {
  id: number
  name: string
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        bookAPI.list({ limit: 20 }),
        categoryAPI.list(),
      ])
      setBooks(booksRes.data.data || [])
      setCategories(categoriesRes.data.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for demonstration
  const previousReading = books.slice(0, 5)
  const newBooks = books.slice(0, 6)
  const popularBooks = books.slice(0, 8)
  const authors = [
    { id: 1, name: 'Austin Kleon' },
    { id: 2, name: 'Ryan Holiday' },
    { id: 3, name: 'Angela Davis' },
    { id: 4, name: 'James Clear' },
    { id: 5, name: 'Paulo Coelho' },
    { id: 6, name: 'Mark Manson' },
  ]

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    count: Math.floor(Math.random() * 2000) + 100,
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Previous Reading Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Previous Reading</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-slate-300">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {previousReading.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BookCard book={book} variant="default" showProgress progress={Math.random() * 100} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Subjects Section */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Subjects section</h2>
        <div className="flex gap-4 flex-wrap">
          {categoriesWithCount.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isActive={selectedCategory === category.id}
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            />
          ))}
        </div>
      </section>

      {/* New Books Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">New books</h2>
          <button className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 transition-colors">
            Show all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {newBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <BookCard book={book} variant="compact" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Books Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Popular books</h2>
          <button className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 transition-colors">
            Show all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {popularBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BookCard book={book} variant="default" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Writers and Authors Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Writers and Authors</h2>
          <button className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 transition-colors">
            Show all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {authors.map((author, index) => (
            <motion.div
              key={author.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <AuthorCard author={author} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Special Books Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Special books</h2>
          <button className="flex items-center gap-2 text-yellow-400 hover:text-yellow-500 transition-colors">
            Show all
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center py-12 text-slate-400">
          <p>No special books available at the moment</p>
        </div>
      </section>
    </div>
  )
}

