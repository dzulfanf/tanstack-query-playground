import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchPokemon } from '@/shared/services/pokemon-api'
import { PokemonPrefetchGrid } from '@/features/module-06/PokemonPrefetchGrid'
import { PokemonCard } from '@/features/pokemon/PokemonCard'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import { EngineeringInsight06 } from '@/features/module-06/panels/EngineeringInsight06'
import { VisualDiagram06 } from '@/features/module-06/panels/VisualDiagram06'
import { SourceCodePanel06 } from '@/features/module-06/panels/SourceCodePanel06'
import { ModuleSummary06 } from '@/features/module-06/panels/ModuleSummary06'
import { LearningTabs } from '@/shared/components/LearningTabs'

function SelectedPokemonDetail({ name }: { name: string }) {
  const { data, isPending } = useQuery({
    queryKey: ['m06', 'detail', name],    // same key as prefetchQuery — cache hit if hovered
    queryFn: () => fetchPokemon(name),
  })

  return (
    <div className="mt-4 rounded-2xl glass-panel p-4">
      <p className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Selected — <code className="font-mono text-blue-600">{`['m06', 'detail', '${name}']`}</code>
      </p>
      {isPending ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-400" />
          Loading… (card was not hovered — no cache)
        </div>
      ) : data ? (
        <div className="max-w-[160px]">
          <PokemonCard pokemon={data} />
        </div>
      ) : null}
    </div>
  )
}

const TABS = [
  { value: 'inspector', label: 'Insp', content: <QueryInspector /> },
  { value: 'activity', label: 'Act', content: <QueryActivity /> },
  { value: 'insight', label: 'Insight', content: <EngineeringInsight06 /> },
  { value: 'diagram', label: 'Diag', content: <VisualDiagram06 /> },
  { value: 'code', label: 'Code', content: <SourceCodePanel06 /> },
]

export function Module06Page() {
  const [selectedName, setSelectedName] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Module 06 — Prefetch</h1>
          <p className="mt-1 text-sm text-gray-500">
            Hover a card to prefetch, then click it — the detail appears instantly. Click a
            card you <em>didn't</em> hover — watch the loading spinner appear instead.
          </p>
        </div>
        <PokemonPrefetchGrid onSelect={setSelectedName} />
        {selectedName && <SelectedPokemonDetail name={selectedName} />}
        <ModuleSummary06 />
      </div>

      <aside className="w-full lg:w-80 lg:shrink-0">
        <LearningTabs tabs={TABS} defaultValue="inspector" />
      </aside>
    </div>
  )
}
