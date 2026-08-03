export function VisualDiagram07() {
  return (
    <div className="rounded-2xl glass-panel">
      <div className="border-b border-white/25 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🖼 Visual Diagram</h3>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Query Timeline</p>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs text-gray-400">t = 0</span>
            <div className="flex-1 rounded-xl bg-blue-50 border border-blue-200/60 px-3 py-2 text-xs font-medium text-blue-800">
              🟡 Query 1: species/bulbasaur — fetching…
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs text-gray-400">t = 0</span>
            <div className="flex-1 rounded-xl bg-gray-50 border border-gray-200/60 px-3 py-2 text-xs font-medium text-gray-400">
              ⏸ Query 2: evolution chain — dormant (enabled: false)
            </div>
          </div>
        </div>

        <div className="h-px bg-white/40 my-2" />

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs text-gray-400">t = 1</span>
            <div className="flex-1 rounded-xl bg-green-50 border border-green-200/60 px-3 py-2 text-xs font-medium text-green-800">
              ✅ Query 1: done — evolution_chain.url available
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs text-gray-400">t = 1</span>
            <div className="flex-1 rounded-xl bg-yellow-50 border border-yellow-200/60 px-3 py-2 text-xs font-medium text-yellow-800">
              🟡 Query 2: evolution chain — now fetching (enabled: true)
            </div>
          </div>
        </div>

        <div className="h-px bg-white/40 my-2" />

        <div className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-xs text-gray-400">t = 2</span>
          <div className="flex-1 rounded-xl bg-green-50 border border-green-200/60 px-3 py-2 text-xs font-medium text-green-800">
            ✅ Query 2: done — evolution chain rendered
          </div>
        </div>
      </div>
    </div>
  )
}
