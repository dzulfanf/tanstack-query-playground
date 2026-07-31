import type { JSX } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { PokemonDetail } from '@/shared/types/pokemon'
import { TYPE_COLORS } from '@/shared/constants/pokemon-types'

interface PokemonDetailTabsProps {
  pokemon: PokemonDetail
  size?: 'compact' | 'full'
}

export function PokemonDetailTabs({ pokemon, size = 'full' }: PokemonDetailTabsProps): JSX.Element {
  const isCompact = size === 'compact'
  const pad = isCompact ? 'p-4' : 'p-6'

  return (
    <Tabs defaultValue="info" className={pad}>
      <TabsList className="w-full grid grid-cols-3 mb-3">
        <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
        <TabsTrigger value="stats" className="text-xs">Stats</TabsTrigger>
        <TabsTrigger value="abilities" className="text-xs">Abilities</TabsTrigger>
      </TabsList>

      {/* Info tab: sprite, name, ID, types, height, weight */}
      <TabsContent value="info" className="mt-3">
        <div className="flex justify-center">
          <img
            src={
              pokemon.sprites.other['official-artwork'].front_default ??
              pokemon.sprites.front_default ??
              ''
            }
            alt={pokemon.name}
            className={`object-contain ${isCompact ? 'h-28 w-28' : 'h-40 w-40'}`}
          />
        </div>
        <p className="mt-1 text-center text-xs text-gray-400">
          #{String(pokemon.id).padStart(3, '0')}
        </p>
        <p className={`text-center font-bold capitalize text-gray-800 ${isCompact ? 'text-sm' : 'text-2xl'}`}>
          {pokemon.name}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className={`rounded-full px-3 py-0.5 text-sm font-medium capitalize ${
                TYPE_COLORS[t.type.name] ?? 'bg-gray-100 text-gray-600'
              }`}
            >
              {t.type.name}
            </span>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/30 p-2 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Height</p>
            <p className={`font-bold text-gray-800 ${isCompact ? 'text-sm' : 'text-base'}`}>
              {(pokemon.height / 10).toFixed(1)}m
            </p>
          </div>
          <div className="rounded-xl bg-white/30 p-2 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Weight</p>
            <p className={`font-bold text-gray-800 ${isCompact ? 'text-sm' : 'text-base'}`}>
              {(pokemon.weight / 10).toFixed(1)}kg
            </p>
          </div>
        </div>
      </TabsContent>

      {/* Stats tab: all base stats with progress bars */}
      <TabsContent value="stats" className="mt-3">
        <div className="space-y-1.5">
          {pokemon.stats.map((s) => (
            <div key={s.stat.name} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs font-medium capitalize text-gray-500">
                {s.stat.name.replace(/-/g, ' ')}
              </span>
              <span className="w-7 shrink-0 text-right text-xs font-bold text-gray-800">
                {s.base_stat}
              </span>
              <div className="flex-1 rounded-full bg-white/40 h-1.5">
                <div
                  className="h-1.5 rounded-full bg-blue-400 transition-all"
                  style={{ width: `${Math.min(100, (s.base_stat / 255) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Abilities tab: ability badge pills */}
      <TabsContent value="abilities" className="mt-3">
        <div className="flex flex-wrap gap-2">
          {pokemon.abilities.map((a) => (
            <span
              key={a.ability.name}
              className="rounded-full bg-white/30 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-700"
            >
              {a.ability.name.replace(/-/g, ' ')}
              {a.is_hidden && (
                <span className="ml-1 text-gray-400">(hidden)</span>
              )}
            </span>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
