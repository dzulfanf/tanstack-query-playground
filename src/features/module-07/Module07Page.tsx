import { useState } from 'react'
import { PokemonEvolutionChain } from '@/features/module-07/PokemonEvolutionChain'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import { EngineeringInsight07 } from '@/features/module-07/panels/EngineeringInsight07'
import { VisualDiagram07 } from '@/features/module-07/panels/VisualDiagram07'
import { SourceCodePanel07 } from '@/features/module-07/panels/SourceCodePanel07'
import { ModuleSummary07 } from '@/features/module-07/panels/ModuleSummary07'
import { LearningTabs } from '@/shared/components/LearningTabs'

const TABS = [
  { value: 'inspector', label: 'Insp', content: <QueryInspector /> },
  { value: 'activity', label: 'Act', content: <QueryActivity /> },
  { value: 'insight', label: 'Insight', content: <EngineeringInsight07 /> },
  { value: 'diagram', label: 'Diag', content: <VisualDiagram07 /> },
  { value: 'code', label: 'Code', content: <SourceCodePanel07 /> },
]

export function Module07Page() {
  const [selected, setSelected] = useState('bulbasaur')

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Module 07 — Dependent Query</h1>
          <p className="mt-1 text-sm text-gray-500">
            Select a starter Pokémon. Watch Query 1 fire, then Query 2 activate automatically once
            the evolution URL is available.
          </p>
        </div>
        <PokemonEvolutionChain selected={selected} onSelect={setSelected} />
        <ModuleSummary07 />
      </div>

      <aside className="w-full lg:w-80 lg:shrink-0">
        <LearningTabs tabs={TABS} defaultValue="inspector" />
      </aside>
    </div>
  )
}
