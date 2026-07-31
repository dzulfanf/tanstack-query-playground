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
  onClick: (pokemon: PokemonDetail) => void
}

export function PokemonCard({ pokemon, onClick }: Props) {
  const sprite =
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.front_default

  return (
    <div
      onClick={() => onClick(pokemon)}
      className="group cursor-pointer rounded-2xl glass-panel p-3 transition hover:bg-white/60 hover:shadow-lg"
    >
      <div className="flex h-20 items-center justify-center rounded-xl bg-white/30">
        {sprite ? (
          <img
            src={sprite}
            alt={pokemon.name}
            className="h-16 w-16 object-contain transition group-hover:scale-110"
          />
        ) : (
          <span className="text-4xl">❓</span>
        )}
      </div>
      <p className="mt-1 text-center text-xs text-gray-400">#{String(pokemon.id).padStart(3, '0')}</p>
      <p className="text-center text-sm font-semibold capitalize text-gray-800">{pokemon.name}</p>
      <div className="mt-1.5 flex flex-wrap justify-center gap-1">
        {pokemon.types.map((t) => (
          <span
            key={t.type.name}
            className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${TYPE_COLORS[t.type.name] ?? 'bg-gray-100 text-gray-600'}`}
          >
            {t.type.name}
          </span>
        ))}
      </div>
    </div>
  )
}
