interface FlowStep {
  icon: string
  label: string
  highlight?: boolean
}

const FLOW_STEPS: FlowStep[] = [
  { icon: '⏳', label: 'No data → isPending: true, isFetching: true' },
  { icon: '✅', label: 'First load done → isPending: false, isFetching: false' },
  { icon: '👁️', label: 'Window focus / staleTime expired' },
  { icon: '🔄', label: 'Background refetch → isFetching: true', highlight: true },
  { icon: '📋', label: 'Status strip appears — grid stays visible', highlight: true },
  { icon: '✅', label: 'Refetch done → isFetching: false' },
  { icon: '💾', label: 'Cache updated silently' },
]

export function VisualDiagram04() {
  return (
    <div className="rounded-2xl glass-panel">
      <div className="border-b border-white/25 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🖼 Visual Diagram</h3>
      </div>
      <div className="p-4">
        <div className="flex flex-col items-center gap-0">
          {FLOW_STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              <div
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium w-full justify-center ${
                  step.highlight
                    ? 'bg-yellow-50 text-yellow-800 border border-yellow-200/60'
                    : 'bg-blue-50 text-blue-800'
                }`}
              >
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
