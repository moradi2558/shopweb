'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Search, 
  BookOpen, 
  Heart, 
  Settings, 
  User,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: BookOpen, label: 'Books', path: '/books' },
  { icon: Heart, label: 'Favorites', path: '/favorites' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: User, label: 'Profile', path: '/profile' },
]

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-20 bg-slate-900/90 backdrop-blur-lg border-r border-slate-700 z-50 flex flex-col items-center py-6"
          >
            {/* Logo */}
            <div className="mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 flex flex-col gap-4 w-full">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative flex items-center justify-center w-full py-3 transition-all group ${
                      isActive ? 'text-yellow-400' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 w-1 h-8 bg-yellow-400 rounded-r-full"
                      />
                    )}
                    <Icon className="w-6 h-6" />
                    <span className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </nav>

            {/* Toggle Button */}
            <button
              onClick={onToggle}
              className="mt-auto p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-4 top-4 z-50 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
      )}
    </>
  )
}

