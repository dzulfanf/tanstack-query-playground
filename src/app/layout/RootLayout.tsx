import { Outlet } from '@tanstack/react-router'
import { Header } from '@/app/layout/Header'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
