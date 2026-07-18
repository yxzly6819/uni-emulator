// ============================================================
// Initial game state factory
// ============================================================

import type { GameState, PlayerState } from '../types/game';
import { createInitialFlags } from '../types/game';

export function createInitialPlayer(): PlayerState {
  return {
    major: null,
    money: 3000,
    gpaRecords: [],
    trueAbility: 20,
    mindBody: 80,
    currentYear: 1,
    currentSemester: 1,
    completedPolitics: [],
    flags: createInitialFlags(),
    eventHistory: [],
    currentCourse: null,
    termPhase: 'title',
  };
}

export function createInitialState(): GameState {
  return {
    player: createInitialPlayer(),
    currentHalf: 1,
    temporaryAllocations: {
      selectedCourseId: null,
      courseEffort: null,
      activities: [],
    },
    pendingEvent: null,
    pendingEventResolved: false,
    lastFeedback: null,
    ending: null,
  };
}
