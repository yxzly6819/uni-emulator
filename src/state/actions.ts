// ============================================================
// Action types and creators — v0.5 quarter system
// ============================================================

import type { EffortLevel } from '../types/course';
import type { ActivityId } from '../types/activity';

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SELECT_MAJOR'; payload: string }
  | { type: 'SELECT_COURSE'; payload: string | null }
  | { type: 'SET_COURSE_EFFORT'; payload: EffortLevel }
  | { type: 'TOGGLE_ACTIVITY'; payload: ActivityId }
  | { type: 'CONFIRM_QUARTER' }
  | { type: 'DISMISS_FEEDBACK' }
  | { type: 'RESOLVE_EVENT'; payload: number }
  | { type: 'DISMISS_EVENT' }
  | { type: 'ADVANCE_SEMESTER' }
  | { type: 'RESTART_GAME' };
