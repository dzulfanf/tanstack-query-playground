interface FlowStep {
  icon: string
  label: string
  highlight?: boolean
}

const FLOW: FlowStep[] = [
  { icon: '👆', label: 'User clicks "Add to Team"' },
  { icon: '🔄', label: 'mutate(name) called — isPending: true', highlight: true },
  { icon: '⏳', label: 'Button shows spinner, disabled' },
  { icon: '🌐', label: 'mutationFn: delay(800ms) → addToTeam()' },
  { icon: '✅', label: 'onSuccess fires', highlight: true },
  { icon: '🗑️', label: 'invalidateQueries(["m08","team"])', highlight: true },
  { icon: '🔄', label: 'Team query refetches automatically' },
  { icon: '🎉', label: 'Team panel updates with new member' },
]

export function VisualDiagram08() {
  return (
    <div className="rounded-2xl glass-panel">
      <div className="border-b border-white/25 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🖼 Visual Diagram</h3>
      </div>
      <div className="p-4">
        <div className="flex flex-col items-center gap-0">
          {FLOW.map((step, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              <div
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium w-full justify-center ${
                  step.highlight
                    ? 'bg-purple-50 text-purple-800 border border-purple-200/60'
                    : 'bg-blue-50 text-blue-800'
                }`}
              >
                <span>{step.icon}</span>
                <span>{step.label}</span>
              </div>
              {i < FLOW.length - 1 && <div className="my-1 h-3 w-px bg-blue-200" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
