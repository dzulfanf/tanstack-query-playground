interface PageRow {
  label: string
  items: string
  isNew?: boolean
}

const PAGE_ROWS: PageRow[] = [
  { label: 'pages[0]', items: 'Bulbasaur … Raticate' },
  { label: 'pages[1]', items: 'Fearow … Arcanine', isNew: true },
  { label: 'pages[2]', items: 'Poliwrath … Haunter', isNew: true },
]

export function VisualDiagram05() {
  return (
    <div className="rounded-2xl glass-panel">
      <div className="border-b border-white/25 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">🖼 Visual Diagram</h3>
      </div>
      <div className="p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          data.pages — grows with each Load More
        </p>
        <div className="space-y-1.5">
          {PAGE_ROWS.map((row) => (
            <div
              key={row.label}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                row.isNew
                  ? 'bg-blue-50 border border-blue-200/60 text-blue-800'
                  : 'bg-white/40 text-gray-700'
              }`}
            >
              <span className="font-mono text-xs font-bold w-16 shrink-0">{row.label}</span>
              <span className="text-xs text-gray-500">→</span>
              <span className="text-xs">[{row.items}]</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-col items-center gap-1">
          <div className="h-4 w-px bg-gray-300" />
          <div className="rounded-xl bg-green-50 border border-green-200/60 px-3 py-2 w-full text-center">
            <p className="text-xs font-semibold text-green-800">pages.flatMap(p =&gt; p.details)</p>
            <p className="text-xs text-green-700 mt-0.5">→ single flat list rendered in the grid</p>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-white/40 p-3 text-xs text-gray-600 space-y-1">
          <p><strong>getNextPageParam</strong> returns next offset or <code>undefined</code></p>
          <p><strong>isFetchingNextPage</strong> is true only while fetching the next batch</p>
          <p><strong>hasNextPage</strong> is false when getNextPageParam returns undefined</p>
        </div>
      </div>
    </div>
  )
}
