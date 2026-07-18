// ============================================================
// Game context provider + useGame hook
// ============================================================

import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { GameState } from '../types/game';
import type { GameAction } from './actions';
import { gameReducer, setEventRegistry } from './gameReducer';
import { createInitialState } from './initialState';
import { allEvents } from '../data/events/index';

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  // Register events with the reducer (lazy init to avoid circular deps)
  React.useEffect(() => {
    setEventRegistry(allEvents);
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within GameProvider');
  }
  return ctx;
}
