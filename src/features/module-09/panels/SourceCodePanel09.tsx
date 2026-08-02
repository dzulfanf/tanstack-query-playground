import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CODE = `type Strategy = 'setQueryData' | 'invalidateQueries'

const addMutation = useMutation({
  mutationFn: async (name: string) => {
    await delay(600)
    addToTeam(name)
    return getTeam()          // return new state to onSuccess
  },
  onSuccess: (newTeam) => {
    if (strategy === 'setQueryData') {
      // Direct cache write — no network call:
      queryClient.setQueryData(['m09', 'team'], newTeam)

    } else {
      // Mark stale → triggers background refetch:
      queryClient.invalidateQueries({ queryKey: ['m09', 'team'] })
    }
  },
})

// setQueryData: instant UI update, no spinner
// invalidateQueries: brief "Refetching…" indicator while query re-runs
// Watch the Inspector to see the difference`

export function SourceCodePanel09() {
  return (
    <div className="rounded-2xl glass-panel overflow-hidden">
      <div className="border-b border-white/25 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">💻 Source Code</h3>
      </div>
      <SyntaxHighlighter
        language="tsx"
        style={oneLight}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: '12px', background: 'rgba(255,255,255,0.3)' }}
        wrapLines
      >
        {CODE}
      </SyntaxHighlighter>
    </div>
  )
}
