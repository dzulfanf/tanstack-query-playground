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
      'useQuery is read-only. It fetches and caches data, but has no mechanism for writing data back to the server.',
  },
  {
    emoji: '🔎',
    label: 'Observation',
    content:
      'Server writes have a different lifecycle from reads: they are imperative (you call them explicitly), fire-once, and are not automatically retried or refetched in the background.',
  },
  {
    emoji: '⚠️',
    label: 'The Distinction',
    content:
      'useMutation does not automatically update useQuery. After a mutation succeeds, the cache is untouched — the UI would show stale data unless you take an explicit action.',
  },
  {
    emoji: '✅',
    label: 'TanStack Query Solution',
    content:
      'In the onSuccess callback, call queryClient.invalidateQueries({ queryKey: [\'m08\', \'team\'] }). This marks the team cache stale and triggers an automatic refetch — the bridge between write and read.',
  },
]

export function EngineeringInsight08() {
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
