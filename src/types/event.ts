// ============================================================
// Event type definitions
// ============================================================

import type { PlayerState, Flags } from './game';

export interface EventEffectResult {
  stateChanges: Partial<PlayerState>;
  energyDeduct?: number;
  extraText?: string;
}

export interface EventOption {
  text: string;
  require?: (state: PlayerState) => boolean;
  requireDesc?: string;
  effect: (state: PlayerState) => EventEffectResult;
}

export interface GameEvent {
  id: string;
  priority: number;
  category: 'daily' | 'satire' | 'core';
  title: string;
  trigger: (state: PlayerState, half: 1 | 2) => boolean;
  text: string;
  options?: EventOption[];
  noOptionEffect?: (state: PlayerState) => EventEffectResult;
  repeatable?: boolean;
}
