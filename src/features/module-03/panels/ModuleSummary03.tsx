const TAKEAWAYS = [
  {
    emoji: '🔑',
    text: "queryKey is dynamic. ['pokemon', 'search', term] creates a unique cache entry per search term — automatically.",
  },
  { emoji: '⚡', text: 'Typing the same search term again = instant Cache HIT. Zero network requests.' },
  {
    emoji: '🗂️',
    text: 'Different terms accumulate separately in the cache. The Diagram tab makes this visible in real time.',
  },
  {
    emoji: '⏱️',
    text: 'useDebounce(500ms) prevents fetching on every keystroke. TanStack Query only fires when the key stabilizes.',
  },
  {
    emoji: '🎯',
    text: "enabled: debouncedSearch.trim().length > 0 — don't run the query until there's real input.",
  },
]

export function ModuleSummary03() {
  return (
    <div className="mt-8 rounded-2xl border border-purple-200/40 bg-purple-100/30 backdrop-blur-[12px] p-6">
      <h2 className="mb-4 text-lg font-bold text-purple-900">✅ Module 03 Summary</h2>
      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Problem</p>
          <p className="text-sm text-gray-700">
            Search results change with every term. Caching every possible search manually is complex and error-prone.
          </p>
        </div>
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Solution</p>
          <p className="text-sm text-gray-700">
            A dynamic queryKey includes the term. Each unique term becomes a separate cache entry automatically, for free.
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-800">Key Takeaways</p>
        {TAKEAWAYS.map((t) => (
          <div key={t.emoji} className="flex items-start gap-2">
            <span className="text-base">{t.emoji}</span>
            <p className="text-sm text-purple-900">{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
