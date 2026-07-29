import type { Query, QueryCacheNotifyEvent } from '@tanstack/react-query'

export interface QueryEvent {
  id: string
  timestamp: number
  type: QueryCacheNotifyEvent['type']
  queryKey: unknown[]
  status: Query['state']['status']
  fetchStatus: Query['state']['fetchStatus']
}

export function formatQueryKey(key: unknown[]): string {
  return JSON.stringify(key)
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
