const TAKEAWAYS = [
  {
    emoji: '🔑',
    text: 'useMutation and useQuery are separate — a mutation does NOT automatically update a query\'s cache. You must bridge them explicitly.',
  },
  {
    emoji: '🌉',
    text: 'invalidateQueries in onSuccess is the canonical bridge: it marks the cache stale and triggers a background refetch automatically.',
  },
  {
    emoji: '⚠️',
    text: 'isPending is true while mutationFn is running. Use it to disable buttons and show loading feedback — users should never double-submit.',
  },
  {
    emoji: '🔴',
    text: 'If mutationFn throws, onError fires instead of onSuccess. The cache is untouched — the UI stays consistent with the last good server state.',
  },
]

export function ModuleSummary08() {
  return (
    <div className="mt-8 rounded-2xl border border-indigo-200/40 bg-indigo-50/30 backdrop-blur-[12px] p-6">
      <h2 className="mb-4 text-lg font-bold text-indigo-900">✅ Module 08 Summary</h2>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Problem</p>
          <p className="text-sm text-gray-700">useQuery is read-only — no built-in way to write to the server and keep the cache in sync.</p>
        </div>
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Solution</p>
          <p className="text-sm text-gray-700">
            <code className="text-xs bg-white/60 px-1 rounded">useMutation</code> handles the write lifecycle.{' '}
            <code className="text-xs bg-white/60 px-1 rounded">invalidateQueries</code> in{' '}
            <code className="text-xs bg-white/60 px-1 rounded">onSuccess</code> keeps the read cache fresh.
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
