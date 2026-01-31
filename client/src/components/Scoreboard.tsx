import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameScore, useScoreboard } from '@/hooks/useScoreboard';
import { Trophy, Trash2, TrendingUp } from 'lucide-react';

export const Scoreboard = () => {
  const { scores, getBestScoresByDifficulty, getStatistics, clearScores } = useScoreboard();
  const stats = getStatistics();

  if (scores.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <div className="text-center space-y-3">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-semibold text-gray-600">Sin puntuaciones aún</h3>
          <p className="text-sm text-gray-500">
            ¡Completa un juego para ver tus puntuaciones aquí!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-gray-200">
      <div className="space-y-6">
        {/* Estadísticas Generales */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Estadísticas Generales
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="text-xs text-gray-600">Juegos totales</div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalGames}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="text-xs text-gray-600">Juegos perfectos</div>
              <div className="text-2xl font-bold text-green-600">{stats.perfectGames}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="text-xs text-gray-600">Movimientos promedio</div>
              <div className="text-2xl font-bold text-purple-600">{stats.averageMoves}</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="text-xs text-gray-600">Mejor eficiencia</div>
              <div className="text-2xl font-bold text-orange-600">{stats.bestEfficiency}%</div>
            </div>
          </div>
        </div>

        {/* Mejores Puntuaciones por Dificultad */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Mejores Puntuaciones
          </h3>
          <Tabs defaultValue="3" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {[3, 4, 5, 6].map(difficulty => (
                <TabsTrigger key={difficulty} value={String(difficulty)}>
                  {difficulty}D
                </TabsTrigger>
              ))}
            </TabsList>

            {[3, 4, 5, 6].map(difficulty => {
              const bestScores = getBestScoresByDifficulty(difficulty);
              return (
                <TabsContent key={difficulty} value={String(difficulty)} className="space-y-2">
                  {bestScores.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      Sin puntuaciones para {difficulty} discos
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {bestScores.map((score, index) => (
                        <ScoreRow key={score.id} score={score} rank={index + 1} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>

        {/* Botón para limpiar */}
        <Button
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
          onClick={() => {
            if (confirm('¿Estás seguro de que deseas borrar todas las puntuaciones?')) {
              clearScores();
            }
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Limpiar Puntuaciones
        </Button>
      </div>
    </Card>
  );
};

interface ScoreRowProps {
  score: GameScore;
  rank: number;
}

const ScoreRow = ({ score, rank }: ScoreRowProps) => {
  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency === 100) return 'text-green-600';
    if (efficiency >= 90) return 'text-blue-600';
    if (efficiency >= 80) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-lg font-bold w-8">{getMedalEmoji(rank)}</span>
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-900">
            {score.moves} movimientos
          </div>
          <div className="text-xs text-gray-500">{score.date}</div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-bold ${getEfficiencyColor(score.efficiency)}`}>
          {score.efficiency}%
        </div>
        <div className="text-xs text-gray-500">
          Min: {score.minimumMoves}
        </div>
      </div>
    </div>
  );
};
