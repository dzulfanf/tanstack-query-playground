import type { PokemonListResponse, PokemonDetail } from '@/shared/types/pokemon'

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
