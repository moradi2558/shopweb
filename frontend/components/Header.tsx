'use client'

import { Search, User } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'

export default function Header() {
  const { user } = useAuthStore()

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-slate-300 hover:text-white transition-colors font-medium"
          >
            Library
          </Link>
          <Link
            href="/books"
            className="text-slate-300 hover:text-white transition-colors font-medium"
          >
            Books
          </Link>
          <Link
            href="/authors"
            className="text-slate-300 hover:text-white transition-colors font-medium"
          >
            Authors
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search here..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">{user.username}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-yellow-400 text-slate-900 rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

