import { X } from 'lucide-react'
import type { PokemonDetail } from '@/shared/types/pokemon'

const TYPE_COLORS: Record<string, string> = {
  fire: 'bg-orange-100 text-orange-700',
  water: 'bg-blue-100 text-blue-700',
  grass: 'bg-green-100 text-green-700',
  electric: 'bg-yellow-100 text-yellow-700',
  psychic: 'bg-pink-100 text-pink-700',
  ice: 'bg-cyan-100 text-cyan-700',
  dragon: 'bg-indigo-100 text-indigo-700',
  dark: 'bg-gray-100 text-gray-700',
  fairy: 'bg-rose-100 text-rose-700',
  normal: 'bg-gray-100 text-gray-600',
  fighting: 'bg-red-100 text-red-700',
  flying: 'bg-sky-100 text-sky-700',
  poison: 'bg-purple-100 text-purple-700',
  ground: 'bg-amber-100 text-amber-700',
  rock: 'bg-stone-100 text-stone-700',
  bug: 'bg-lime-100 text-lime-700',
  ghost: 'bg-violet-100 text-violet-700',
  steel: 'bg-slate-100 text-slate-700',
}

interface Props {
  pokemon: PokemonDetail
  onClose: () => void
}

export function PokemonBottomSheet({ pokemon, onClose }: Props) {
  return (
    <div className="lg:hidden fixed inset-0 z-40 flex items-end">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full rounded-t-2xl bg-white/60 backdrop-blur-[20px] border border-white/60 shadow-xl animate-slide-up max-h-[85vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-3 right-4 z-10 rounded-full p-1.5 text-gray-400 hover:bg-white/40 transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="px-5 pt-4 pb-5">
          {/* Artwork */}
          <div className="flex justify-center">
            <img
              src={
                pokemon.sprites.other['official-artwork'].front_default ??
                pokemon.sprites.front_default ??
                ''
              }
              alt={pokemon.name}
              className="h-28 w-28"
            />
          </div>

          {/* Name & number — card format */}
          <p className="mt-1 text-center text-xs text-gray-400">#{String(pokemon.id).padStart(3, '0')}</p>
          <p className="text-center text-sm font-semibold capitalize text-gray-800">{pokemon.name}</p>

          {/* Types */}
          <div className="mt-2 flex justify-center gap-2">
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

          {/* Height & Weight */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/30 p-2 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Height</p>
              <p className="text-base font-bold text-gray-800">
                {(pokemon.height / 10).toFixed(1)}m
              </p>
            </div>
            <div className="rounded-xl bg-white/30 p-2 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Weight</p>
              <p className="text-base font-bold text-gray-800">
                {(pokemon.weight / 10).toFixed(1)}kg
              </p>
            </div>
          </div>

          {/* Base Stats */}
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Base Stats
          </p>
          <div className="mt-1.5 space-y-1.5">
            {pokemon.stats.map((s) => (
              <div key={s.stat.name} className="flex items-center gap-3">
                <span className="w-28 text-xs font-medium capitalize text-gray-500">
                  {s.stat.name.replace(/-/g, ' ')}
                </span>
                <span className="w-7 text-right text-xs font-bold text-gray-800">
                  {s.base_stat}
                </span>
                <div className="flex-1 rounded-full bg-white/40 h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-blue-400 transition-all"
                    style={{ width: `${Math.min(100, (s.base_stat / 200) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
