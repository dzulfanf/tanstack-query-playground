import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchPokemonList, fetchPokemon, searchPokemon, fetchPokemonSpecies, fetchEvolutionChain } from '@/shared/services/pokemon-api'

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

const mockSpeciesResponse = {
  name: 'bulbasaur',
  flavor_text_entries: [
    { flavor_text: 'A strange seed was planted\non its back at birth.', language: { name: 'en' } },
  ],
  evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
}

const mockEvolutionChain = {
  id: 1,
  chain: {
    species: { name: 'bulbasaur' },
    evolves_to: [
      {
        species: { name: 'ivysaur' },
        evolves_to: [
          { species: { name: 'venusaur' }, evolves_to: [] },
        ],
      },
    ],
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

describe('searchPokemon', () => {
  it('returns empty array without fetching when term is empty', async () => {
    const result = await searchPokemon('')
    expect(result).toEqual([])
    expect(fetch).not.toHaveBeenCalled()
  })

  it('returns empty array without fetching when term is whitespace', async () => {
    const result = await searchPokemon('   ')
    expect(result).toEqual([])
    expect(fetch).not.toHaveBeenCalled()
  })

  it('fetches all names, filters by term, and returns first 4 details', async () => {
    const allNames = [
      { name: 'charmander', url: '' },
      { name: 'charmeleon', url: '' },
      { name: 'charizard', url: '' },
      { name: 'charjabug', url: '' },
      { name: 'pikachu', url: '' }, // does not contain 'char' — filtered out
    ]
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ count: 5, next: null, previous: null, results: allNames }),
      } as Response)
      .mockResolvedValue({
        ok: true,
        json: async () => mockPokemonDetail,
      } as Response)

    const result = await searchPokemon('char')

    expect(vi.mocked(fetch).mock.calls[0][0]).toBe(
      'https://pokeapi.co/api/v2/pokemon?limit=1302&offset=0',
    )
    expect(result).toHaveLength(4) // pikachu filtered out
  })

  it('limits results to 4 even when more than 4 names match', async () => {
    const manyMatches = Array.from({ length: 10 }, (_, i) => ({ name: `char${i}`, url: '' }))
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ count: 10, next: null, previous: null, results: manyMatches }),
      } as Response)
      .mockResolvedValue({ ok: true, json: async () => mockPokemonDetail } as Response)

    const result = await searchPokemon('char')

    expect(result).toHaveLength(4)
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(5) // 1 list + 4 details
  })

  it('throws on non-ok list response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 503 } as Response)
    await expect(searchPokemon('char')).rejects.toThrow('Failed to search pokemon: 503')
  })
})

describe('fetchPokemonSpecies', () => {
  it('fetches species by name and returns evolution_chain url', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSpeciesResponse,
    } as Response)

    const result = await fetchPokemonSpecies('bulbasaur')

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon-species/bulbasaur')
    expect(result.evolution_chain.url).toBe('https://pokeapi.co/api/v2/evolution-chain/1/')
  })

  it('throws on non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 404 } as Response)
    await expect(fetchPokemonSpecies('notaspecies')).rejects.toThrow(
      'Failed to fetch species notaspecies: 404',
    )
  })
})

describe('fetchEvolutionChain', () => {
  it('fetches chain by full URL', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvolutionChain,
    } as Response)

    const result = await fetchEvolutionChain('https://pokeapi.co/api/v2/evolution-chain/1/')

    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/evolution-chain/1/')
    expect(result.chain.species.name).toBe('bulbasaur')
    expect(result.chain.evolves_to[0].species.name).toBe('ivysaur')
  })

  it('throws on non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response)
    await expect(
      fetchEvolutionChain('https://pokeapi.co/api/v2/evolution-chain/1/'),
    ).rejects.toThrow('Failed to fetch evolution chain: 500')
  })
})
