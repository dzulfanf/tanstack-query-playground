const SECTIONS = [
  {
    emoji: '🔴',
    label: 'Problem',
    content:
      'Every navigation to a detail page triggers a new network request — even for data fetched moments ago.',
  },
  {
    emoji: '🔎',
    label: 'Observation',
    content:
      'React unmounts the detail component when you navigate back. All useState is lost. Next visit starts fresh.',
  },
  {
    emoji: '⚠️',
    label: "Why React Alone Isn't Enough",
    content:
      'There is no built-in way to persist server responses across navigation. A global store or context requires significant manual plumbing.',
  },
  {
    emoji: '✅',
    label: 'TanStack Query Solution',
    content:
      "Query Cache stores the response by queryKey. The same key on the next visit finds data instantly — no new request — while staleTime hasn't expired.",
  },
]

export function EngineeringInsight02() {
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
