import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PokemonCacheGrid } from '@/features/module-02/PokemonCacheGrid'
import { ModuleSummary02 } from '@/features/module-02/panels/ModuleSummary02'
import { EngineeringInsight02 } from '@/features/module-02/panels/EngineeringInsight02'
import { VisualDiagram02 } from '@/features/module-02/panels/VisualDiagram02'
import { SourceCodePanel02 } from '@/features/module-02/panels/SourceCodePanel02'
import { QueryInspector } from '@/features/inspector/QueryInspector'
import { QueryActivity } from '@/features/activity/QueryActivity'

export function Module02Page() {
  return (
    <div className="flex gap-6">
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
      <aside className="w-80 shrink-0">
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
          <TabsContent value="insight"><EngineeringInsight02 /></TabsContent>
          <TabsContent value="diagram"><VisualDiagram02 /></TabsContent>
          <TabsContent value="code"><SourceCodePanel02 /></TabsContent>
        </Tabs>
      </aside>
    </div>
  )
}
