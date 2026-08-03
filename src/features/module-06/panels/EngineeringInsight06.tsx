interface InsightSection {
  emoji: string
  label: string
  content: string
}

const SECTIONS: InsightSection[] = [
  {
    emoji: '🔴',
    label: 'Problem',
    content:
      'Navigating to a detail view shows a loading spinner every time — even when the data is completely predictable from the list.',
  },
  {
    emoji: '🔎',
    label: 'Observation',
    content:
      'When a user hovers over a card, there is a ~200ms window before their click lands — enough time to start loading the detail data in the background.',
  },
  {
    emoji: '⚠️',
    label: 'The Distinction',
    content:
      'prefetchQuery is silent — it writes to the cache but triggers no re-render. If the same queryKey is already fresh in cache, it skips the network call entirely.',
  },
  {
    emoji: '✅',
    label: 'TanStack Query Solution',
    content:
      'Call queryClient.prefetchQuery() in onMouseEnter using the exact same queryKey and queryFn as the detail component. When the user clicks, useQuery finds data already fresh and renders without waiting.',
  },
]

export function EngineeringInsight06() {
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
