const _team: string[] = ['bulbasaur', 'charmander', 'squirtle']

export function getTeam(): string[] {
  return [..._team]
}

export function isOnTeam(name: string): boolean {
  return _team.includes(name)
}

export function addToTeam(name: string): void {
  if (!_team.includes(name)) _team.push(name)
}

export function removeFromTeam(name: string): void {
  const idx = _team.indexOf(name)
  if (idx !== -1) _team.splice(idx, 1)
}

export function resetTeam(): void {
  _team.length = 0
  _team.push('bulbasaur', 'charmander', 'squirtle')
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
