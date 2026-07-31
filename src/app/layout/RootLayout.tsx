import { Outlet } from '@tanstack/react-router'
import { Header } from '@/app/layout/Header'
import { LearningEventStrip } from '@/shared/components/LearningEventStrip'

export function RootLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <LearningEventStrip />
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        <Outlet />
      </main>
    </div>
  )
}
