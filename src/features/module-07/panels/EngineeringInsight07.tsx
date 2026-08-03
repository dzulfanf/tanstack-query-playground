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
      'Query B needs data from Query A — specifically a URL that only exists in A\'s response. You cannot fetch both in parallel.',
  },
  {
    emoji: '🔎',
    label: 'Observation',
    content:
      'Without the enabled flag, Query B fires immediately with undefined as the URL. This causes a malformed request or a 404 before Query A has even resolved.',
  },
  {
    emoji: '⚠️',
    label: 'The Distinction',
    content:
      'enabled: false is not an error state. The query\'s status is "pending" but fetchStatus is "idle" — it is dormant, not failed. It will activate the moment enabled becomes truthy.',
  },
  {
    emoji: '✅',
    label: 'TanStack Query Solution',
    content:
      'Derive the dependency: const evolutionUrl = species?.evolution_chain.url. Pass enabled: !!evolutionUrl to the second query. It stays dormant until the URL is available, then fires automatically.',
  },
]

export function EngineeringInsight07() {
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
