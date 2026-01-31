import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useScoreboard } from '@/hooks/useScoreboard';
import { RotateCcw, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

interface VictoryModalProps {
  isOpen: boolean;
  moves: number;
  minimumMoves: number;
  difficulty: number;
  onPlayAgain: () => void;
  onExit: () => void;
}

export const VictoryModal = ({
  isOpen,
  moves,
  minimumMoves,
  difficulty,
  onPlayAgain,
  onExit,
}: VictoryModalProps) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number }>>([]);
  const { addScore } = useScoreboard();

  useEffect(() => {
    if (isOpen) {
      // Generar confeti
      const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setConfetti(confettiPieces);

      // Guardar la puntuación
      addScore(difficulty, moves, minimumMoves);
    }
  }, [isOpen, difficulty, moves, minimumMoves, addScore]);

  const efficiency = Math.round((minimumMoves / moves) * 100);
  const isPerfect = moves === minimumMoves;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md border-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-2xl">
        {/* DialogTitle for accessibility - visually hidden */}
        <DialogTitle className="sr-only">
          ¡Felicitaciones! Completaste el puzzle
        </DialogTitle>

        {/* Confeti animado */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{
                left: `${piece.left}%`,
                top: '-10px',
                animation: `fall 3s linear ${piece.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Contenido del modal */}
        <div className="text-center space-y-6 py-8">
          {/* Emojis festivos */}
          <div className="text-6xl space-x-2 flex justify-center animate-bounce">
            <span>🎉</span>
            <span>🏆</span>
            <span>🎉</span>
          </div>

          {/* Título */}
          <div>
            <h2 className="text-4xl font-bold text-blue-900 mb-2">
              ¡Felicitaciones!
            </h2>
            <p className="text-gray-600">
              ¡Completaste el puzzle exitosamente!
            </p>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-lg p-6 space-y-3 border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Dificultad:</span>
              <span className="font-bold text-blue-600">{difficulty} discos</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Movimientos realizados:</span>
              <span className="font-bold text-blue-600">{moves}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Movimientos mínimos:</span>
              <span className="font-bold text-green-600">{minimumMoves}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-gray-700">Eficiencia:</span>
              <span className={`font-bold text-lg ${isPerfect ? 'text-green-600' : 'text-orange-600'}`}>
                {efficiency}%
              </span>
            </div>
          </div>

          {/* Mensaje especial */}
          {isPerfect && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-semibold">
                ⭐ ¡Perfecto! Completaste con el número mínimo de movimientos.
              </p>
            </div>
          )}

          {efficiency >= 90 && !isPerfect && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-700 font-semibold">
                ✨ ¡Excelente desempeño! Casi alcanzas la solución óptima.
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={onPlayAgain}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Jugar de Nuevo
            </Button>
            <Button
              onClick={onExit}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-all duration-300 hover:bg-gray-50"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Estilos CSS para animación de confeti */}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </Dialog>
  );
};
