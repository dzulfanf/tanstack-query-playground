const SECTIONS = [
  {
    emoji: '🔴',
    label: 'Problem',
    content:
      'Every search term needs its own cached result. Manually managing a cache dictionary for every possible term is error-prone.',
  },
  {
    emoji: '🔎',
    label: 'Observation',
    content:
      "Type 'char' → results appear. Type 'bulb' → different results. Type 'char' again — should it fetch again?",
  },
  {
    emoji: '⚠️',
    label: "Why React Alone Isn't Enough",
    content:
      "With useEffect, you'd need a Map<string, PokemonDetail[]> in useState to avoid redundant fetches. Every component re-implements this from scratch.",
  },
  {
    emoji: '✅',
    label: 'TanStack Query Solution',
    content:
      "queryKey: ['pokemon', 'search', term] — each unique term is its own cache entry. Watch the Diagram tab fill up as you search different terms.",
  },
]

export function EngineeringInsight03() {
  return (
    <div className="rounded-2xl glass-panel">
      <div className="border-b border-white/25 px-4 py-3">
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
