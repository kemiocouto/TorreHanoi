import { Disc } from '@/hooks/useHanoiGame';
import { cn } from '@/lib/utils';

interface RodProps {
  discs: Disc[];
  rodIndex: number;
  selectedRod: number | null;
  onRodClick: (rodIndex: number) => void;
  maxDiscs: number;
}

export const Rod = ({
  discs,
  rodIndex,
  selectedRod,
  onRodClick,
  maxDiscs,
}: RodProps) => {
  const isSelected = selectedRod === rodIndex;
  const hasDiscs = discs.length > 0;
  const topDiscId = hasDiscs ? discs[discs.length - 1].id : null;
  const isTopDiscSelected = isSelected && hasDiscs && topDiscId !== null;

  return (
    <div
      className="flex flex-col items-center justify-end h-80 w-32 cursor-pointer group relative"
      onClick={() => onRodClick(rodIndex)}
    >
      {/* Rod Base (behind everything) */}
      <div className="absolute bottom-12 w-1 h-48 bg-blue-900 rounded-sm shadow-md z-0" />

      {/* Discs Stack - rendered on top of rod */}
      <div className="relative w-full flex flex-col items-center justify-end h-64 gap-0 z-10">
        {/* Renderizar discos en orden inverso para que aparezcan de abajo hacia arriba */}
        {discs
          .slice()
          .reverse()
          .map((disc, index) => {
            const maxSize = maxDiscs;
            const widthPercent = (disc.size / maxSize) * 100;
            const lightness = 100 - (disc.size / maxSize) * 40;
            const discColor = `hsl(217, 91%, ${lightness}%)`;
            const isThisDiscSelected = isTopDiscSelected && disc.id === topDiscId;

            return (
              <div
                key={disc.id}
                className={cn(
                  'rounded-full transition-all duration-300 ease-out shadow-md hover:shadow-lg hover:scale-110 cursor-pointer',
                  isThisDiscSelected && 'ring-2 ring-offset-2 ring-blue-500 scale-105'
                )}
                style={{
                  width: `${widthPercent}%`,
                  height: '2.5rem',
                  backgroundColor: discColor,
                  minWidth: '3rem',
                }}
              />
            );
          })}
      </div>

      {/* Base Platform */}
      <div className="w-40 h-2 bg-gray-300 rounded-full shadow-sm z-5" />
    </div>
  );
};
