const TAKEAWAYS = [
  {
    emoji: '🔑',
    text: 'isPending = no data at all. isFetching = any active request. They can both be true (first load) or only isFetching (background refresh).',
  },
  {
    emoji: '📋',
    text: 'Show a subtle indicator when isFetching && !isPending. Never replace existing data with a loading skeleton during a background refresh.',
  },
  {
    emoji: '⏱️',
    text: 'staleTime controls when data becomes stale. 0 = always stale (refetch on every focus). Infinity = never refetch automatically.',
  },
]

export function ModuleSummary04() {
  return (
    <div className="mt-8 rounded-2xl border border-yellow-200/40 bg-yellow-50/30 backdrop-blur-[12px] p-6">
      <h2 className="mb-4 text-lg font-bold text-yellow-900">✅ Module 04 Summary</h2>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Problem</p>
          <p className="text-sm text-gray-700">Background refetches are invisible. Users see stale data without knowing a refresh is happening.</p>
        </div>
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Solution</p>
          <p className="text-sm text-gray-700">Use <code className="text-xs bg-white/60 px-1 rounded">isFetching && !isPending</code> to detect background refreshes and show a subtle indicator.</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-yellow-800 uppercase tracking-wide">Key Takeaways</p>
        {TAKEAWAYS.map((t) => (
          <div key={t.emoji} className="flex items-start gap-2">
            <span className="text-base">{t.emoji}</span>
            <p className="text-sm text-yellow-900">{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
