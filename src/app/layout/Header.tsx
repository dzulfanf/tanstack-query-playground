import { Link } from '@tanstack/react-router'

const MODULES = [
  { id: '01', label: 'Query Basics', path: '/module/01' },
  { id: '02', label: 'Query Cache', path: '/module/02', disabled: true },
  { id: '03', label: 'Query Keys', path: '/module/03', disabled: true },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-lg font-bold text-blue-500">TanStack Query Playground</span>
        </div>

        <nav className="flex gap-1">
          {MODULES.map((mod) =>
            mod.disabled ? (
              <span
                key={mod.id}
                className="cursor-not-allowed rounded-full px-4 py-1.5 text-sm font-medium text-gray-300"
              >
                {mod.label}
              </span>
            ) : (
              <Link
                key={mod.id}
                to={mod.path}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 [&.active]:bg-blue-500 [&.active]:text-white"
              >
                {mod.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  )
}
