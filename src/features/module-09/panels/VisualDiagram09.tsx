interface FlowStep {
  icon: string
  label: string
}

const SET_QUERY_DATA: FlowStep[] = [
  { icon: '✅', label: 'Mutation succeeds' },
  { icon: '⚡', label: 'setQueryData(["m09","team"], newTeam)' },
  { icon: '💾', label: 'Cache updated synchronously' },
  { icon: '🎉', label: 'UI renders — zero network calls' },
]

const INVALIDATE: FlowStep[] = [
  { icon: '✅', label: 'Mutation succeeds' },
  { icon: '🗑️', label: 'invalidateQueries(["m09","team"])' },
  { icon: '⏳', label: 'Cache marked stale → refetch fires' },
  { icon: '🌐', label: 'Network request to server' },
  { icon: '🎉', label: 'UI renders with fresh server data' },
]

function Column({ title, steps, accent }: { title: string; steps: FlowStep[]; accent: string }) {
  return (
    <div className="flex-1">
      <p className={`mb-2 text-center text-xs font-bold uppercase tracking-wide ${accent}`}>{title}</p>
      <div className="flex flex-col items-center gap-0">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center w-full">
            <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-medium text-blue-800 w-full justify-center">
              <span>{step.icon}</span>
              <span>{step.label}</span>
            </div>
            {i < steps.length - 1 && <div className="my-1 h-3 w-px bg-blue-200" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export function VisualDiagram09() {
  return (
    <div className="rounded-2xl glass-panel">
      <div className="border-b border-white/25 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🖼 Visual Diagram</h3>
      </div>
      <div className="p-4 flex gap-3">
        <Column title="setQueryData" steps={SET_QUERY_DATA} accent="text-green-600" />
        <div className="w-px bg-white/40 shrink-0" />
        <Column title="invalidateQueries" steps={INVALIDATE} accent="text-blue-600" />
      </div>
    </div>
  )
}
