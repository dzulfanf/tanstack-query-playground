interface InsightSection {
  emoji: string
  label: string
  content: string
}

const SECTIONS: InsightSection[] = [
  {
    emoji: '🔴',
    label: 'Problem',
    content: 'Every time you visit a page, a new network request fires — even for data you fetched 2 seconds ago.',
  },
  {
    emoji: '🔎',
    label: 'Observation',
    content: 'React has no memory between renders. Each useEffect + fetch knows nothing about previous fetches.',
  },
  {
    emoji: '⚠️',
    label: "Why React Alone Isn't Enough",
    content: 'useState/useEffect manages UI state. It was never designed to cache server responses, handle race conditions, or retry on failure.',
  },
  {
    emoji: '✅',
    label: 'TanStack Query Solution',
    content: 'useQuery stores the response in a Query Cache keyed by queryKey. The next component that needs the same data gets it instantly — no new network request.',
  },
]

export function EngineeringInsight() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🧩 Engineering Insight</h3>
      </div>
      <div className="divide-y divide-gray-50 px-4">
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
