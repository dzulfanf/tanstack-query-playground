import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchPokemonList, fetchPokemon } from '@/shared/services/pokemon-api'
import { PokemonCard } from '@/features/pokemon/PokemonCard'
import { LoadingSkeleton } from '@/features/pokemon/LoadingSkeleton'
import { getTeam, addToTeam, removeFromTeam, delay } from './useFakeTeamServer'
import type { PokemonDetail } from '@/shared/types/pokemon'

export function TeamManager() {
  const queryClient = useQueryClient()
  const [simulateError, setSimulateError] = useState(false)
  const simulateErrorRef = useRef(simulateError)
  simulateErrorRef.current = simulateError

  const teamQuery = useQuery({
    queryKey: ['m08', 'team'],
    queryFn: async () => {
      await delay(200)
      return getTeam()
    },
  })

  const browseQuery = useQuery({
    queryKey: ['m08', 'browse'],
    queryFn: async () => {
      const list = await fetchPokemonList(20, 0)
      return Promise.all(list.results.map((p) => fetchPokemon(p.name)))
    },
  })

  const addMutation = useMutation({
    mutationFn: async (name: string) => {
      await delay(800)
      if (simulateErrorRef.current) throw new Error('Server rejected: team capacity reached')
      addToTeam(name)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['m08', 'team'] }),
  })

  const removeMutation = useMutation({
    mutationFn: async (name: string) => {
      await delay(600)
      if (simulateErrorRef.current) throw new Error('Server rejected: cannot remove last member')
      removeFromTeam(name)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['m08', 'team'] }),
  })

  const teamNames = teamQuery.data ?? []
  const browsePokemon = browseQuery.data ?? []

  return (
    <div className="space-y-6">
      {/* Error simulation toggle */}
      <div className="flex items-center justify-between rounded-2xl glass-panel px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">Simulate Server Error</p>
          <p className="text-xs text-gray-500">Next mutation will fail and roll back</p>
        </div>
        <button
          onClick={() => setSimulateError((v) => !v)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            simulateError ? 'bg-red-400' : 'bg-gray-200'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              simulateError ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* My Team panel */}
      <div className="rounded-2xl glass-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">🎒 My Team ({teamNames.length}/6)</h3>
          {teamQuery.isFetching && (
            <span className="text-xs text-blue-500 animate-pulse">Syncing…</span>
          )}
        </div>

        {(addMutation.isError || removeMutation.isError) && (
          <div className="mb-3 rounded-xl bg-red-50 border border-red-200/60 px-3 py-2 text-xs text-red-700">
            ⚠️ {(addMutation.error ?? removeMutation.error)?.message}
          </div>
        )}

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
            {browsePokemon.map((p: PokemonDetail) => (
              <div key={p.id} className="relative">
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
