import { useState, useCallback } from 'react';

export interface Disc {
  id: number;
  size: number;
}

export interface GameState {
  rods: Disc[][];
  selectedRod: number | null;
  moves: number;
  isComplete: boolean;
  difficulty: number;
  history: Array<{ from: number; to: number }>;
}

export const useHanoiGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const difficulty = 3;
    const initialRod: Disc[] = Array.from({ length: difficulty }, (_, i) => ({
      id: i + 1,
      size: difficulty - i,
    }));
    return {
      rods: [initialRod, [], []],
      selectedRod: null,
      moves: 0,
      isComplete: false,
      difficulty,
      history: [],
    };
  });

  const selectRod = useCallback((rodIndex: number) => {
    setGameState((prevState) => {
      // Si no hay varilla seleccionada
      if (prevState.selectedRod === null) {
        // Solo seleccionar si la varilla tiene discos
        if (prevState.rods[rodIndex].length === 0) {
          return prevState;
        }
        return {
          ...prevState,
          selectedRod: rodIndex,
        };
      }

      // Si se hace clic en la misma varilla, deseleccionar
      if (prevState.selectedRod === rodIndex) {
        return {
          ...prevState,
          selectedRod: null,
        };
      }

      // Intentar mover disco de la varilla seleccionada a esta varilla
      const fromRodIndex = prevState.selectedRod;
      const toRodIndex = rodIndex;
      const fromRod = prevState.rods[fromRodIndex];
      const toRod = prevState.rods[toRodIndex];

      // Validar que la varilla origen tenga discos
      if (fromRod.length === 0) {
        return {
          ...prevState,
          selectedRod: null,
        };
      }

      // Obtener el disco superior de la varilla origen
      const topFromDisc = fromRod[fromRod.length - 1];

      // Validar el movimiento
      let isValidMove = true;

      // Si la varilla destino tiene discos, verificar que el disco sea más pequeño
      if (toRod.length > 0) {
        const topToDisc = toRod[toRod.length - 1];
        isValidMove = topFromDisc.size < topToDisc.size;
      }

      // Si el movimiento no es válido, deseleccionar
      if (!isValidMove) {
        return {
          ...prevState,
          selectedRod: null,
        };
      }

      // Realizar el movimiento
      const newRods = prevState.rods.map((r) => [...r]);
      const disc = newRods[fromRodIndex].pop();

      if (!disc) {
        return prevState;
      }

      newRods[toRodIndex].push(disc);
      const newMoves = prevState.moves + 1;
      const isComplete = newRods[2].length === prevState.difficulty;

      return {
        ...prevState,
        rods: newRods,
        selectedRod: null,
        moves: newMoves,
        isComplete,
        history: [...prevState.history, { from: fromRodIndex, to: toRodIndex }],
      };
    });
  }, []);

  const resetGame = useCallback((difficulty: number = 3) => {
    const initialRod: Disc[] = Array.from({ length: difficulty }, (_, i) => ({
      id: i + 1,
      size: difficulty - i,
    }));
    setGameState({
      rods: [initialRod, [], []],
      selectedRod: null,
      moves: 0,
      isComplete: false,
      difficulty,
      history: [],
    });
  }, []);

  const getMinimumMoves = useCallback(() => {
    return Math.pow(2, gameState.difficulty) - 1;
  }, [gameState.difficulty]);

  const undo = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.history.length === 0) return prevState;

      const lastMove = prevState.history[prevState.history.length - 1];
      const newRods = prevState.rods.map((r) => [...r]);
      const disc = newRods[lastMove.to].pop();

      if (!disc) {
        return prevState;
      }

      newRods[lastMove.from].push(disc);

      return {
        ...prevState,
        rods: newRods,
        moves: Math.max(0, prevState.moves - 1),
        isComplete: false,
        history: prevState.history.slice(0, -1),
        selectedRod: null,
      };
    });
  }, []);

  return {
    gameState,
    selectRod,
    resetGame,
    getMinimumMoves,
    undo,
  };
};
