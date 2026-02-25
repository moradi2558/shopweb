'use client'

import { motion } from 'framer-motion'
import { Search, User, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'

export default function Header() {
  const { user } = useAuthStore()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 glass border-b border-[var(--border-subtle)]"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18 gap-4">
          {/* Logo - geometric block */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 6, scale: 1.05 }}
              className="relative w-10 h-10 bg-[var(--accent-warm)] flex items-center justify-center clip-corner"
            >
              <span className="absolute inset-0 bg-[var(--accent-gold)] opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay" />
              <BookOpen className="w-5 h-5 text-[var(--bg-base)]" />
            </motion.div>
            <span className="font-semibold text-[var(--text-primary)] tracking-tight hidden sm:block">
              Library
            </span>
          </Link>

          {/* Nav - center */}
          <nav className="flex items-center gap-1 md:gap-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/books', label: 'Books' },
              { href: '/authors', label: 'Authors' },
            ].map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  href={item.href}
                  className="relative px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm font-medium rounded-lg hover:bg-white/5"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Search + User */}
          <div className="flex items-center gap-2 md:gap-4">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative hidden sm:block"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search..."
                className="w-40 md:w-52 pl-9 pr-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-warm)]/50 focus:border-[var(--accent-warm)] transition-all"
              />
            </motion.div>
            {user ? (
              <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-warm)]/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-warm)]/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-[var(--accent-gold)]" />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)] hidden md:inline">{user.username}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg bg-[var(--accent-warm)] text-[var(--bg-base)] font-medium text-sm hover:bg-[var(--accent-gold)] transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
