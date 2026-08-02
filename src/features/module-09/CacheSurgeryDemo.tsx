import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchPokemonList, fetchPokemon } from '@/shared/services/pokemon-api'
import { PokemonCard } from '@/features/pokemon/PokemonCard'
import { LoadingSkeleton } from '@/features/pokemon/LoadingSkeleton'
import { getTeam, addToTeam, removeFromTeam, delay } from '@/features/module-08/useFakeTeamServer'

type Strategy = 'setQueryData' | 'invalidateQueries'

export function CacheSurgeryDemo() {
  const queryClient = useQueryClient()
  const [strategy, setStrategy] = useState<Strategy>('setQueryData')
  const [lastUpdate, setLastUpdate] = useState<{ via: Strategy; time: string } | null>(null)

  const teamQuery = useQuery({
    queryKey: ['m09', 'team'],
    queryFn: async () => {
      await delay(300)
      return getTeam()
    },
  })

  const browseQuery = useQuery({
    queryKey: ['m09', 'browse'],
    queryFn: async () => {
      const list = await fetchPokemonList(20, 0)
      return Promise.all(list.results.map((p) => fetchPokemon(p.name)))
    },
  })

  const addMutation = useMutation({
    mutationFn: async (name: string) => {
      await delay(600)
      addToTeam(name)
      return getTeam()
    },
    onSuccess: (newTeam) => {
      if (strategy === 'setQueryData') {
        queryClient.setQueryData(['m09', 'team'], newTeam)
      } else {
        void queryClient.invalidateQueries({ queryKey: ['m09', 'team'] })
      }
      setLastUpdate({ via: strategy, time: new Date().toLocaleTimeString() })
    },
  })

  const removeMutation = useMutation({
    mutationFn: async (name: string) => {
      await delay(500)
      removeFromTeam(name)
      return getTeam()
    },
    onSuccess: (newTeam) => {
      if (strategy === 'setQueryData') {
        queryClient.setQueryData(['m09', 'team'], newTeam)
      } else {
        void queryClient.invalidateQueries({ queryKey: ['m09', 'team'] })
      }
      setLastUpdate({ via: strategy, time: new Date().toLocaleTimeString() })
    },
  })

  const teamNames = teamQuery.data ?? []
  const browsePokemon = browseQuery.data ?? []

  return (
    <div className="space-y-6">
      {/* Strategy toggle */}
      <div className="rounded-2xl glass-panel p-4">
        <p className="mb-3 text-sm font-bold text-gray-900">Cache Update Strategy</p>
        <div className="flex gap-2">
          <button
            onClick={() => setStrategy('setQueryData')}
            className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              strategy === 'setQueryData'
                ? 'bg-green-500 text-white shadow-sm'
                : 'bg-white/40 text-gray-600 hover:bg-white/60'
            }`}
          >
            <div className="font-mono text-xs mb-0.5">setQueryData</div>
            <div className="text-xs font-normal opacity-80">Direct cache write · no refetch</div>
          </button>
          <button
            onClick={() => setStrategy('invalidateQueries')}
            className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              strategy === 'invalidateQueries'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-white/40 text-gray-600 hover:bg-white/60'
            }`}
          >
            <div className="font-mono text-xs mb-0.5">invalidateQueries</div>
            <div className="text-xs font-normal opacity-80">Mark stale · triggers refetch</div>
          </button>
        </div>

        {lastUpdate && (
          <div className={`mt-3 rounded-xl px-3 py-2 text-xs font-medium ${
            lastUpdate.via === 'setQueryData'
              ? 'bg-green-50 text-green-700 border border-green-200/60'
              : 'bg-blue-50 text-blue-700 border border-blue-200/60'
          }`}>
            {lastUpdate.via === 'setQueryData'
              ? `⚡ Updated via setQueryData at ${lastUpdate.time} — no network call`
              : `🔄 Updated via invalidation + refetch at ${lastUpdate.time}`}
          </div>
        )}
      </div>

      {/* My Team panel */}
      <div className="rounded-2xl glass-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">🎒 My Team ({teamNames.length}/6)</h3>
          {teamQuery.isFetching && (
            <span className="text-xs text-blue-500 animate-pulse">🔄 Refetching…</span>
          )}
          {!teamQuery.isFetching && strategy === 'setQueryData' && teamNames.length > 0 && (
            <span className="text-xs text-green-600">⚡ No refetch needed</span>
          )}
        </div>

        {teamNames.length === 0 ? (
          <p className="text-sm text-gray-400">No Pokémon on team yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {teamNames.map((name) => (
              <div key={name} className="flex items-center gap-1.5 rounded-full bg-white/50 px-3 py-1.5">
                <span className="text-sm font-medium capitalize text-gray-800">{name}</span>
                <button
                  onClick={() => removeMutation.mutate(name)}
                  disabled={removeMutation.isPending}
                  className="text-gray-400 hover:text-red-500 transition disabled:opacity-40"
                >
                  {removeMutation.isPending && removeMutation.variables === name ? (
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                  ) : (
                    '×'
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Browse panel */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-900">Browse Pokémon</h3>
        {browseQuery.isPending ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {browsePokemon.map((p) => (
              <div key={p.id}>
                <PokemonCard pokemon={p} />
                <button
                  onClick={() => addMutation.mutate(p.name)}
                  disabled={addMutation.isPending || teamNames.includes(p.name)}
                  className={`mt-1 w-full rounded-xl px-2 py-1 text-xs font-semibold transition ${
                    teamNames.includes(p.name)
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : addMutation.isPending && addMutation.variables === p.name
                      ? 'bg-blue-100 text-blue-500 cursor-wait'
                      : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
                  }`}
                >
                  {teamNames.includes(p.name)
                    ? '✓ On Team'
                    : addMutation.isPending && addMutation.variables === p.name
                    ? 'Adding…'
                    : '+ Add to Team'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
