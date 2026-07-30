import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useLearningMode } from '@/shared/hooks/use-learning-mode'

const MODULES = [
  { id: '01', label: 'Query Basics', path: '/module/01' },
  { id: '02', label: 'Query Cache', path: '/module/02' },
  { id: '03', label: 'Query Keys', path: '/module/03' },
]

export function Header() {
  const { enabled, toggle } = useLearningMode()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="relative sticky top-0 z-50 glass-header">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:gap-6 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="hidden sm:inline text-lg font-bold text-blue-500">TanStack Query Playground</span>
          <span className="sm:hidden text-sm font-bold text-blue-500">TQ Playground</span>
        </div>

        <nav className="hidden sm:flex gap-1">
          {MODULES.map((mod) => (
            <Link
              key={mod.id}
              to={mod.path}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-white/30 hover:text-blue-700 [&.active]:bg-white/40 [&.active]:text-blue-700 [&.active]:font-semibold"
            >
              {mod.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={toggle}
          className={`ml-auto flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
            enabled
              ? 'bg-yellow-400 text-yellow-900 shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700'
          }`}
        >
          <span>{enabled ? '🎓' : '💡'}</span>
          <span className="hidden sm:inline">{enabled ? 'Learning: ON' : 'Learning: OFF'}</span>
          <span className="sm:hidden">{enabled ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="sm:hidden rounded-full p-1.5 text-gray-700 hover:bg-white/30 transition"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 glass-panel rounded-none border-t border-white/25 px-4 py-2">
          {MODULES.map((mod) => (
            <Link
              key={mod.id}
              to={mod.path}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 [&.active]:bg-blue-50 [&.active]:text-blue-600"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold [.active_&]:bg-blue-500 [.active_&]:text-white">
                {mod.id}
              </span>
              {mod.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
