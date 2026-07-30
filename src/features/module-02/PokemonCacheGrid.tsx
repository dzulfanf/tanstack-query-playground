import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { fetchPokemonList, fetchPokemon } from '@/shared/services/pokemon-api'
import { LoadingSkeleton } from '@/features/pokemon/LoadingSkeleton'
import { ErrorState } from '@/features/pokemon/ErrorState'
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

export function PokemonCacheGrid() {
  const listQuery = useQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: () => fetchPokemonList(20, 0),
  })

  const detailQueries = useQuery({
    queryKey: ['pokemon', 'details', listQuery.data?.results.map((p) => p.name)],
    queryFn: async () => {
      const names = listQuery.data!.results.map((p) => p.name)
      return Promise.all(names.map((name) => fetchPokemon(name)))
    },
    enabled: !!listQuery.data,
  })

  if (listQuery.isPending || (listQuery.isSuccess && detailQueries.isPending)) {
    return <LoadingSkeleton />
  }
  if (listQuery.isError) {
    return <ErrorState error={listQuery.error as Error} onRetry={listQuery.refetch} />
  }
  if (detailQueries.isError) {
    return <ErrorState error={detailQueries.error as Error} onRetry={detailQueries.refetch} />
  }

  const pokemon: PokemonDetail[] = detailQueries.data ?? []

  return (
    <div className="grid grid-cols-4 gap-3">
      {pokemon.map((p) => (
        <Link
          key={p.name}
          to="/module/02/pokemon/$name"
          params={{ name: p.name }}
          className="group block rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-blue-200 hover:shadow-md"
        >
          <div className="flex h-20 items-center justify-center rounded-xl bg-gray-50">
            <img
              src={
                p.sprites.other['official-artwork'].front_default ??
                p.sprites.front_default ??
                ''
              }
              alt={p.name}
              className="h-16 w-16 object-contain transition group-hover:scale-110"
            />
          </div>
          <p className="mt-1 text-center text-xs text-gray-400">
            #{String(p.id).padStart(3, '0')}
          </p>
          <p className="text-center text-sm font-semibold capitalize text-gray-800">{p.name}</p>
          <div className="mt-1.5 flex flex-wrap justify-center gap-1">
            {p.types.map((t) => (
              <span
                key={t.type.name}
                className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                  TYPE_COLORS[t.type.name] ?? 'bg-gray-100 text-gray-600'
                }`}
              >
                {t.type.name}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </div>
  )
}
