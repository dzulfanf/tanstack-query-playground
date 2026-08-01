const TAKEAWAYS = [
  {
    emoji: '🔑',
    text: 'useInfiniteQuery stores data as pages[] — not a flat array. Use pages.flatMap() to render all loaded items in one grid.',
  },
  {
    emoji: '📄',
    text: 'getNextPageParam returning undefined means "no more pages." Any other value becomes the next pageParam passed to queryFn.',
  },
  {
    emoji: '⏳',
    text: 'isFetchingNextPage lets you show a loading indicator on the button without hiding already-loaded cards. It\'s separate from isFetching.',
  },
]

export function ModuleSummary05() {
  return (
    <div className="mt-8 rounded-2xl border border-indigo-200/40 bg-indigo-50/30 backdrop-blur-[12px] p-6">
      <h2 className="mb-4 text-lg font-bold text-indigo-900">✅ Module 05 Summary</h2>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Problem</p>
          <p className="text-sm text-gray-700">Manually tracking offsets and merging page arrays is error-prone and verbose.</p>
        </div>
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Solution</p>
          <p className="text-sm text-gray-700"><code className="text-xs bg-white/60 px-1 rounded">useInfiniteQuery</code> manages page accumulation, next-page params, and loading state automatically.</p>
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
