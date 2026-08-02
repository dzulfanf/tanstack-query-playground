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
      'invalidateQueries always triggers a network refetch — even when you already know the exact new state from the mutation\'s response.',
  },
  {
    emoji: '🔎',
    label: 'Observation',
    content:
      'After addToTeam("pikachu"), you know exactly what the new team looks like: [...currentTeam, "pikachu"]. A round-trip to the server is redundant and adds latency.',
  },
  {
    emoji: '⚠️',
    label: 'The Trade-off',
    content:
      'setQueryData skips the refetch but trusts the client\'s own calculation. If the server applies transforms (sorting, deduplication, server-side validation), the client state may diverge from server truth.',
  },
  {
    emoji: '✅',
    label: 'Decision Rule',
    content:
      'Use setQueryData when the new state is deterministic from the mutation (you\'re the source of truth). Use invalidateQueries when the server may transform or validate the data in unpredictable ways.',
  },
]

export function EngineeringInsight09() {
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
