interface InsightSection {
  emoji: string
  label: string
  content: string
}

const SECTIONS: InsightSection[] = [
  {
    emoji: '🔴',
    label: 'Problem',
    content: 'useQuery fetches a single page. To load more, you\'d have to manually track offsets and merge arrays — error-prone and full of edge cases.',
  },
  {
    emoji: '🔎',
    label: 'Observation',
    content: 'Paginated APIs return a "next" cursor or offset. Each page of results should accumulate in the UI, not replace the previous page.',
  },
  {
    emoji: '⚠️',
    label: 'The Structure',
    content: 'useInfiniteQuery stores data as pages[] instead of a flat result. Each fetchNextPage call appends a new item to the pages array.',
  },
  {
    emoji: '✅',
    label: 'TanStack Query Solution',
    content: 'getNextPageParam tells TanStack Query what to pass as pageParam next time. Return undefined to signal "no more pages." Use pages.flatMap() to render everything as a single list.',
  },
]

export function EngineeringInsight05() {
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
