import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SearchResults } from '@/features/module-03/SearchResults'
import { ModuleSummary03 } from '@/features/module-03/panels/ModuleSummary03'
import { EngineeringInsight03 } from '@/features/module-03/panels/EngineeringInsight03'
import { VisualDiagram03 } from '@/features/module-03/panels/VisualDiagram03'
import { SourceCodePanel03 } from '@/features/module-03/panels/SourceCodePanel03'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import type { PokemonDetail } from '@/shared/types/pokemon'

export function Module03Page() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<PokemonDetail | null>(null)

  return (
    <div className="flex gap-6">
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
          className="mb-4 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
        <SearchResults search={search} onSelect={setSelected} />
        <ModuleSummary03 />
      </div>

      <aside className="w-80 shrink-0">
        {selected && (
          <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center">
            <img
              src={
                selected.sprites.other['official-artwork'].front_default ??
                selected.sprites.front_default ??
                ''
              }
              alt={selected.name}
              className="mx-auto h-28 w-28"
            />
            <p className="mt-2 text-lg font-bold capitalize text-gray-900">{selected.name}</p>
            <p className="text-sm text-gray-400">#{String(selected.id).padStart(3, '0')}</p>
          </div>
        )}
        <Tabs defaultValue="inspector">
          <TabsList className="w-full grid grid-cols-5 mb-4">
            <TabsTrigger value="inspector" className="text-xs">Inspector</TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
            <TabsTrigger value="insight" className="text-xs">Insight</TabsTrigger>
            <TabsTrigger value="diagram" className="text-xs">Diagram</TabsTrigger>
            <TabsTrigger value="code" className="text-xs">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="inspector"><QueryInspector /></TabsContent>
          <TabsContent value="activity"><QueryActivity /></TabsContent>
          <TabsContent value="insight"><EngineeringInsight03 /></TabsContent>
          <TabsContent value="diagram"><VisualDiagram03 /></TabsContent>
          <TabsContent value="code"><SourceCodePanel03 /></TabsContent>
        </Tabs>
      </aside>
    </div>
  )
}
