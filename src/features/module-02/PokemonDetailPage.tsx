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
import { PokemonDetailCard } from '@/features/pokemon/PokemonDetailCard'

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
          <div className="rounded-2xl glass-panel">
            <PokemonDetailCard pokemon={data} size="full" />
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
          <TabsList className="w-full grid grid-cols-5 mb-4">
            <TabsTrigger value="inspector" className="text-xs">Insp</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Act</TabsTrigger>
            <TabsTrigger value="insight" className="text-xs">Insight</TabsTrigger>
            <TabsTrigger value="diagram" className="text-xs">Diag</TabsTrigger>
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

