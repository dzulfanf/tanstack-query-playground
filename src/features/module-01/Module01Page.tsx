import { useState } from 'react'
import { PokemonGrid } from '@/features/pokemon/PokemonGrid'
import type { PokemonDetail } from '@/shared/types/pokemon'

export function Module01Page() {
  const [selected, setSelected] = useState<PokemonDetail | null>(null)

  return (
    <div className="flex gap-6">
      {/* Left: Playground */}
      <div className="flex-1">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Module 01 — Query Basics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Click any Pokemon to see useQuery in action. Watch the right panel update live.
          </p>
        </div>
        <PokemonGrid onSelect={setSelected} />
      </div>

      {/* Right: Panels placeholder — filled in Tasks 6–9 */}
      <aside className="w-80 shrink-0">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          {selected ? (
            <div className="text-center">
              <img
                src={selected.sprites.other['official-artwork'].front_default ?? selected.sprites.front_default ?? ''}
                alt={selected.name}
                className="mx-auto h-28 w-28"
              />
              <p className="mt-2 text-lg font-bold capitalize text-gray-900">{selected.name}</p>
              <p className="text-sm text-gray-400">#{String(selected.id).padStart(3, '0')}</p>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-400">Select a Pokemon to inspect its query state</p>
          )}
        </div>
      </aside>
    </div>
  )
}
