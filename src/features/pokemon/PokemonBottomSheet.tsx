import { X } from 'lucide-react'
import type { PokemonDetail } from '@/shared/types/pokemon'

interface Props {
  pokemon: PokemonDetail
  onClose: () => void
}

export function PokemonBottomSheet({ pokemon, onClose }: Props) {
  return (
    <div className="lg:hidden fixed inset-0 z-40 flex items-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full rounded-t-2xl bg-white p-6 shadow-xl animate-slide-up">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div className="text-center">
          <img
            src={
              pokemon.sprites.other['official-artwork'].front_default ??
              pokemon.sprites.front_default ??
              ''
            }
            alt={pokemon.name}
            className="mx-auto h-32 w-32"
          />
          <p className="mt-3 text-xl font-bold capitalize text-gray-900">{pokemon.name}</p>
          <p className="text-sm text-gray-400">#{String(pokemon.id).padStart(3, '0')}</p>
        </div>
      </div>
    </div>
  )
}
