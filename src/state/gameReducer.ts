// ============================================================
// Central game reducer — v0.5 quarter system (4 decisions/semester)
// ============================================================

import type { GameState, PlayerState, Flags } from '../types/game';
import type { GameAction } from './actions';
import { createInitialState, createInitialPlayer } from './initialState';
import type { EffortLevel, CourseDef } from '../types/course';
import type { ActivityId } from '../types/activity';
import type { GameEvent } from '../types/event';
import { clamp, randInt, chance } from '../engine/utils';
import { EFFORT_VALUE, calculateGrade, calculateAbilityGain, calculateMindBodyCost } from '../engine/gradeCalculator';
import { selectEvent, applyEventResult } from '../engine/eventEngine';
import { determineEnding } from '../engine/endingEngine';
import { getCourseById } from '../data/courses/index';

// ============================================================
// Activity costs
// ============================================================

const ACTIVITY_COST: Record<ActivityId, number> = {
  parttime: 3, competition: 5, rest: 0, selfstudy: 4,
};

// ============================================================
// Activity resolution
// ============================================================

function resolveActivity(activityId: ActivityId, player: PlayerState): {
  moneyChange: number; abilityChange: number; mindBodyChange: number; extraText: string;
} {
  switch (activityId) {
    case 'parttime': {
      const money = randInt(800, 1200);
      const abilityUp = (player.major === 'EECS' && chance(0.3)) ? 1 : 0;
      return { moneyChange: money, abilityChange: abilityUp, mindBodyChange: 0, extraText: '' };
    }
    case 'competition': {
      if (player.flags.injured) {
        return { moneyChange: 0, abilityChange: 0, mindBodyChange: 0, extraText: '受伤无法参加竞赛' };
      }
      const ta = player.trueAbility;
      const successRate = ta >= 50 ? 0.7 : ta >= 20 ? 0.4 : 0.1;
      const bonusRange: [number, number] = ta >= 50 ? [2000, 3000] : ta >= 20 ? [500, 1500] : [500, 500];
      const abilityRange: [number, number] = ta >= 50 ? [4, 8] : ta >= 20 ? [2, 5] : [1, 3];
      if (chance(successRate)) {
        return { moneyChange: randInt(...bonusRange), abilityChange: randInt(...abilityRange), mindBodyChange: 0, extraText: '竞赛获奖！' };
      }
      return { moneyChange: 0, abilityChange: randInt(1, 3), mindBodyChange: -5, extraText: '竞赛未获奖' };
    }
    case 'rest': {
      const heal = clamp(15, 0, 100 - player.mindBody);
      return { moneyChange: 0, abilityChange: 0, mindBodyChange: heal, extraText: '' };
    }
    case 'selfstudy': {
      return { moneyChange: 0, abilityChange: randInt(3, 6), mindBodyChange: 0, extraText: '' };
    }
    default:
      return { moneyChange: 0, abilityChange: 0, mindBodyChange: 0, extraText: '' };
  }
}

// ============================================================
// Handler functions
// ============================================================

function handleStartGame(): GameState {
  const state = createInitialState();
  return { ...state, player: { ...state.player, termPhase: 'major_select' } };
}

function handleSelectMajor(state: GameState, major: string): GameState {
  return {
    ...state,
    player: { ...state.player, major, termPhase: 'semester_start' },
    currentQuarter: 1,
    temporaryAllocations: { selectedCourseId: null, courseEffort: null, quarterEfforts: [null, null, null, null], activities: [] },
  };
}

function handleSelectCourse(state: GameState, courseId: string | null): GameState {
  const course = courseId ? getCourseById(courseId) ?? null : null;
  return {
    ...state,
    player: { ...state.player, currentCourse: course },
    temporaryAllocations: {
      ...state.temporaryAllocations,
      selectedCourseId: courseId,
      courseEffort: courseId ? state.temporaryAllocations.courseEffort : null,
    },
  };
}

function handleSetEffort(state: GameState, effort: EffortLevel): GameState {
  return {
    ...state,
    temporaryAllocations: { ...state.temporaryAllocations, courseEffort: effort },
  };
}

function handleToggleActivity(state: GameState, activityId: ActivityId): GameState {
  const current = state.temporaryAllocations.activities;
  const exists = current.includes(activityId);
  const activities = exists ? current.filter(a => a !== activityId) : [...current, activityId];
  return {
    ...state,
    temporaryAllocations: { ...state.temporaryAllocations, activities },
  };
}

function handleConfirmQuarter(state: GameState): GameState {
  const { player, currentQuarter, temporaryAllocations } = state;
  const { selectedCourseId, courseEffort, activities } = temporaryAllocations;

  let newPlayer = { ...player };
  let totalMindBodyChange = 0;
  let totalMoneyChange = 0;
  let totalAbilityChange = 0;
  let gradeText = '';
  const extraTexts: string[] = [];

  // 1. Course effects
  if (selectedCourseId && courseEffort) {
    const course = getCourseById(selectedCourseId);
    if (course) {
      newPlayer.currentCourse = course;

      // Compute average effort across all quarters so far
      const newQuarterEfforts = [...temporaryAllocations.quarterEfforts];
      newQuarterEfforts[currentQuarter - 1] = courseEffort;

      const validEfforts = newQuarterEfforts.filter((e): e is EffortLevel => e !== null);
      let avgEffortVal: number | undefined;
      if (validEfforts.length > 0) {
        avgEffortVal = validEfforts.reduce((s, e) => s + EFFORT_VALUE[e], 0) / validEfforts.length;
      }

      // Grade: predicted for q1-3, final for q4
      const gradeResult = calculateGrade(course, courseEffort, newPlayer.trueAbility, newPlayer.money, avgEffortVal);
      const mbCost = calculateMindBodyCost(course, courseEffort);
      totalMindBodyChange += mbCost;
      const abGain = calculateAbilityGain(course, courseEffort, newPlayer.trueAbility);
      totalAbilityChange += abGain;

      if (course.specialRules === 'os' && courseEffort === 'dead') {
        newPlayer.flags = { ...newPlayer.flags, jyyCompleted: true };
      }

      if (currentQuarter === 4) {
        // Final: record result
        newPlayer.gpaRecords = [
          ...newPlayer.gpaRecords,
          { courseId: course.id, gradePoint: gradeResult.gradePoint, term: player.currentSemester, effort: courseEffort },
        ];
        if (course.type === 'politics' && !newPlayer.completedPolitics.includes(course.id)) {
          newPlayer.completedPolitics = [...newPlayer.completedPolitics, course.id];
        }
        gradeText = `最终绩点: ${gradeResult.gradePoint.toFixed(2)}`;
      } else {
        gradeText = `预期绩点: ${gradeResult.gradePoint.toFixed(1)} (Q${currentQuarter})`;
      }
      if (gradeResult.note) extraTexts.push(gradeResult.note);
      extraTexts.push(course.sarcasm);

      // Save quarter effort
      newPlayer = { ...newPlayer };
    }
  }

  // 2. Activity effects
  for (const actId of activities) {
    const result = resolveActivity(actId, newPlayer);
    totalMoneyChange += result.moneyChange;
    totalAbilityChange += result.abilityChange;
    totalMindBodyChange += result.mindBodyChange;
    if (result.extraText) extraTexts.push(result.extraText);
    if (actId === 'selfstudy' && newPlayer.currentYear >= 4) {
      newPlayer.flags = { ...newPlayer.flags, selfstudyHard: true };
    }
  }

  // 3. Apply changes
  newPlayer.money = Math.max(0, newPlayer.money + totalMoneyChange);
  newPlayer.trueAbility = clamp(newPlayer.trueAbility + totalAbilityChange, 0, 100);
  newPlayer.mindBody = clamp(newPlayer.mindBody + totalMindBodyChange, 0, 100);

  if (newPlayer.mindBody <= 0) {
    return { ...state, player: { ...newPlayer, termPhase: 'ending' }, ending: determineEnding(newPlayer) };
  }

  // 4. Save quarter effort
  const qEfforts = [...temporaryAllocations.quarterEfforts];
  qEfforts[currentQuarter - 1] = courseEffort;

  // 5. Trigger event
  const event = selectEvent(newPlayer);

  // 6. Build feedback
  const feedback = {
    gradeText,
    abilityText: totalAbilityChange > 0 ? '你的真实能力似乎有所提升。' : totalAbilityChange < 0 ? '你的能力似乎有所退步。' : '你的能力没有明显变化。',
    mindBodyChange: totalMindBodyChange,
    moneyChange: totalMoneyChange,
    summaryText: extraTexts.join(' '),
  };

  const nextPhase = event ? state.player.termPhase : 'quarter_feedback';
  return {
    ...state,
    player: { ...newPlayer, termPhase: nextPhase },
    temporaryAllocations: { ...temporaryAllocations, quarterEfforts: qEfforts },
    lastFeedback: feedback,
    pendingEvent: event,
    pendingEventResolved: false,
  };
}

function handleDismissFeedback(state: GameState): GameState {
  const { currentQuarter } = state;
  // From semester_start: advance to quarter_operation (quarter stays at 1)
  if (state.player.termPhase === 'semester_start') {
    return { ...state, player: { ...state.player, termPhase: 'quarter_operation' } };
  }
  // From quarter_feedback
  if (currentQuarter >= 4) {
    return { ...state, player: { ...state.player, termPhase: 'semester_end' } };
  }
  // Next quarter
  return {
    ...state,
    player: { ...state.player, termPhase: 'quarter_operation' },
    currentQuarter: currentQuarter + 1,
    temporaryAllocations: {
      ...state.temporaryAllocations,
      courseEffort: state.temporaryAllocations.courseEffort,
      activities: [],
    },
  };
}

function handleResolveEvent(state: GameState, optionIndex: number): GameState {
  const event = state.pendingEvent;
  if (!event) return state;

  let newPlayer = { ...state.player };
  const hasOptions = event.options && event.options.length > 0;

  if (hasOptions && event.options && optionIndex >= 0 && event.options.length > optionIndex) {
    const result = event.options[optionIndex].effect(newPlayer);
    newPlayer = applyEventResult(newPlayer, result);
  } else if (event.noOptionEffect) {
    const result = event.noOptionEffect(newPlayer);
    newPlayer = applyEventResult(newPlayer, result);
  }

  if (!newPlayer.eventHistory.includes(event.id)) {
    newPlayer.eventHistory = [...newPlayer.eventHistory, event.id];
  }

  // No-option events: dismiss immediately
  if (!hasOptions) {
    if (newPlayer.mindBody <= 0) {
      return { ...state, player: { ...newPlayer, termPhase: 'ending' }, ending: determineEnding(newPlayer), pendingEvent: null, pendingEventResolved: true };
    }
    const nextPhase = state.currentQuarter >= 4 ? 'semester_end' : 'quarter_feedback';
    return { ...state, player: { ...newPlayer, termPhase: nextPhase }, pendingEvent: null, pendingEventResolved: true };
  }

  return { ...state, player: newPlayer, pendingEvent: event, pendingEventResolved: true };
}

function handleDismissEvent(state: GameState): GameState {
  const { player, currentQuarter } = state;
  if (player.mindBody <= 0) {
    return { ...state, player: { ...player, termPhase: 'ending' }, ending: determineEnding(player), pendingEvent: null, pendingEventResolved: true };
  }
  const nextPhase = currentQuarter >= 4 ? 'semester_end' : 'quarter_feedback';
  return { ...state, player: { ...player, termPhase: nextPhase }, pendingEvent: null, pendingEventResolved: true };
}

function handleAdvanceSemester(state: GameState): GameState {
  let newPlayer = { ...state.player };
  const nextSem = newPlayer.currentSemester + 1;
  if (nextSem > 8) {
    return { ...state, player: { ...newPlayer, currentSemester: nextSem, termPhase: 'ending' }, ending: determineEnding(newPlayer) };
  }
  newPlayer.currentSemester = nextSem;
  if (nextSem % 2 === 1) {
    newPlayer.currentYear = Math.ceil(nextSem / 2);
  }
  newPlayer.flags = { ...newPlayer.flags, injured: false, contestWon: false };
  newPlayer.money += 1500;
  return {
    ...state,
    player: { ...newPlayer, termPhase: 'semester_start', currentCourse: null },
    currentQuarter: 1,
    temporaryAllocations: { selectedCourseId: null, courseEffort: null, quarterEfforts: [null, null, null, null], activities: [] },
    lastFeedback: null, pendingEvent: null, pendingEventResolved: false,
  };
}

// ============================================================
// Main reducer
// ============================================================

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': return handleStartGame();
    case 'SELECT_MAJOR': return handleSelectMajor(state, action.payload);
    case 'SELECT_COURSE': return handleSelectCourse(state, action.payload);
    case 'SET_COURSE_EFFORT': return handleSetEffort(state, action.payload);
    case 'TOGGLE_ACTIVITY': return handleToggleActivity(state, action.payload);
    case 'CONFIRM_QUARTER': return handleConfirmQuarter(state);
    case 'DISMISS_FEEDBACK': return handleDismissFeedback(state);
    case 'RESOLVE_EVENT': return handleResolveEvent(state, action.payload);
    case 'DISMISS_EVENT': return handleDismissEvent(state);
    case 'ADVANCE_SEMESTER': return handleAdvanceSemester(state);
    case 'RESTART_GAME': return handleStartGame();
    default: return state;
  }
}
