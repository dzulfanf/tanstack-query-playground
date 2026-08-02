import { TeamManager } from '@/features/module-08/TeamManager'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import { EngineeringInsight08 } from '@/features/module-08/panels/EngineeringInsight08'
import { VisualDiagram08 } from '@/features/module-08/panels/VisualDiagram08'
import { SourceCodePanel08 } from '@/features/module-08/panels/SourceCodePanel08'
import { ModuleSummary08 } from '@/features/module-08/panels/ModuleSummary08'
import { LearningTabs } from '@/shared/components/LearningTabs'

const TABS = [
  { value: 'inspector', label: 'Insp', content: <QueryInspector /> },
  { value: 'activity', label: 'Act', content: <QueryActivity /> },
  { value: 'insight', label: 'Insight', content: <EngineeringInsight08 /> },
  { value: 'diagram', label: 'Diag', content: <VisualDiagram08 /> },
  { value: 'code', label: 'Code', content: <SourceCodePanel08 /> },
]

export function Module08Page() {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Module 08 — Mutations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add or remove Pokémon from your team. Watch <code className="text-xs bg-white/60 px-1 rounded">isPending</code> disable
            the button, then <code className="text-xs bg-white/60 px-1 rounded">onSuccess</code> trigger a team refetch.
            Toggle "Simulate Error" to see a failed mutation leave the team unchanged.
          </p>
        </div>
        <TeamManager />
        <ModuleSummary08 />
      </div>

      <aside className="w-full lg:w-80 lg:shrink-0">
        <LearningTabs tabs={TABS} defaultValue="inspector" />
      </aside>
    </div>
  )
}
