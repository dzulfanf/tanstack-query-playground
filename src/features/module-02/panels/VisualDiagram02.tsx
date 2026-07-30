interface Props {
  cacheStatus?: 'hit' | 'miss'
}

interface Step {
  label: string
  icon: string
  highlight?: boolean
}

const HIT_STEPS: Step[] = [
  { label: 'Component mounts', icon: '🧩' },
  { label: 'useQuery() called', icon: '🔑' },
  { label: 'QueryClient checks cache', icon: '🗂️' },
  { label: 'Cache HIT — data found!', icon: '✅', highlight: true },
  { label: 'Component renders instantly', icon: '⚡' },
]

const MISS_STEPS: Step[] = [
  { label: 'Component mounts', icon: '🧩' },
  { label: 'useQuery() called', icon: '🔑' },
  { label: 'QueryClient checks cache', icon: '🗂️' },
  { label: 'Cache MISS — no data', icon: '🌐', highlight: true },
  { label: 'Network request fired', icon: '📡' },
  { label: 'Response received', icon: '📦' },
  { label: 'Stored in Query Cache', icon: '💾' },
  { label: 'Component renders with data', icon: '✅' },
]

export function VisualDiagram02({ cacheStatus = 'miss' }: Props) {
  const steps = cacheStatus === 'hit' ? HIT_STEPS : MISS_STEPS

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🖼 Visual Diagram</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            cacheStatus === 'hit'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {cacheStatus === 'hit' ? 'Cache HIT' : 'Cache MISS'}
        </span>
      </div>
      <div className="p-4">
        <div className="flex flex-col items-center">
          {steps.map((step, i) => (
            <div key={i} className="flex w-full flex-col items-center">
              <div
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
                  step.highlight
                    ? cacheStatus === 'hit'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    : 'bg-blue-50 text-blue-800'
                }`}
              >
                <span>{step.icon}</span>
                <span>{step.label}</span>
              </div>
              {i < steps.length - 1 && <div className="my-1 h-4 w-px bg-blue-200" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
