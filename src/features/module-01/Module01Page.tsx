import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PokemonGrid } from '@/features/pokemon/PokemonGrid'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'
import { EngineeringInsight } from '@/features/module-01/panels/EngineeringInsight'
import { VisualDiagram } from '@/features/module-01/panels/VisualDiagram'
import { SourceCodePanel } from '@/features/module-01/panels/SourceCodePanel'
import { ModuleSummary } from '@/features/module-01/panels/ModuleSummary'
import type { PokemonDetail } from '@/shared/types/pokemon'

export function Module01Page() {
  const [selected, setSelected] = useState<PokemonDetail | null>(null)

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Left: Playground */}
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

      {/* Right: Educational panels */}
      <aside className="w-full lg:w-80 lg:shrink-0">
        {selected && (
          <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center">
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

        <Tabs defaultValue="inspector">
          <TabsList className="w-full grid grid-cols-3 mb-4 sm:grid-cols-5">
            <TabsTrigger value="inspector" className="text-xs">
              <span className="sm:hidden">Insp</span>
              <span className="hidden sm:inline">Inspector</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs">
              <span className="sm:hidden">Act</span>
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="insight" className="text-xs">
              <span className="sm:hidden">Ins</span>
              <span className="hidden sm:inline">Insight</span>
            </TabsTrigger>
            <TabsTrigger value="diagram" className="text-xs">
              <span className="sm:hidden">Diag</span>
              <span className="hidden sm:inline">Diagram</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="text-xs">Code</TabsTrigger>
          </TabsList>

          <TabsContent value="inspector">
            <QueryInspector />
          </TabsContent>
          <TabsContent value="activity">
            <QueryActivity />
          </TabsContent>
          <TabsContent value="insight">
            <EngineeringInsight />
          </TabsContent>
          <TabsContent value="diagram">
            <VisualDiagram />
          </TabsContent>
          <TabsContent value="code">
            <SourceCodePanel />
          </TabsContent>
        </Tabs>
      </aside>
    </div>
  )
}
