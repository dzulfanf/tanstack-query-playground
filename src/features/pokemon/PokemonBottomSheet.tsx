import { X } from 'lucide-react'
import type { PokemonDetail } from '@/shared/types/pokemon'
import { PokemonDetailCard } from '@/features/pokemon/PokemonDetailCard'

interface Props {
  pokemon: PokemonDetail
  onClose: () => void
}

export function PokemonBottomSheet({ pokemon, onClose }: Props) {
  return (
    <div className="lg:hidden fixed inset-0 z-40 flex items-end">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full rounded-t-2xl bg-white/60 backdrop-blur-[20px] border border-white/60 shadow-xl animate-slide-up max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 z-10 rounded-full p-1.5 text-gray-400 hover:bg-white/40 transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <PokemonDetailCard pokemon={pokemon} size="full" />
      </div>
    </div>
  )
}
