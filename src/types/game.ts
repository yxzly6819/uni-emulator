// ============================================================
// Core game types — v0.5 quarter system (4 decisions per semester)
// ============================================================

import type { CourseDef, EffortLevel } from './course';
import type { GameEvent } from './event';
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
  | 'semester_start'        // select course at semester start
  | 'quarter_operation'     // allocate energy for current quarter (1-4)
  | 'quarter_feedback'      // show quarter results
  | 'semester_end'          // final grades + summary
  | 'ending';

export interface PlayerState {
  major: string | null;          // now supports any major id
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
  quarterEfforts: (EffortLevel | null)[];  // [q1, q2, q3, q4] effort per quarter
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
  currentQuarter: number;  // 1-4 within each semester
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
