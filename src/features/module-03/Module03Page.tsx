import { useState } from 'react'
import { SearchResults } from '@/features/module-03/SearchResults'
import { PokemonBottomSheet } from '@/features/pokemon/PokemonBottomSheet'
import { PokemonDetailTabs } from '@/features/pokemon/PokemonDetailTabs'
import { ModuleSummary03 } from '@/features/module-03/panels/ModuleSummary03'
import { EngineeringInsight03 } from '@/features/module-03/panels/EngineeringInsight03'
import { VisualDiagram03 } from '@/features/module-03/panels/VisualDiagram03'
import { SourceCodePanel03 } from '@/features/module-03/panels/SourceCodePanel03'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import { LearningTabs } from '@/shared/components/LearningTabs'
import type { PokemonDetail } from '@/shared/types/pokemon'

const TABS = [
  { value: 'inspector', label: 'Insp', content: <QueryInspector /> },
  { value: 'activity', label: 'Act', content: <QueryActivity /> },
  { value: 'insight', label: 'Insight', content: <EngineeringInsight03 /> },
  { value: 'diagram', label: 'Diag', content: <VisualDiagram03 /> },
  { value: 'code', label: 'Code', content: <SourceCodePanel03 /> },
]

export function Module03Page() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<PokemonDetail | null>(null)

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Module 03 — Query Keys</h1>
          <p className="mt-1 text-sm text-gray-500">
            Type a Pokémon name. Watch the Diagram tab fill with cache entries. Type the same term again — instant result from cache.
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Try 'char', then 'bulb', then 'char' again"
          className="mb-4 w-full rounded-2xl glass-panel px-4 py-3 text-base sm:text-sm outline-none focus:border-blue-300/60 focus:ring-2 focus:ring-blue-100/40"
        />
        <SearchResults search={search} onSelect={setSelected} />
        <ModuleSummary03 />
      </div>

      {selected && <PokemonBottomSheet pokemon={selected} onClose={() => setSelected(null)} />}

      <aside className="w-full lg:w-80 lg:shrink-0">
        {selected && (
          <div className="hidden lg:block mb-4 rounded-2xl glass-panel">
            <PokemonDetailTabs pokemon={selected} size="compact" />
          </div>
        )}
        <LearningTabs tabs={TABS} defaultValue="inspector" />
      </aside>
    </div>
  )
}
