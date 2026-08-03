const TAKEAWAYS = [
  {
    emoji: '⚡',
    text: 'setQueryData updates the cache synchronously with data you provide — zero network calls, zero latency. The UI re-renders in the same tick.',
  },
  {
    emoji: '🌐',
    text: 'invalidateQueries defers to the server. It marks the cache stale, which triggers TanStack Query to refetch and get authoritative data.',
  },
  {
    emoji: '🤔',
    text: 'The choice depends on trust: setQueryData = "I know what the new state is." invalidateQueries = "Let the server confirm."',
  },
  {
    emoji: '🔀',
    text: 'You can combine both: use setQueryData for instant UI feedback (optimistic), then invalidateQueries to sync with the server after.',
  },
]

export function ModuleSummary09() {
  return (
    <div className="mt-8 rounded-2xl border border-indigo-200/40 bg-indigo-50/30 backdrop-blur-[12px] p-6">
      <h2 className="mb-4 text-lg font-bold text-indigo-900">✅ Module 09 Summary</h2>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Problem</p>
          <p className="text-sm text-gray-700">invalidateQueries always refetches — wasteful when the new state is deterministic from the mutation.</p>
        </div>
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Solution</p>
          <p className="text-sm text-gray-700">
            <code className="text-xs bg-white/60 px-1 rounded">setQueryData</code> writes directly to cache with known data. Choose based on whether you trust client or server as source of truth.
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
