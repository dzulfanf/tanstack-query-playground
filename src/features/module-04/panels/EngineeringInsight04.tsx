interface InsightSection {
  emoji: string
  label: string
  content: string
}

const SECTIONS: InsightSection[] = [
  {
    emoji: '🔴',
    label: 'Problem',
    content: 'Background data refreshes are invisible — users see stale data without knowing a refresh is happening in the background.',
  },
  {
    emoji: '🔎',
    label: 'Observation',
    content: 'TanStack Query refetches data when the window regains focus or when staleTime expires. But nothing in the UI shows this is happening unless you render it.',
  },
  {
    emoji: '⚠️',
    label: 'The Distinction',
    content: 'isPending is true only when there is no cached data yet. isFetching is true whenever any network request is active — including silent background refreshes.',
  },
  {
    emoji: '✅',
    label: 'TanStack Query Solution',
    content: 'Check isFetching && !isPending to detect a background refresh. Show a subtle indicator — never replace existing data with a loading skeleton.',
  },
]

export function EngineeringInsight04() {
  return (
    <div className="rounded-2xl glass-panel">
      <div className="border-b border-white/25 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🧩 Engineering Insight</h3>
      </div>
      <div className="divide-y divide-white/20 px-4">
        {SECTIONS.map((s) => (
          <div key={s.label} className="py-3">
            <p className="mb-1 text-xs font-semibold text-gray-500">
              {s.emoji} {s.label}
            </p>
            <p className="text-sm leading-relaxed text-gray-700">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
