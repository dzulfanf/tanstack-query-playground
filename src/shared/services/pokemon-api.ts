import type { PokemonListResponse, PokemonDetail, PokemonSpecies, EvolutionChain } from '@/shared/types/pokemon'

const BASE_URL = 'https://pokeapi.co/api/v2'

export async function fetchPokemonList(
  limit = 20,
  offset = 0,
): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
  if (!res.ok) throw new Error(`Failed to fetch pokemon list: ${res.status}`)
  return res.json()
}

export async function fetchPokemon(idOrName: string | number): Promise<PokemonDetail> {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`)
  if (!res.ok) throw new Error(`Failed to fetch pokemon ${idOrName}: ${res.status}`)
  return res.json()
}

export async function searchPokemon(term: string): Promise<PokemonDetail[]> {
  if (!term.trim()) return []
  const res = await fetch(`${BASE_URL}/pokemon?limit=1302&offset=0`)
  if (!res.ok) throw new Error(`Failed to search pokemon: ${res.status}`)
  const list: PokemonListResponse = await res.json()
  const matches = list.results
    .filter((p) => p.name.includes(term.toLowerCase().trim()))
    .slice(0, 4)
  return Promise.all(matches.map((p) => fetchPokemon(p.name)))
}

export async function fetchPokemonSpecies(name: string): Promise<PokemonSpecies> {
  const res = await fetch(`${BASE_URL}/pokemon-species/${name}`)
  if (!res.ok) throw new Error(`Failed to fetch species ${name}: ${res.status}`)
  return res.json()
}

export async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch evolution chain: ${res.status}`)
  return res.json()
}
