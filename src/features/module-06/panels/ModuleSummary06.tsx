const TAKEAWAYS = [
  {
    emoji: '🔑',
    text: 'prefetchQuery uses the exact same queryKey and queryFn as useQuery — data lands exactly where the component expects it.',
  },
  {
    emoji: '⚡',
    text: 'staleTime in prefetchQuery prevents a double-fetch if the user hovers, then immediately clicks. Without it, useQuery would refetch even though data just arrived.',
  },
  {
    emoji: '🤫',
    text: 'prefetchQuery is completely silent — no re-renders, no loading states. It only writes to cache.',
  },
  {
    emoji: '🛡️',
    text: 'If data is already fresh in cache, prefetchQuery is a no-op. Safe to call on every hover event.',
  },
]

export function ModuleSummary06() {
  return (
    <div className="mt-8 rounded-2xl border border-indigo-200/40 bg-indigo-50/30 backdrop-blur-[12px] p-6">
      <h2 className="mb-4 text-lg font-bold text-indigo-900">✅ Module 06 Summary</h2>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Problem</p>
          <p className="text-sm text-gray-700">Detail views show loading spinners even when data is perfectly predictable from the list.</p>
        </div>
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Solution</p>
          <p className="text-sm text-gray-700">
            <code className="text-xs bg-white/60 px-1 rounded">prefetchQuery</code> on hover silently warms the cache so the detail renders instantly on click.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wide">Key Takeaways</p>
        {TAKEAWAYS.map((t) => (
          <div key={t.emoji} className="flex items-start gap-2">
            <span className="text-base">{t.emoji}</span>
            <p className="text-sm text-indigo-900">{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
