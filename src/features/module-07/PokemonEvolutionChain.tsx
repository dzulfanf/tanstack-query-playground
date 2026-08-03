import { useQuery } from '@tanstack/react-query'
import { fetchPokemonSpecies, fetchEvolutionChain } from '@/shared/services/pokemon-api'
import type { ChainLink } from '@/shared/types/pokemon'

const STARTERS = [
  { name: 'bulbasaur', label: 'Bulbasaur' },
  { name: 'charmander', label: 'Charmander' },
  { name: 'squirtle', label: 'Squirtle' },
  { name: 'chikorita', label: 'Chikorita' },
  { name: 'cyndaquil', label: 'Cyndaquil' },
  { name: 'totodile', label: 'Totodile' },
]

function flattenChain(link: ChainLink): string[] {
  const names: string[] = [link.species.name]
  if (link.evolves_to.length > 0) {
    names.push(...flattenChain(link.evolves_to[0]))
  }
  return names
}

interface Props {
  selected: string
  onSelect: (name: string) => void
}

export function PokemonEvolutionChain({ selected, onSelect }: Props) {
  const speciesQuery = useQuery({
    queryKey: ['m07', 'species', selected],
    queryFn: () => fetchPokemonSpecies(selected),
  })

  const evolutionUrl = speciesQuery.data?.evolution_chain.url

  const evolutionQuery = useQuery({
    queryKey: ['m07', 'evolution', evolutionUrl],
    queryFn: () => fetchEvolutionChain(evolutionUrl!),
    enabled: !!evolutionUrl,
  })

  const flavorText = speciesQuery.data?.flavor_text_entries
    .find((e) => e.language.name === 'en')
    ?.flavor_text.replace(/\f/g, ' ')

  const evolutionChain = evolutionQuery.data ? flattenChain(evolutionQuery.data.chain) : []

  return (
    <div className="space-y-4">
      {/* Starter picker */}
      <div className="flex flex-wrap gap-2">
        {STARTERS.map((s) => (
          <button
            key={s.name}
            onClick={() => onSelect(s.name)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition capitalize ${
              selected === s.name
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white/40 text-gray-700 hover:bg-white/60'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Step 1: Species */}
      <div className={`rounded-2xl glass-panel p-4 transition-opacity ${speciesQuery.isPending ? 'opacity-60' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`h-2 w-2 rounded-full ${speciesQuery.isPending ? 'bg-yellow-400 animate-pulse' : speciesQuery.isError ? 'bg-red-400' : 'bg-green-400'}`} />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Query 1 — Species Data
            <code className="ml-2 font-mono text-blue-600">{`['m07', 'species', '${selected}']`}</code>
          </p>
        </div>
        {speciesQuery.isPending && <p className="text-sm text-gray-400">Fetching species data…</p>}
        {speciesQuery.isError && <p className="text-sm text-red-500">Error loading species</p>}
        {speciesQuery.data && (
          <p className="text-sm text-gray-700 italic">"{flavorText}"</p>
        )}
      </div>

      {/* Step 2: Evolution chain */}
      <div className={`rounded-2xl glass-panel p-4 transition-opacity ${!evolutionUrl ? 'opacity-40' : evolutionQuery.isPending ? 'opacity-60' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`h-2 w-2 rounded-full ${!evolutionUrl ? 'bg-gray-300' : evolutionQuery.isPending ? 'bg-yellow-400 animate-pulse' : evolutionQuery.isError ? 'bg-red-400' : 'bg-green-400'}`} />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Query 2 — Evolution Chain
            {evolutionUrl
              ? <code className="ml-2 font-mono text-blue-600">{`['m07', 'evolution', url]`}</code>
              : <span className="ml-2 text-gray-400">(waiting for Query 1…)</span>
            }
          </p>
        </div>
        {!evolutionUrl && (
          <p className="text-sm text-gray-400">Dormant — needs evolution_chain.url from Query 1</p>
        )}
        {evolutionUrl && evolutionQuery.isPending && (
          <p className="text-sm text-gray-400">Fetching evolution chain…</p>
        )}
        {evolutionQuery.data && evolutionChain.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {evolutionChain.map((name, i) => (
              <div key={name} className="flex items-center gap-2">
                <span className="rounded-xl bg-white/50 px-3 py-1 text-sm font-semibold capitalize text-gray-800">
                  {name}
                </span>
                {i < evolutionChain.length - 1 && <span className="text-gray-400">→</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
