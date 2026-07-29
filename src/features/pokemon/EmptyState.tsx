export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <span className="text-5xl">🔍</span>
      <p className="text-lg font-semibold text-gray-600">No Pokémon found</p>
      <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
    </div>
  )
}
