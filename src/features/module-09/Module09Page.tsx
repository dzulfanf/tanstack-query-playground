import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { CacheSurgeryDemo } from '@/features/module-09/CacheSurgeryDemo'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import { EngineeringInsight09 } from '@/features/module-09/panels/EngineeringInsight09'
import { VisualDiagram09 } from '@/features/module-09/panels/VisualDiagram09'
import { SourceCodePanel09 } from '@/features/module-09/panels/SourceCodePanel09'
import { ModuleSummary09 } from '@/features/module-09/panels/ModuleSummary09'
import { LearningTabs } from '@/shared/components/LearningTabs'
import { resetTeam } from '@/features/module-08/useFakeTeamServer'

const TABS = [
  { value: 'inspector', label: 'Insp', content: <QueryInspector /> },
  { value: 'activity', label: 'Act', content: <QueryActivity /> },
  { value: 'insight', label: 'Insight', content: <EngineeringInsight09 /> },
  { value: 'diagram', label: 'Diag', content: <VisualDiagram09 /> },
  { value: 'code', label: 'Code', content: <SourceCodePanel09 /> },
]

export function Module09Page() {
  const queryClient = useQueryClient()

  useEffect(() => {
    resetTeam()
    void queryClient.invalidateQueries({ queryKey: ['m09', 'team'] })
    return () => {}
  }, [queryClient])

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Module 09 — Advanced Cache</h1>
          <p className="mt-1 text-sm text-gray-500">
            Toggle the strategy and add/remove team members. With{' '}
            <code className="text-xs bg-white/60 px-1 rounded">setQueryData</code> the team updates
            instantly. With{' '}
            <code className="text-xs bg-white/60 px-1 rounded">invalidateQueries</code> watch the
            Inspector show a refetch cycle.
          </p>
        </div>
        <CacheSurgeryDemo />
        <ModuleSummary09 />
      </div>

      <aside className="w-full lg:w-80 lg:shrink-0">
        <LearningTabs tabs={TABS} defaultValue="inspector" />
      </aside>
    </div>
  )
}
