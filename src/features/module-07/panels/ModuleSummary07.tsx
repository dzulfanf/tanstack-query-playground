const TAKEAWAYS = [
  {
    emoji: '🔑',
    text: 'enabled accepts any boolean expression. enabled: !!url is the canonical pattern for "wait until this value exists."',
  },
  {
    emoji: '⏸',
    text: 'A dormant query has status: "pending" and fetchStatus: "idle" — not an error. The Inspector will show it grayed out.',
  },
  {
    emoji: '⚡',
    text: 'The moment enabled flips to true (on the next render), TanStack Query fires the fetch automatically — no manual trigger needed.',
  },
  {
    emoji: '🔗',
    text: 'Include the dependency in the queryKey: queryKey: ["evolution", evolutionUrl]. This ensures cache entries are separate per URL.',
  },
]

export function ModuleSummary07() {
  return (
    <div className="mt-8 rounded-2xl border border-indigo-200/40 bg-indigo-50/30 backdrop-blur-[12px] p-6">
      <h2 className="mb-4 text-lg font-bold text-indigo-900">✅ Module 07 Summary</h2>

      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Problem</p>
          <p className="text-sm text-gray-700">Query B needs a URL from Query A — parallel fetch is impossible.</p>
        </div>
        <div className="rounded-xl bg-white/40 p-4">
          <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Solution</p>
          <p className="text-sm text-gray-700">
            <code className="text-xs bg-white/60 px-1 rounded">enabled: !!dependency</code> keeps Query B dormant until Query A provides the needed value.
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
