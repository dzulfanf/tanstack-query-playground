interface FlowStep {
  icon: string
  label: string
  highlight?: boolean
  dim?: boolean
}

const WITHOUT: FlowStep[] = [
  { icon: '👆', label: 'Click card' },
  { icon: '⏳', label: 'isPending: true — spinner shows' },
  { icon: '🌐', label: 'Network request fires' },
  { icon: '✅', label: 'Data arrives → render' },
]

const WITH: FlowStep[] = [
  { icon: '🖱️', label: 'Hover card → prefetchQuery (background)', highlight: true },
  { icon: '💾', label: 'Cache populated silently', highlight: true },
  { icon: '👆', label: 'Click card' },
  { icon: '⚡', label: 'isPending: false — instant render', highlight: true },
]

function FlowColumn({ title, steps, accent }: { title: string; steps: FlowStep[]; accent: string }) {
  return (
    <div className="flex-1">
      <p className={`mb-2 text-center text-xs font-bold uppercase tracking-wide ${accent}`}>{title}</p>
      <div className="flex flex-col items-center gap-0">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center w-full">
            <div
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium w-full justify-center ${
                step.highlight
                  ? 'bg-green-50 text-green-800 border border-green-200/60'
                  : 'bg-blue-50 text-blue-800'
              }`}
            >
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

export function VisualDiagram06() {
  return (
    <div className="rounded-2xl glass-panel">
      <div className="border-b border-white/25 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🖼 Visual Diagram</h3>
      </div>
      <div className="p-4 flex gap-3">
        <FlowColumn title="Without Prefetch" steps={WITHOUT} accent="text-red-500" />
        <div className="w-px bg-white/40 shrink-0" />
        <FlowColumn title="With Prefetch" steps={WITH} accent="text-green-600" />
      </div>
    </div>
  )
}
