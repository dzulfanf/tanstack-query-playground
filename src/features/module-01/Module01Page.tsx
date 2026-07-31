import { useState } from 'react'
import { PokemonGrid } from '@/features/pokemon/PokemonGrid'
import { PokemonBottomSheet } from '@/features/pokemon/PokemonBottomSheet'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import { EngineeringInsight } from '@/features/module-01/panels/EngineeringInsight'
import { VisualDiagram } from '@/features/module-01/panels/VisualDiagram'
import { SourceCodePanel } from '@/features/module-01/panels/SourceCodePanel'
import { ModuleSummary } from '@/features/module-01/panels/ModuleSummary'
import { LearningTabs } from '@/shared/components/LearningTabs'
import type { PokemonDetail } from '@/shared/types/pokemon'

const TABS = [
  { value: 'inspector', label: 'Insp', content: <QueryInspector /> },
  { value: 'activity', label: 'Act', content: <QueryActivity /> },
  { value: 'insight', label: 'Insight', content: <EngineeringInsight /> },
  { value: 'diagram', label: 'Diag', content: <VisualDiagram /> },
  { value: 'code', label: 'Code', content: <SourceCodePanel /> },
]

export function Module01Page() {
  const [selected, setSelected] = useState<PokemonDetail | null>(null)

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Module 01 — Query Basics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Click any Pokémon to select it. Watch the Inspector and Activity panels update live.
          </p>
        </div>
        <PokemonGrid onSelect={setSelected} />
        <ModuleSummary />
      </div>

      {selected && <PokemonBottomSheet pokemon={selected} onClose={() => setSelected(null)} />}

      <aside className="w-full lg:w-80 lg:shrink-0">
        {selected && (
          <div className="hidden lg:block mb-4 rounded-2xl glass-panel p-4 text-center">
            <img
              src={
                selected.sprites.other['official-artwork'].front_default ??
                selected.sprites.front_default ??
                ''
              }
              alt={selected.name}
              loading="eager"
              className="mx-auto h-28 w-28"
            />
            <p className="mt-2 text-lg font-bold capitalize text-gray-900">{selected.name}</p>
            <p className="text-sm text-gray-400">#{String(selected.id).padStart(3, '0')}</p>
          </div>
        )}
        <LearningTabs tabs={TABS} defaultValue="inspector" />
      </aside>
    </div>
  )
}
