import { PokemonInfiniteGrid } from '@/features/module-05/PokemonInfiniteGrid'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import { EngineeringInsight05 } from '@/features/module-05/panels/EngineeringInsight05'
import { VisualDiagram05 } from '@/features/module-05/panels/VisualDiagram05'
import { SourceCodePanel05 } from '@/features/module-05/panels/SourceCodePanel05'
import { ModuleSummary05 } from '@/features/module-05/panels/ModuleSummary05'
import { LearningTabs } from '@/shared/components/LearningTabs'

const TABS = [
  { value: 'inspector', label: 'Insp', content: <QueryInspector /> },
  { value: 'activity', label: 'Act', content: <QueryActivity /> },
  { value: 'insight', label: 'Insight', content: <EngineeringInsight05 /> },
  { value: 'diagram', label: 'Diag', content: <VisualDiagram05 /> },
  { value: 'code', label: 'Code', content: <SourceCodePanel05 /> },
]

export function Module05Page() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Module 05 — Infinite Query</h1>
          <p className="mt-1 text-sm text-gray-500">
            Click "Load More" to fetch the next 20 Pokémon. Watch the Inspector — each click adds a new item to <code className="text-xs bg-white/60 px-1 rounded">pages[]</code>.
          </p>
        </div>
        <PokemonInfiniteGrid />
        <ModuleSummary05 />
      </div>

      <aside className="w-full lg:w-80 lg:shrink-0">
        <LearningTabs tabs={TABS} defaultValue="inspector" />
      </aside>
    </div>
  )
}
