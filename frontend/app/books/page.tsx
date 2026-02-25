'use client'

import { useEffect, useMemo, useState } from 'react'
import { bookAPI } from '@/lib/api'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, BookOpen, Play, Home, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { getImageUrl } from '@/lib/utils'

export default function BooksPage() {
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'priceLow' | 'priceHigh'>('featured')

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await bookAPI.list({ limit: 80 })
      setBooks(response.data.data || [])
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBooks = useMemo(() => {
    const text = search.trim().toLowerCase()
    let result = [...books]

    if (text) {
      result = result.filter((b) => 
        b.name?.toLowerCase().includes(text) || 
        b.author?.toLowerCase().includes(text)
      )
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        const da = a.date ? new Date(a.date).getTime() : 0
        const db = b.date ? new Date(b.date).getTime() : 0
        return db - da
      }
      if (sortBy === 'priceLow') {
        const pa = typeof a.price === 'number' ? a.price : Number.POSITIVE_INFINITY
        const pb = typeof b.price === 'number' ? b.price : Number.POSITIVE_INFINITY
        return pa - pb
      }
      if (sortBy === 'priceHigh') {
        const pa = typeof a.price === 'number' ? a.price : 0
        const pb = typeof b.price === 'number' ? b.price : 0
        return pb - pa
      }
      return 0
    })

    return result
  }, [books, search, sortBy])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 p-4 md:p-6">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-black/30 overflow-hidden"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            
            <Link 
              href="/"
              className="p-2 text-white/40 hover:text-white/70 transition-colors"
            >
              <ChevronLeft size={18} />
            </Link>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <div className="w-4 h-4 rounded bg-amber-500/50" />
              <span className="text-white/60 text-sm font-medium">BookShelf.com / All Books</span>
            </div>
          </div>

          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-white/60 hover:text-white/90 hover:bg-white/10 transition-all"
          >
            <Home size={18} />
            <span className="text-sm">Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                All Books
              </h1>
              <p className="mt-1 text-sm text-white/50">
                {filteredBooks.length} book{filteredBooks.length === 1 ? '' : 's'} in library
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search books or authors..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
                />
              </div>
              
              {/* Sort */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-white/40 hidden sm:block" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="priceLow">Price: Low to high</option>
                  <option value="priceHigh">Price: High to low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {filteredBooks.length === 0 ? (
            <div className="py-20 text-center text-white/50">
              <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
              <p>No books match your search.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
            >
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 cursor-pointer"
                >
                  {/* Category Badge */}
                  {book.category && book.category[0] && (
                    <span className="absolute top-3 left-3 z-10 px-2 py-1 bg-black/50 backdrop-blur text-white/80 text-xs rounded-lg">
                      {book.category[0].name}
                    </span>
                  )}
                  
                  {/* Cover Image */}
                  <div className="aspect-[3/4] overflow-hidden">
                    {book.cover_image ? (
                      <img 
                        src={getImageUrl(book.cover_image)} 
                        alt={book.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center">
                        <BookOpen size={32} className="text-amber-500/50" />
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Play Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-4 right-4 p-3 bg-amber-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-amber-500/30"
                  >
                    <Play size={18} fill="currentColor" />
                  </motion.button>
                  
                  {/* Info (visible on hover) */}
                  <div className="absolute bottom-4 left-4 right-14 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white font-medium text-sm truncate">{book.name}</p>
                    <p className="text-white/60 text-xs truncate">{book.author || 'Unknown'}</p>
                    {book.price && (
                      <p className="text-amber-400 text-xs mt-1">{book.price.toLocaleString()} تومان</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.main>
    </div>
  )
}
