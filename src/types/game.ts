// ============================================================
// Core game types — PlayerState, GameState, Flags, GPARecord
// ============================================================

import type { CourseDef, EffortLevel } from './course';
import type { GameEvent, EventEffectResult } from './event';
import type { ActivityId } from './activity';
import type { EndingDetail } from './ending';

export interface Flags {
  hasLove: boolean;
  loveCostActive: boolean;
  injured: boolean;
  jyyCompleted: boolean;
  contestWon: boolean;
  selfstudyHard: boolean;
  expelled: boolean;
}

export interface GPARecord {
  courseId: string;
  gradePoint: number;
  term: number;
  effort: EffortLevel;
}

export type TermPhase =
  | 'title'
  | 'major_select'
  | 'semester_start'
  | 'mid_feedback'
  | 'mid_adjust'
  | 'semester_end'
  | 'ending';

export interface PlayerState {
  major: 'EECS' | 'LAW' | null;
  money: number;
  gpaRecords: GPARecord[];
  trueAbility: number;
  mindBody: number;
  currentYear: number;
  currentSemester: number;
  completedPolitics: string[];
  flags: Flags;
  eventHistory: string[];
  currentCourse: CourseDef | null;
  termPhase: TermPhase;
}

export interface TemporaryAllocations {
  selectedCourseId: string | null;
  courseEffort: EffortLevel | null;
  half1Effort: EffortLevel | null;   // preserved for averaging in half 2
  activities: ActivityId[];
}

export interface FeedbackSummary {
  gradeText: string;
  abilityText: string;
  mindBodyChange: number;
  moneyChange: number;
  summaryText: string;
}

export interface GameState {
  player: PlayerState;
  currentHalf: 1 | 2;
  temporaryAllocations: TemporaryAllocations;
  pendingEvent: GameEvent | null;
  pendingEventResolved: boolean;
  lastFeedback: FeedbackSummary | null;
  ending: EndingDetail | null;
}

export function createInitialFlags(): Flags {
  return {
    hasLove: false,
    loveCostActive: false,
    injured: false,
    jyyCompleted: false,
    contestWon: false,
    selfstudyHard: false,
    expelled: false,
  };
}
