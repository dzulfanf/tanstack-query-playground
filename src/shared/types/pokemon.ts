export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export interface PokemonType {
  slot: number
  type: { name: string; url: string }
}

export interface PokemonStat {
  base_stat: number
  stat: { name: string; url: string }
}

export interface PokemonAbility {
  ability: { name: string; url: string }
  is_hidden: boolean
  slot: number
}

export interface PokemonSprites {
  front_default: string | null
  other: {
    'official-artwork': {
      front_default: string | null
    }
  }
}

export interface PokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  types: PokemonType[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  sprites: PokemonSprites
}

export interface PokemonSpecies {
  name: string
  flavor_text_entries: Array<{
    flavor_text: string
    language: { name: string }
  }>
  evolution_chain: { url: string }
}

export interface ChainLink {
  species: { name: string }
  evolves_to: ChainLink[]
}

export interface EvolutionChain {
  id: number
  chain: ChainLink
}
