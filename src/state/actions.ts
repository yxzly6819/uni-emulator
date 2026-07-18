// ============================================================
// Action type definitions and action creators
// ============================================================

import type { EffortLevel } from '../types/course';
import type { ActivityId } from '../types/activity';

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SELECT_MAJOR'; payload: 'EECS' | 'LAW' }
  | { type: 'SELECT_COURSE'; payload: string | null }
  | { type: 'SET_COURSE_EFFORT'; payload: EffortLevel }
  | { type: 'TOGGLE_ACTIVITY'; payload: ActivityId }
  | { type: 'CONFIRM_HALF' }
  | { type: 'DISMISS_FEEDBACK' }
  | { type: 'RESOLVE_EVENT'; payload: number }
  | { type: 'DISMISS_EVENT' }
  | { type: 'ADVANCE_SEMESTER' }
  | { type: 'RESTART_GAME' };

// Action creators (convenience)
export const startGame = (): GameAction => ({ type: 'START_GAME' });
export const selectMajor = (major: 'EECS' | 'LAW'): GameAction => ({ type: 'SELECT_MAJOR', payload: major });
export const selectCourse = (courseId: string | null): GameAction => ({ type: 'SELECT_COURSE', payload: courseId });
export const setCourseEffort = (effort: EffortLevel): GameAction => ({ type: 'SET_COURSE_EFFORT', payload: effort });
export const toggleActivity = (activityId: ActivityId): GameAction => ({ type: 'TOGGLE_ACTIVITY', payload: activityId });
export const confirmHalf = (): GameAction => ({ type: 'CONFIRM_HALF' });
export const dismissFeedback = (): GameAction => ({ type: 'DISMISS_FEEDBACK' });
export const resolveEvent = (optionIndex: number): GameAction => ({ type: 'RESOLVE_EVENT', payload: optionIndex });
export const dismissEvent = (): GameAction => ({ type: 'DISMISS_EVENT' });
export const advanceSemester = (): GameAction => ({ type: 'ADVANCE_SEMESTER' });
export const restartGame = (): GameAction => ({ type: 'RESTART_GAME' });
