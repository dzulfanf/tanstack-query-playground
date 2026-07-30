const TAKEAWAYS = [
  {
    emoji: '🗂️',
    text: 'Query Cache stores every response by queryKey. It persists across navigation and component unmounts.',
  },
  { emoji: '✅', text: 'Cache HIT = data returned instantly from memory. Zero network requests.' },
  { emoji: '🌐', text: 'Cache MISS = no cached data. Network request fires, response stored for next time.' },
  {
    emoji: '⏱️',
    text: 'staleTime controls how long cached data is considered fresh. Fresh data is never re-fetched on navigation.',
  },
  {
    emoji: '🔑',
    text: 'Same queryKey = same cache entry. Navigate away and back — data is still there while staleTime holds.',
  },
]

export function ModuleSummary02() {
  return (
    <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-6">
      <h2 className="mb-4 text-lg font-bold text-green-900">✅ Module 02 Summary</h2>
      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Problem</p>
          <p className="text-sm text-gray-700">
            React loses all component state on unmount. Every navigation re-fetches data from the network.
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Solution</p>
          <p className="text-sm text-gray-700">
            Query Cache persists between navigations. Same queryKey finds cached data instantly while still fresh.
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-green-800">Key Takeaways</p>
        {TAKEAWAYS.map((t) => (
          <div key={t.emoji} className="flex items-start gap-2">
            <span className="text-base">{t.emoji}</span>
            <p className="text-sm text-green-900">{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
