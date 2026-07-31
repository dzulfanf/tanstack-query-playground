import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLearningMode } from '@/shared/hooks/use-learning-mode'

interface Tab {
  value: string
  label: string
  content: React.ReactNode
}

interface Props {
  tabs: Tab[]
  defaultValue: string
}

const PULSE_TABS = new Set(['inspector', 'activity'])

export function LearningTabs({ tabs, defaultValue }: Props) {
  const { pulseTabs } = useLearningMode()

  function getPulse(value: string) {
    if (!PULSE_TABS.has(value)) return false
    if (value === 'inspector') return pulseTabs.inspector
    if (value === 'activity') return pulseTabs.activity
    return false
  }

  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList className="w-full grid mb-4" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={`text-xs rounded-md transition-all ${getPulse(tab.value) ? 'tab-pulse' : ''}`}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
