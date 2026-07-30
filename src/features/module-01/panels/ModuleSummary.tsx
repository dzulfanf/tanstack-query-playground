const TAKEAWAYS = [
  { emoji: '🔑', text: 'queryKey is the cache key. Same key = same cache entry.' },
  { emoji: '📊', text: 'isPending is true only on the very first load. isError/isSuccess reflect the result.' },
  { emoji: '💾', text: 'Data is stored in Query Cache automatically. No useState needed.' },
  { emoji: '⚡', text: 'Second visit = instant render from cache, not a new network request.' },
  { emoji: '🔄', text: 'TanStack Query retries failed requests automatically. This playground uses 1 retry (library default is 3).' },
]

export function ModuleSummary() {
  return (
    <div className="mt-8 rounded-2xl border border-blue-200/40 bg-blue-100/30 backdrop-blur-[12px] p-6">
      <h2 className="mb-4 text-lg font-bold text-blue-900">✅ Module 01 Summary</h2>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Problem</p>
          <p className="text-sm text-gray-700">React has no built-in server state cache. Every render fetches fresh.</p>
        </div>
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Solution</p>
          <p className="text-sm text-gray-700">useQuery caches the response by queryKey and reuses it across components and navigations.</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Key Takeaways</p>
        {TAKEAWAYS.map((t) => (
          <div key={t.emoji} className="flex items-start gap-2">
            <span className="text-base">{t.emoji}</span>
            <p className="text-sm text-blue-900">{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
