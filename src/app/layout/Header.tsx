import { Link } from '@tanstack/react-router'
import { useLearningMode } from '@/shared/hooks/use-learning-mode'

const MODULES = [
  { id: '01', label: 'Query Basics', path: '/module/01' },
  { id: '02', label: 'Query Cache', path: '/module/02' },
  { id: '03', label: 'Query Keys', path: '/module/03' },
]

export function Header() {
  const { enabled, toggle } = useLearningMode()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-lg font-bold text-blue-500">TanStack Query Playground</span>
        </div>

        <nav className="flex gap-1">
          {MODULES.map((mod) => (
            <Link
              key={mod.id}
              to={mod.path}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 [&.active]:bg-blue-500 [&.active]:text-white"
            >
              {mod.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={toggle}
          className={`ml-auto flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            enabled
              ? 'bg-yellow-400 text-yellow-900 shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700'
          }`}
        >
          <span>{enabled ? '🎓' : '💡'}</span>
          {enabled ? 'Learning: ON' : 'Learning: OFF'}
        </button>
      </div>
    </header>
  )
}
