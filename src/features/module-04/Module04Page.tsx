import { useState } from 'react'
import { PokemonRefetchGrid } from '@/features/module-04/PokemonRefetchGrid'
import { PokemonBottomSheet } from '@/features/pokemon/PokemonBottomSheet'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import { EngineeringInsight04 } from '@/features/module-04/panels/EngineeringInsight04'
import { VisualDiagram04 } from '@/features/module-04/panels/VisualDiagram04'
import { SourceCodePanel04 } from '@/features/module-04/panels/SourceCodePanel04'
import { ModuleSummary04 } from '@/features/module-04/panels/ModuleSummary04'
import { LearningTabs } from '@/shared/components/LearningTabs'
import type { PokemonDetail } from '@/shared/types/pokemon'

const TABS = [
  { value: 'inspector', label: 'Insp', content: <QueryInspector /> },
  { value: 'activity', label: 'Act', content: <QueryActivity /> },
  { value: 'insight', label: 'Insight', content: <EngineeringInsight04 /> },
  { value: 'diagram', label: 'Diag', content: <VisualDiagram04 /> },
  { value: 'code', label: 'Code', content: <SourceCodePanel04 /> },
]

export function Module04Page() {
  const [selected, setSelected] = useState<PokemonDetail | null>(null)

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Module 04 — Background Fetching</h1>
          <p className="mt-1 text-sm text-gray-500">
            Change staleTime or click "Refetch Now" — watch the yellow banner appear while the grid stays visible.
          </p>
        </div>
        <PokemonRefetchGrid onSelect={setSelected} />
        <ModuleSummary04 />
      </div>

      {selected && <PokemonBottomSheet pokemon={selected} onClose={() => setSelected(null)} />}

      <aside className="w-full lg:w-80 lg:shrink-0">
        <LearningTabs tabs={TABS} defaultValue="inspector" />
      </aside>
    </div>
  )
}
