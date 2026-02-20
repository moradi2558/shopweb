'use client'

import Layout from '@/components/Layout'
import { useEffect, useState } from 'react'
import { User, Mail, MapPin, Phone, BookOpen, AlertCircle } from 'lucide-react'
import { profileAPI, statsAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchData()
  }, [isAuthenticated, router])

  const fetchData = async () => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        profileAPI.get(),
        statsAPI.user(),
      ])
      setProfile(profileRes.data.data)
      setStats(statsRes.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">Profile</h1>

        {/* Profile Card */}
        <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="w-5 h-5" />
              <span>{profile?.address || 'No address provided'}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Phone className="w-5 h-5" />
              <span>{profile?.phone || 'No phone provided'}</span>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/90 backdrop-blur-lg rounded-xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-yellow-400" />
                <h3 className="text-slate-300 font-medium">Active Borrows</h3>
              </div>
              <p className="text-3xl font-bold text-white">{stats.active_borrows}</p>
              <p className="text-sm text-slate-400 mt-1">
                Limit: {stats.borrow_limit} | Remaining: {stats.remaining_borrow_limit}
              </p>
            </div>

            <div className="bg-slate-800/90 backdrop-blur-lg rounded-xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-green-400" />
                <h3 className="text-slate-300 font-medium">Total Borrows</h3>
              </div>
              <p className="text-3xl font-bold text-white">{stats.total_borrows}</p>
              <p className="text-sm text-slate-400 mt-1">
                Returned: {stats.returned_borrows}
              </p>
            </div>

            <div className="bg-slate-800/90 backdrop-blur-lg rounded-xl border border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <h3 className="text-slate-300 font-medium">Warnings</h3>
              </div>
              <p className="text-3xl font-bold text-white">{stats.warnings}</p>
              {stats.overdue_borrows > 0 && (
                <p className="text-sm text-red-400 mt-1">
                  {stats.overdue_borrows} overdue
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

