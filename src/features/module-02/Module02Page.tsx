import { PokemonCacheGrid } from '@/features/module-02/PokemonCacheGrid'
import { ModuleSummary02 } from '@/features/module-02/panels/ModuleSummary02'
import { EngineeringInsight02 } from '@/features/module-02/panels/EngineeringInsight02'
import { VisualDiagram02 } from '@/features/module-02/panels/VisualDiagram02'
import { SourceCodePanel02 } from '@/features/module-02/panels/SourceCodePanel02'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import { LearningTabs } from '@/shared/components/LearningTabs'

const TABS = [
  { value: 'inspector', label: 'Insp', content: <QueryInspector /> },
  { value: 'activity', label: 'Act', content: <QueryActivity /> },
  { value: 'insight', label: 'Insight', content: <EngineeringInsight02 /> },
  { value: 'diagram', label: 'Diag', content: <VisualDiagram02 /> },
  { value: 'code', label: 'Code', content: <SourceCodePanel02 /> },
]

export function Module02Page() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Module 02 — Query Cache</h1>
          <p className="mt-1 text-sm text-gray-500">
            Click any Pokémon to visit its detail page. Navigate back and click the same one — watch the badge change from 🌐 Cache MISS to ✅ Cache HIT.
          </p>
        </div>
        <PokemonCacheGrid />
        <ModuleSummary02 />
      </div>
      <aside className="w-full lg:w-80 lg:shrink-0">
        <LearningTabs tabs={TABS} defaultValue="inspector" />
      </aside>
    </div>
  )
}
