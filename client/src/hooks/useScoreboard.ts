import { useEffect, useState } from 'react';

export interface GameScore {
  id: string;
  difficulty: number;
  moves: number;
  minimumMoves: number;
  efficiency: number;
  timestamp: number;
  date: string;
}

const STORAGE_KEY = 'hanoi_tower_scores';

export const useScoreboard = () => {
  const [scores, setScores] = useState<GameScore[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Cargar puntuaciones del localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setScores(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading scores:', error);
        setScores([]);
      }
    }
    setLoaded(true);
  }, []);

  // Guardar puntuación
  const addScore = (difficulty: number, moves: number, minimumMoves: number) => {
    const efficiency = Math.round((minimumMoves / moves) * 100);
    const newScore: GameScore = {
      id: `${Date.now()}-${Math.random()}`,
      difficulty,
      moves,
      minimumMoves,
      efficiency,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updatedScores = [newScore, ...scores];
    setScores(updatedScores);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
  };

  // Obtener mejores puntuaciones por dificultad
  const getBestScoresByDifficulty = (difficulty: number) => {
    return scores
      .filter(score => score.difficulty === difficulty)
      .sort((a, b) => a.moves - b.moves)
      .slice(0, 10);
  };

  // Obtener todas las puntuaciones ordenadas por fecha
  const getAllScores = () => {
    return scores.sort((a, b) => b.timestamp - a.timestamp);
  };

  // Obtener estadísticas generales
  const getStatistics = () => {
    if (scores.length === 0) {
      return {
        totalGames: 0,
        averageMoves: 0,
        bestEfficiency: 0,
        perfectGames: 0,
      };
    }

    const perfectGames = scores.filter(s => s.moves === s.minimumMoves).length;
    const averageMoves = Math.round(scores.reduce((sum, s) => sum + s.moves, 0) / scores.length);
    const bestEfficiency = Math.max(...scores.map(s => s.efficiency));

    return {
      totalGames: scores.length,
      averageMoves,
      bestEfficiency,
      perfectGames,
    };
  };

  // Limpiar todas las puntuaciones
  const clearScores = () => {
    setScores([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    scores,
    loaded,
    addScore,
    getBestScoresByDifficulty,
    getAllScores,
    getStatistics,
    clearScores,
  };
};
