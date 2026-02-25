'use client'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950">
      {children}
    </div>
  )
}
