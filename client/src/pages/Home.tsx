import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Rod } from '@/components/Rod';
import { VictoryModal } from '@/components/VictoryModal';
import { Scoreboard } from '@/components/Scoreboard';
import { useHanoiGame } from '@/hooks/useHanoiGame';
import { RotateCcw, Undo2, Zap, BarChart3 } from 'lucide-react';
import { useState } from 'react';

/**
 * Design Philosophy: Minimalist Geometric Modern
 * - Clean white background with subtle grid
 * - Deep blue color scheme (#1e40af) for primary elements
 * - Generous whitespace and asymmetric layout
 * - Smooth animations and clear visual hierarchy
 * - Geometric shapes: circles for discs, lines for rods
 */

export default function Home() {
  const { gameState, selectRod, resetGame, getMinimumMoves, undo } = useHanoiGame();
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);

  // Mostrar modal cuando el juego se complete
  if (gameState.isComplete && !showVictoryModal) {
    setShowVictoryModal(true);
  }

  const minimumMoves = getMinimumMoves();
  const efficiency = gameState.moves > 0 ? Math.round((minimumMoves / gameState.moves) * 100) : 0;

  const handlePlayAgain = () => {
    setShowVictoryModal(false);
    resetGame(gameState.difficulty);
  };

  const handleExit = () => {
    setShowVictoryModal(false);
    resetGame(3); // Reiniciar con 3 discos por defecto
  };

  // Desabilitar cliques en los postes cuando el juego está completo
  const handleRodClick = (rodIndex: number) => {
    if (!gameState.isComplete) {
      selectRod(rodIndex);
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{
      backgroundImage: 'linear-gradient(45deg, rgba(229, 231, 235, 0.05) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    }}>
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-blue-900 tracking-tight">
                Torre de Hanoi
              </h1>
              <p className="text-gray-600 mt-1">Clásico puzzle de lógica y estrategia</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-600">Movimientos</div>
                <div className="text-3xl font-bold text-blue-600">{gameState.moves}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowScoreboard(!showScoreboard)}
                className="gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Puntuaciones
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <Card className={`p-8 bg-white border-gray-200 shadow-sm transition-opacity duration-300 ${gameState.isComplete ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* Game Board with Rods and Controls */}
              <div className="relative">
                {/* Game Board with Rods */}
                <div className="flex justify-around items-end h-96 gap-8 mb-8">
                  {gameState.rods.map((discs, index) => (
                    <Rod
                      key={index}
                      discs={discs}
                      rodIndex={index}
                      selectedRod={gameState.selectedRod}
                      onRodClick={handleRodClick}
                      maxDiscs={gameState.difficulty}
                    />
                  ))}
                </div>

                {/* Controls positioned just above the rods */}
                <div className="flex gap-3 justify-center mt-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => undo()}
                    disabled={gameState.history.length === 0 || gameState.isComplete}
                  >
                    <Undo2 className="w-4 h-4" />
                    Deshacer
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      setShowVictoryModal(false);
                      resetGame(gameState.difficulty);
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reiniciar
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="pt-8 mt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  {gameState.isComplete
                    ? '¡Juego completado! Abre el modal de victoria para continuar.'
                    : gameState.selectedRod !== null
                      ? `Poste ${gameState.selectedRod + 1} seleccionado. Haz clic en otro poste para mover.`
                      : 'Haz clic en un poste para seleccionar un disco y luego haz clic en otro poste para moverlo.'}
                </p>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scoreboard or Stats */}
            {showScoreboard ? (
              <Scoreboard />
            ) : (
              <>
                {/* Stats Card */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Estadísticas</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Dificultad</span>
                      <span className="font-semibold text-blue-600">{gameState.difficulty} discos</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Movimientos mínimos</span>
                      <span className="font-semibold text-gray-900">{minimumMoves}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Eficiencia</span>
                      <span className="font-semibold text-gray-900">{efficiency}%</span>
                    </div>
                    {gameState.isComplete && (
                      <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                        <span className="text-sm text-gray-600">Estado</span>
                        <span className="font-semibold text-green-600">¡Completado!</span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Difficulty Selection */}
                <Card className="p-6 bg-white border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Dificultad</h3>
                  <div className="space-y-2">
                    {[3, 4, 5, 6].map(difficulty => (
                      <Button
                        key={difficulty}
                        variant={gameState.difficulty === difficulty ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => {
                          setShowVictoryModal(false);
                          resetGame(difficulty);
                        }}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {difficulty} Discos
                      </Button>
                    ))}
                  </div>
                </Card>

                {/* Rules Card */}
                <Card className="p-6 bg-gray-50 border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Reglas</h3>
                  <ul className="text-xs text-gray-600 space-y-2">
                    <li className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Solo puedes mover un disco a la vez</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Nunca puedes colocar un disco grande sobre uno pequeño</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Objetivo: mover todos los discos al poste derecho</span>
                    </li>
                  </ul>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Victory Modal */}
      <VictoryModal
        isOpen={showVictoryModal}
        moves={gameState.moves}
        minimumMoves={minimumMoves}
        difficulty={gameState.difficulty}
        onPlayAgain={handlePlayAgain}
        onExit={handleExit}
      />

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-12">
        <div className="container py-8 text-center text-sm text-gray-600">
          <p>Torre de Hanoi © 2025 | Un clásico puzzle de lógica matemática</p>
        </div>
      </footer>
    </div>
  );
}
