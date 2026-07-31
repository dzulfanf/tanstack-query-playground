const FLOW_STEPS = [
  { label: 'Component mounts', icon: '🧩' },
  { label: 'useQuery() called', icon: '🔑' },
  { label: 'QueryClient checks cache', icon: '🗂️' },
  { label: 'Cache miss → network request', icon: '🌐' },
  { label: 'Response received', icon: '📦' },
  { label: 'Stored in Query Cache', icon: '💾' },
  { label: 'Component re-renders with data', icon: '✅' },
]

export function VisualDiagram() {
  return (
    <div className="rounded-2xl glass-panel">
      <div className="border-b border-white/25 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🖼 Visual Diagram</h3>
      </div>
      <div className="p-4">
        <div className="flex flex-col items-center gap-0">
          {FLOW_STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 w-full justify-center">
                <span>{step.icon}</span>
                <span>{step.label}</span>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div className="my-1 h-4 w-px bg-blue-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
