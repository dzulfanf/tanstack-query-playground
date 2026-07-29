import { Button } from '@/components/ui/button'

interface Props {
  error: Error
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-100 bg-red-50 py-16 text-center">
      <span className="text-5xl">😵</span>
      <div>
        <p className="text-lg font-semibold text-red-700">Something went wrong</p>
        <p className="mt-1 text-sm text-red-500">{error.message}</p>
      </div>
      <Button onClick={onRetry} variant="outline" className="border-red-200 text-red-600 hover:bg-red-100">
        Try Again
      </Button>
    </div>
  )
}
