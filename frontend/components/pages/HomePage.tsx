'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, Heart, Download, User, Settings, Search, 
  Bell, Play, ChevronLeft, ChevronRight, RefreshCw,
  Clock, Star, TrendingUp, BookOpen, Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { homeAPI } from '@/lib/api'
import { getImageUrl } from '@/lib/utils'

interface Book {
  id: number
  name: string
  author?: string
  price: number
  cover_image?: string
  category?: { id: number; name: string }[]
  date?: string
  description?: string
}

interface Category {
  id: number
  name: string
}

interface HomeData {
  categories: Category[]
  new_books: Book[]
  popular_books: Book[]
  special_books: Book[]
}

const sidebarIcons = [
  { icon: Home, label: 'Home', active: true },
  { icon: Heart, label: 'Favorites' },
  { icon: Download, label: 'Downloads' },
  { icon: User, label: 'Profile' },
  { icon: Settings, label: 'Settings' },
]

const categoryTabs = ['Home', 'New Books', 'Popular', 'Special', 'Categories']

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Home')
  const [heroIndex, setHeroIndex] = useState(0)
  const heroIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await homeAPI.get()
        // API returns { message: ..., data: { categories, new_books, ... } }
        setData(response.data.data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const specialBooks = data?.special_books || []
  const popularBooks = data?.popular_books || []
  const newBooks = data?.new_books || []
  const categories = data?.categories || []
  
  const allBooks = [...specialBooks, ...popularBooks, ...newBooks]
  const heroBooks = allBooks.slice(0, 5)

  useEffect(() => {
    if (heroBooks.length > 1) {
      heroIntervalRef.current = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % heroBooks.length)
      }, 6000)
    }
    return () => {
      if (heroIntervalRef.current) clearInterval(heroIntervalRef.current)
    }
  }, [heroBooks.length])

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

  const currentHeroBook = heroBooks[heroIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 p-4 md:p-6 flex gap-4">
      
      {/* Floating Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex flex-col items-center py-6 px-3 gap-6 
          bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10
          shadow-2xl shadow-black/20 h-fit sticky top-6"
      >
        {sidebarIcons.map(({ icon: Icon, label, active }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-2xl transition-all duration-300 ${
              active 
                ? 'bg-amber-500/20 text-amber-400' 
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
            title={label}
          >
            <Icon size={22} />
          </motion.button>
        ))}
      </motion.aside>

      {/* Main Container - Glassmorphic Card */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 
          shadow-2xl shadow-black/30 overflow-hidden"
      >
        {/* Top Bar - Browser Style */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            {/* Window Controls */}
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            
            {/* Navigation */}
            <button className="p-2 text-white/40 hover:text-white/70 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 text-white/40 hover:text-white/70 transition-colors">
              <ChevronRight size={18} />
            </button>
            <button className="p-2 text-white/40 hover:text-white/70 transition-colors">
              <RefreshCw size={16} />
            </button>
            
            {/* URL Bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 ml-2">
              <div className="w-4 h-4 rounded bg-amber-500/50" />
              <span className="text-white/60 text-sm font-medium">BookShelf.com</span>
            </div>
          </div>

          {/* Right Side - User Profile */}
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="relative p-2 text-white/60 hover:text-white/90 transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-stone-900" />
            </motion.button>
            
            <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-white/80 text-sm font-medium pr-2">Guest</span>
            </div>
          </div>
        </div>

        {/* Navigation & Header */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Search Bar */}
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5 w-72">
            <Search size={18} className="text-white/40" />
            <input 
              type="text"
              placeholder="Search books..."
              className="bg-transparent text-white/90 text-sm placeholder:text-white/30 outline-none flex-1"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-white/5 rounded-2xl p-1.5">
            {categoryTabs.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-amber-500/20 text-amber-400' 
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex gap-6 p-6 pt-2">
          
          {/* Left Column - Sidebar Content */}
          <div className="w-72 flex-shrink-0 space-y-6">
            
            {/* New Releases Section */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/5 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-amber-400" />
                <h3 className="text-white/90 font-semibold">New Releases</h3>
              </div>
              
              <div className="space-y-3">
                {newBooks.slice(0, 4).map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    className="flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex-shrink-0">
                      {book.cover_image ? (
                        <img 
                          src={getImageUrl(book.cover_image)} 
                          alt={book.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={20} className="text-amber-500/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-sm font-medium truncate">{book.name}</p>
                      <p className="text-white/40 text-xs truncate">{book.author || 'Unknown'}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-amber-500/20 rounded-full text-amber-400"
                    >
                      <Play size={12} fill="currentColor" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Popular Now Section */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/5 p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-green-400" />
                <h3 className="text-white/90 font-semibold">Popular Now</h3>
              </div>
              
              <div className="space-y-3">
                {popularBooks.slice(0, 4).map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    className="flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex-shrink-0 flex items-center justify-center text-white/60 text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-sm font-medium truncate">{book.name}</p>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star size={10} fill="currentColor" />
                        <span className="text-xs">4.{8 - i}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            
            {/* Hero Section */}
            <motion.div 
              className="relative h-80 rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900/50 to-stone-900/50 border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {currentHeroBook && (
                  <motion.div
                    key={currentHeroBook.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                  >
                    {/* Background Image */}
                    {currentHeroBook.cover_image && (
                      <div className="absolute inset-0">
                        <img 
                          src={getImageUrl(currentHeroBook.cover_image)} 
                          alt=""
                          className="w-full h-full object-cover opacity-30 blur-sm"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent" />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="relative h-full flex items-center p-8">
                      {/* Book Cover */}
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-44 h-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 flex-shrink-0 border-2 border-white/10"
                      >
                        {currentHeroBook.cover_image ? (
                          <img 
                            src={getImageUrl(currentHeroBook.cover_image)} 
                            alt={currentHeroBook.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-500/30 to-orange-600/30 flex items-center justify-center">
                            <BookOpen size={48} className="text-amber-500/50" />
                          </div>
                        )}
                      </motion.div>
                      
                      {/* Info */}
                      <div className="ml-8 flex-1">
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full mb-3">
                            Featured Book
                          </span>
                          <h1 className="text-3xl font-bold text-white mb-2 line-clamp-2">
                            {currentHeroBook.name}
                          </h1>
                          <p className="text-white/60 text-sm mb-1">
                            By {currentHeroBook.author || 'Unknown Author'}
                          </p>
                          <p className="text-white/40 text-sm mb-6 line-clamp-2 max-w-md">
                            {currentHeroBook.description || 'Discover an amazing journey through the pages of this book.'}
                          </p>
                          
                          <div className="flex items-center gap-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-xl font-semibold text-sm"
                            >
                              <BookOpen size={18} />
                              Read Now
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur text-white rounded-xl font-semibold text-sm border border-white/10"
                            >
                              <Download size={18} />
                              Download
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Hero Navigation Dots */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                {heroBooks.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === heroIndex ? 'w-6 bg-amber-500' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Book Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white/90 font-semibold flex items-center gap-2">
                  <Star size={18} className="text-amber-400" />
                  Special Collection
                </h2>
                <Link 
                  href="/books"
                  className="text-amber-400/80 text-sm hover:text-amber-400 transition-colors"
                >
                  View all →
                </Link>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {specialBooks.slice(0, 4).map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
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
                    
                    {/* Title (visible on hover) */}
                    <div className="absolute bottom-4 left-4 right-14 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-medium text-sm truncate">{book.name}</p>
                      <p className="text-white/60 text-xs truncate">{book.author}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Categories Row */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white/90 font-semibold">Browse Categories</h2>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {categories.slice(0, 8).map((cat, i) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0 px-5 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    {cat.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* More Books Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white/90 font-semibold flex items-center gap-2">
                  <Clock size={18} className="text-blue-400" />
                  Recently Added
                </h2>
                <Link 
                  href="/books"
                  className="text-amber-400/80 text-sm hover:text-amber-400 transition-colors"
                >
                  View all →
                </Link>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {newBooks.slice(0, 4).map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 cursor-pointer"
                  >
                    {book.category && book.category[0] && (
                      <span className="absolute top-3 left-3 z-10 px-2 py-1 bg-black/50 backdrop-blur text-white/80 text-xs rounded-lg">
                        {book.category[0].name}
                      </span>
                    )}
                    
                    <div className="aspect-[3/4] overflow-hidden">
                      {book.cover_image ? (
                        <img 
                          src={getImageUrl(book.cover_image)} 
                          alt={book.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-cyan-600/20 flex items-center justify-center">
                          <BookOpen size={32} className="text-blue-500/50" />
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-4 right-4 p-3 bg-blue-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-blue-500/30"
                    >
                      <Play size={18} fill="currentColor" />
                    </motion.button>
                    
                    <div className="absolute bottom-4 left-4 right-14 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-medium text-sm truncate">{book.name}</p>
                      <p className="text-white/60 text-xs truncate">{book.author}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.main>
    </div>
  )
}
