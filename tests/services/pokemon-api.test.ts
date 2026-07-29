import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchPokemonList, fetchPokemon } from '@/shared/services/pokemon-api'

const mockListResponse = {
  count: 1302,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
}

const mockPokemonDetail = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  base_experience: 112,
  types: [{ slot: 1, type: { name: 'electric', url: '' } }],
  stats: [{ base_stat: 35, stat: { name: 'hp', url: '' } }],
  abilities: [{ ability: { name: 'static', url: '' }, is_hidden: false, slot: 1 }],
  sprites: {
    front_default: 'https://example.com/pikachu.png',
    other: { 'official-artwork': { front_default: 'https://example.com/pikachu-art.png' } },
  },
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

describe('fetchPokemonList', () => {
  it('fetches the list with default limit of 20', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockListResponse,
    } as Response)

    const result = await fetchPokemonList()

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0')
    expect(result.results).toHaveLength(2)
    expect(result.count).toBe(1302)
  })

  it('accepts custom limit and offset', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockListResponse,
    } as Response)

    await fetchPokemonList(10, 40)

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=10&offset=40')
  })

  it('throws on non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    await expect(fetchPokemonList()).rejects.toThrow('Failed to fetch pokemon list: 500')
  })
})

describe('fetchPokemon', () => {
  it('fetches by name', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemonDetail,
    } as Response)

    const result = await fetchPokemon('pikachu')

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu')
    expect(result.id).toBe(25)
    expect(result.name).toBe('pikachu')
  })

  it('fetches by numeric id', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemonDetail,
    } as Response)

    await fetchPokemon(25)

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25')
  })

  it('throws on 404', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    await expect(fetchPokemon('notapokemon')).rejects.toThrow('Failed to fetch pokemon notapokemon: 404')
  })
})
