import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchPokemon } from '@/shared/services/pokemon-api'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import { LoadingSkeleton } from '@/features/pokemon/LoadingSkeleton'
import { ErrorState } from '@/features/pokemon/ErrorState'
import { EngineeringInsight02 } from '@/features/module-02/panels/EngineeringInsight02'
import { VisualDiagram02 } from '@/features/module-02/panels/VisualDiagram02'
import { SourceCodePanel02 } from '@/features/module-02/panels/SourceCodePanel02'
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

export function PokemonDetailPage() {
  const { name } = useParams({ from: '/module/02/pokemon/$name' })
  const queryClient = useQueryClient()

  // Runs synchronously on first render, before useQuery fires any fetch.
  // This is the only accurate moment to check whether data is already cached.
  const [cacheStatus] = useState<'hit' | 'miss'>(() => {
    const state = queryClient.getQueryState<PokemonDetail>(['pokemon', 'detail', name])
    return state?.data !== undefined ? 'hit' : 'miss'
  })

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['pokemon', 'detail', name],
    queryFn: () => fetchPokemon(name),
  })

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 min-w-0">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Link
            to="/module/02"
            className="rounded-full bg-white/30 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white/50"
          >
            ← Back to list
          </Link>
          <span
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              cacheStatus === 'hit'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {cacheStatus === 'hit' ? '✅ Cache HIT' : '🌐 Cache MISS'}
          </span>
          <span className="text-sm text-gray-500">
            {cacheStatus === 'hit'
              ? 'Data loaded instantly from Query Cache — no network request'
              : 'Data fetched from network and stored in cache'}
          </span>
        </div>

        {isPending && cacheStatus === 'miss' && <LoadingSkeleton />}
        {isError && error && (
          <ErrorState error={error as Error} onRetry={refetch} />
        )}

        {data && (
          <div className="rounded-2xl glass-panel p-6 sm:p-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
              <img
                src={
                  data.sprites.other['official-artwork'].front_default ??
                  data.sprites.front_default ??
                  ''
                }
                alt={data.name}
                className="h-40 w-40 object-contain"
              />
              <div className="text-center sm:text-left">
                <p className="text-3xl font-bold capitalize text-gray-900">{data.name}</p>
                <p className="text-gray-400">#{String(data.id).padStart(3, '0')}</p>
                <div className="mt-3 flex justify-center gap-2 sm:justify-start">
                  {data.types.map((t) => (
                    <span
                      key={t.type.name}
                      className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
                        TYPE_COLORS[t.type.name] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {t.type.name}
                    </span>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {data.stats.slice(0, 4).map((s) => (
                    <div key={s.stat.name}>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400 capitalize">
                        {s.stat.name.replace('-', ' ')}
                      </p>
                      <p className="text-lg font-bold text-gray-800">{s.base_stat}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-amber-200/40 bg-amber-100/30 backdrop-blur-[12px] p-4">
          <p className="text-sm font-semibold text-amber-800">Try the Cache Demo</p>
          <p className="mt-1 text-sm text-amber-700">
            Click <strong>← Back to list</strong> and click this Pokémon again. The badge will
            switch to <strong>✅ Cache HIT</strong> — no network request, instant render.
          </p>
        </div>
      </div>

      <aside className="w-full lg:w-80 lg:shrink-0">
        <Tabs defaultValue="inspector">
          <TabsList className="w-full grid grid-cols-3 mb-4 sm:grid-cols-5">
            <TabsTrigger value="inspector" className="text-xs">
              <span className="sm:hidden">Insp</span>
              <span className="hidden sm:inline">Inspector</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">
              <span className="sm:hidden">Act</span>
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="insight" className="text-xs">
              <span className="sm:hidden">Ins</span>
              <span className="hidden sm:inline">Insight</span>
            </TabsTrigger>
            <TabsTrigger value="diagram" className="text-xs">
              <span className="sm:hidden">Diag</span>
              <span className="hidden sm:inline">Diagram</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="text-xs">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="inspector">
            <QueryInspector queryKey={['pokemon', 'detail', name]} />
          </TabsContent>
          <TabsContent value="activity">
            <QueryActivity />
          </TabsContent>
          <TabsContent value="insight">
            <EngineeringInsight02 />
          </TabsContent>
          <TabsContent value="diagram">
            <VisualDiagram02 cacheStatus={cacheStatus} />
          </TabsContent>
          <TabsContent value="code">
            <SourceCodePanel02 />
          </TabsContent>
        </Tabs>
      </aside>
    </div>
  )
}

