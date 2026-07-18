// ============================================================
// Central game reducer — all state transitions
// ============================================================

import type { GameState, PlayerState, Flags } from '../types/game';
import { createInitialFlags } from '../types/game';
import type { GameAction } from './actions';
import { createInitialState, createInitialPlayer } from './initialState';
import type { EffortLevel, CourseDef } from '../types/course';
import type { ActivityId } from '../types/activity';
import { clamp, round2, randFloat, randInt, chance, pick } from '../engine/utils';
import { trueAbilityCoefficient, mindBodyPenalty } from '../engine/coefficients';
import { getCourseById, getAvailableCourses } from '../data/courses/index';

// Will be set by event data — lazy import to avoid circular deps
let _allEvents: import('../types/event').GameEvent[] = [];
export function setEventRegistry(events: import('../types/event').GameEvent[]) {
  _allEvents = events;
}

// ============================================================
// Effort & activity energy costs
// ============================================================

const EFFORT_COST: Record<EffortLevel, number> = {
  skip: 0, idle: 1, normal: 3, serious: 5, dead: 7,
};

const ACTIVITY_COST: Record<ActivityId, number> = {
  parttime: 3, competition: 5, rest: 0, selfstudy: 4,
};

// ============================================================
// Grade calculation — additive formula
// grade = ability * abilityIndex + effort * effortIndex ± randomRange
// ============================================================

const EFFORT_VALUE: Record<EffortLevel, number> = {
  skip: 0, idle: 1, normal: 3, serious: 5, dead: 7,
};

function calculateGrade(
  course: CourseDef,
  effort: EffortLevel,
  trueAbility: number,
  money: number,
): { gradePoint: number; note: string } {
  const effortVal = EFFORT_VALUE[effort];
  const eIdx = course.effortIndex;

  // Fixed grading (形势与政策)
  if (course.grading === 'fixed') {
    if (effort === 'skip') return { gradePoint: 0, note: '挂科（缺课）' };
    return { gradePoint: 2.7, note: '' };
  }

  // Special: OS must be dead or fail
  if (course.specialRules === 'os' && effort !== 'dead') {
    return { gradePoint: 0, note: '挂科（未完成实验）' };
  }
  // Special: writing skip = fail
  if (course.specialRules === 'writing' && effort === 'skip') {
    return { gradePoint: 0, note: '挂科（缺课）' };
  }
  // Mandatory attendance + skip = fail
  if (course.attendance === 'mandatory' && effort === 'skip') {
    return { gradePoint: 0, note: '挂科（缺课）' };
  }

  // ---- New additive formula ----
  // ability term (with threshold support)
  let aIdx = course.abilityIndex;
  if (course.abilityIndexHigh !== undefined && course.thresholdAbility !== undefined) {
    if (trueAbility >= course.thresholdAbility) {
      aIdx = course.abilityIndexHigh;
    }
  }
  let gradePoint = trueAbility * aIdx + effortVal * eIdx;

  // Random fluctuation (±randomRange)
  const random = (Math.random() - 0.5) * 2 * course.randomRange;
  gradePoint += random;

  // Attendance penalty (skip effort + random check)
  if (effort === 'skip' && course.attendanceRate > 0) {
    if (chance(course.attendanceRate)) {
      gradePoint = gradePoint - 0.3;
    }
  }

  // Moot court: suit bonus if money > 2000
  if (course.specialRules === 'moot' && money > 2000) {
    gradePoint = gradePoint + 0.2;
  }

  // Apply grade cap
  if (course.gradeCap !== undefined) {
    gradePoint = Math.min(gradePoint, course.gradeCap);
  }

  // Clamp to [0, 4.0]
  gradePoint = round2(Math.max(0, Math.min(4.0, gradePoint)));

  return { gradePoint, note: '' };
}

function calculateAbilityGain(
  course: CourseDef,
  effort: EffortLevel,
  trueAbility: number,
): number {
  if (effort === 'skip') {
    if (course.specialRules === 'research') return 0;
    return course.abilityGainOther['skip'] ?? 0;
  }

  if (effort === 'dead') {
    const gain = course.abilityGainDead;
    if (typeof gain === 'number') return gain;
    return randInt(gain[0], gain[1]);
  }

  // For OS: only dead gives ability
  if (course.specialRules === 'os') return 0;

  // Civil law: ability gain × 0.8
  let gain = course.abilityGainOther[effort] ?? 0;
  if (course.specialRules === 'civil') {
    gain = Math.floor(gain * 0.8);
  }

  // Research: only dead gives ability when trueAbility >= 40
  // (dead was already handled above, but research overrides for different ability thresholds)
  if (course.specialRules === 'research') {
    if (trueAbility < 40) return 0;
    return 2; // dead gives 2 (already handled above) + fallback is due to TS narrowing
  }

  // Moot court: dead gives 6 if ability >= 40, else 2 (dead handled above)
  if (course.specialRules === 'moot') {
    return trueAbility >= 40 ? 6 : 2;
  }

  // ML course has ability gains
  if (course.specialRules === 'ml') {
    return course.abilityGainOther[effort] ?? 0;
  }

  return gain;
}

function calculateMindBodyCost(course: CourseDef, effort: EffortLevel): number {
  return course.mindBodyCost[effort] ?? 0;
}

// ============================================================
// Activity resolution
// ============================================================

function resolveActivity(
  activityId: ActivityId,
  player: PlayerState,
): { moneyChange: number; abilityChange: number; mindBodyChange: number; extraText: string } {
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
      let successRate: number;
      let bonusRange: [number, number];
      let abilityGain: [number, number];
      if (ta >= 50) {
        successRate = 0.7; bonusRange = [2000, 3000]; abilityGain = [4, 8];
      } else if (ta >= 20) {
        successRate = 0.4; bonusRange = [500, 1500]; abilityGain = [2, 5];
      } else {
        successRate = 0.1; bonusRange = [500, 500]; abilityGain = [1, 3];
      }
      if (chance(successRate)) {
        const money = randInt(bonusRange[0], bonusRange[1]);
        const ab = randInt(abilityGain[0], abilityGain[1]);
        return { moneyChange: money, abilityChange: ab, mindBodyChange: 0, extraText: '竞赛获奖！' };
      } else {
        const ab = randInt(1, 3);
        return { moneyChange: 0, abilityChange: ab, mindBodyChange: -5, extraText: '竞赛未获奖' };
      }
    }
    case 'rest': {
      const heal = clamp(15, 0, 100 - player.mindBody);
      return { moneyChange: 0, abilityChange: 0, mindBodyChange: heal, extraText: '' };
    }
    case 'selfstudy': {
      const gain = randInt(3, 6);
      return { moneyChange: 0, abilityChange: gain, mindBodyChange: 0, extraText: '' };
    }
    default:
      return { moneyChange: 0, abilityChange: 0, mindBodyChange: 0, extraText: '' };
  }
}

// ============================================================
// Event selection
// ============================================================

function selectEvent(player: PlayerState, half: 1 | 2): import('../types/event').GameEvent | null {
  // 50% chance of no event at all
  if (Math.random() < 0.5) return null;

  const candidates = _allEvents.filter(e => {
    if (!e.trigger(player, half)) return false;
    if (!e.repeatable && player.eventHistory.includes(e.id)) return false;
    return true;
  });
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.priority - a.priority);
  const maxPriority = candidates[0].priority;
  const topTier = candidates.filter(e => e.priority === maxPriority);
  return pick(topTier) ?? null;
}

// ============================================================
// Ending determination
// ============================================================

function determineEnding(player: PlayerState): import('../types/ending').EndingDetail {
  const avgGPA = player.gpaRecords.length > 0
    ? player.gpaRecords.reduce((s, r) => s + r.gradePoint, 0) / player.gpaRecords.length
    : 0;
  const politicsComplete = player.completedPolitics.length >= 4;

  // E: Forced leave
  if (player.mindBody <= 0 || player.flags.expelled) {
    return {
      type: 'E', title: '强制休学',
      text: '你的身心彻底崩溃了。辅导员让你填了一张休学申请表。你拎着行李走出校门，不知道还会不会回来。',
    };
  }

  // F: Delayed graduation
  if (!politicsComplete || avgGPA < 1.0) {
    return {
      type: 'F', title: '延毕/失业',
      text: '你没有拿到毕业证。你在出租屋里刷招聘软件，发现所有的岗位都要求\'本科学历\'。你开始考虑那个不需要学历的工作。外卖箱已经在路上了。',
    };
  }

  // A: Graduate school recommendation
  if (avgGPA >= 3.5 && !player.flags.expelled) {
    return {
      type: 'A', title: '保研',
      text: '你保上了本校的研究生。你看着名单，想起那些靠水课拉高的绩点，和那篇不知有没有人认真读过的论文。然后你打开导师发来的第一个课题——是给横向项目写结题报告。',
      subtitle: '保研是胜利吗？也许只是把本科的荒诞延续三年。',
    };
  }

  // B/C: Postgraduate exam
  if (player.flags.selfstudyHard) {
    if (player.trueAbility >= 40) {
      return {
        type: 'B', title: '考研上岸',
        text: '你在自习室泡了六个月，喝掉了上百包速溶咖啡。成绩出来那天，你哭了。你终于可以去那个更好的学校了，虽然你听说他们的食堂也会食物中毒。',
        subtitle: '你用半年时间学完了四年该学的东西。',
      };
    } else {
      // Fall through to employment
    }
  }

  // D: Employment (by trueAbility × major)
  return getEmploymentEnding(player);
}

function getEmploymentEnding(player: PlayerState): import('../types/ending').EndingDetail {
  const ta = player.trueAbility;
  const major = player.major ?? 'EECS';

  if (major === 'EECS') {
    if (ta >= 60) {
      return {
        type: 'D1', title: '大厂offer',
        text: '你刷了三个月LeetCode，面了八轮，终于拿到了offer。入职第一天，你发现mentor让你做的第一件事，是调一个jQuery项目。',
      };
    } else if (ta >= 30) {
      return {
        type: 'D2', title: '中小企业码农',
        text: '你进了一家小公司，全栈，996。老板说我们要成为下一个字节跳动。你看着用了十年的技术栈，没有说破。',
      };
    } else {
      return {
        type: 'D3', title: '外包/转行',
        text: '你最终去了一家外包公司。你每天的工作是把设计稿转成网页。你大学学过的那些课程，从未出现在你的工作中。',
      };
    }
  } else {
    // LAW
    if (ta >= 60) {
      return {
        type: 'D1', title: '红圈所/精品所',
        text: '你过五关斩六将进了红圈所。入职第一天，合伙人让你起草一份法律意见书。你打开模板，发现和《法律文书写作》课教的一模一样。但这次，客户是真的会付款的。',
      };
    } else if (ta >= 30) {
      return {
        type: 'D2', title: '普通律所/法务',
        text: '你在一个中型律所做诉讼。案子大多是交通事故和离婚纠纷。你发现真正有用的是跟法院立案庭混个脸熟，而不是分析德国民法典。',
      };
    } else {
      return {
        type: 'D3', title: '法考未过/转行',
        text: '法考没过。你去了一个房产中介。同事问你大学学什么的，你说法学，他们问：\'那你会看合同吗？\'你说：\'会一点。\'',
      };
    }
  }
}

// ============================================================
// Handler functions
// ============================================================

function handleStartGame(): GameState {
  const state = createInitialState();
  return { ...state, player: { ...state.player, termPhase: 'major_select' } };
}

function handleSelectMajor(state: GameState, major: 'EECS' | 'LAW'): GameState {
  return {
    ...state,
    player: { ...state.player, major, termPhase: 'semester_start' },
    currentHalf: 1,
    temporaryAllocations: { selectedCourseId: null, courseEffort: null, activities: [] },
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
  const activities = exists
    ? current.filter(a => a !== activityId)
    : [...current, activityId];
  return {
    ...state,
    temporaryAllocations: { ...state.temporaryAllocations, activities },
  };
}

function handleConfirmHalf(state: GameState): GameState {
  const { player, currentHalf, temporaryAllocations } = state;
  const { selectedCourseId, courseEffort, activities } = temporaryAllocations;

  let newPlayer = { ...player };
  let totalMindBodyChange = 0;
  let totalMoneyChange = 0;
  let totalAbilityChange = 0;
  let gradeText = '';
  const extraTexts: string[] = [];

  // 1. Course effects (if course selected)
  if (selectedCourseId && courseEffort) {
    const course = getCourseById(selectedCourseId);
    if (course) {
      newPlayer.currentCourse = course;

      // Grade calculation
      const gradeResult = calculateGrade(course, courseEffort, newPlayer.trueAbility, newPlayer.money);

      // MindBody cost (stored as negative values in data)
      const mbCost = calculateMindBodyCost(course, courseEffort);
      totalMindBodyChange += mbCost;

      // Ability gain
      const abGain = calculateAbilityGain(course, courseEffort, newPlayer.trueAbility);
      totalAbilityChange += abGain;

      // Special: OS completion flag
      if (course.specialRules === 'os' && courseEffort === 'dead') {
        newPlayer.flags = { ...newPlayer.flags, jyyCompleted: true };
      }

      if (currentHalf === 1) {
        // Mid-term: show predicted range
        gradeText = `预期绩点: ${gradeResult.gradePoint.toFixed(1)}`;
      } else {
        // Final: record the grade
        newPlayer.gpaRecords = [
          ...newPlayer.gpaRecords,
          { courseId: course.id, gradePoint: gradeResult.gradePoint, term: player.currentSemester, effort: courseEffort },
        ];
        if (course.type === 'politics') {
          if (!newPlayer.completedPolitics.includes(course.id)) {
            newPlayer.completedPolitics = [...newPlayer.completedPolitics, course.id];
          }
        }
        gradeText = `最终绩点: ${gradeResult.gradePoint.toFixed(2)}`;
        if (gradeResult.note) extraTexts.push(gradeResult.note);
      }

      // Sarcasm
      extraTexts.push(course.sarcasm);
    }
  }

  // 2. Activity effects
  for (const actId of activities) {
    const result = resolveActivity(actId, newPlayer);
    totalMoneyChange += result.moneyChange;
    totalAbilityChange += result.abilityChange;
    totalMindBodyChange += result.mindBodyChange;
    if (result.extraText) extraTexts.push(result.extraText);
  }

  // 3. Apply changes
  newPlayer.money = Math.max(0, newPlayer.money + totalMoneyChange);
  newPlayer.trueAbility = clamp(newPlayer.trueAbility + totalAbilityChange, 0, 100);
  newPlayer.mindBody = clamp(newPlayer.mindBody + totalMindBodyChange, 0, 100);

  // If mindBody went to 0 — handle ending immediately
  if (newPlayer.mindBody <= 0) {
    const ending = determineEnding(newPlayer);
    return {
      ...state,
      player: { ...newPlayer, termPhase: 'ending' },
      ending,
    };
  }

  // 4. Trigger random event
  const event = selectEvent(newPlayer, currentHalf);

  // 5. Build feedback
  const abilityText = totalAbilityChange > 0
    ? '你的真实能力似乎有所提升。'
    : totalAbilityChange < 0
      ? '你的能力似乎有所退步。'
      : '你的能力没有明显变化。';

  const feedback = {
    gradeText,
    abilityText,
    mindBodyChange: totalMindBodyChange,
    moneyChange: totalMoneyChange,
    summaryText: extraTexts.join(' '),
  };

  // 6. Phase transition
  if (currentHalf === 1) {
    // After half 1: if no event, go to mid_feedback directly; otherwise event popup handles it
    const nextPhase = event ? state.player.termPhase : 'mid_feedback';
    return {
      ...state,
      player: { ...newPlayer, termPhase: nextPhase },
      currentHalf: 2,
      lastFeedback: feedback,
      pendingEvent: event,
      pendingEventResolved: false,
    };
  } else {
    // After half 2: if no event, go to semester_end directly; otherwise event popup handles it
    const nextPhase = event ? state.player.termPhase : 'semester_end';
    return {
      ...state,
      player: { ...newPlayer, termPhase: nextPhase },
      currentHalf: 1,
      lastFeedback: feedback,
      pendingEvent: event,
      pendingEventResolved: false,
    };
  }
}

function handleDismissFeedback(state: GameState): GameState {
  // After mid_feedback, go to mid_adjust (re-allocate for half 2)
  if (state.player.termPhase === 'mid_feedback') {
    return {
      ...state,
      player: { ...state.player, termPhase: 'mid_adjust' },
      temporaryAllocations: {
        selectedCourseId: state.temporaryAllocations.selectedCourseId,
        courseEffort: state.temporaryAllocations.courseEffort,
        activities: [],
      },
    };
  }
  // After semester_end with no pending event, advance semester
  return state;
}

function handleResolveEvent(state: GameState, optionIndex: number): GameState {
  const event = state.pendingEvent;
  if (!event) return state;

  let newPlayer = { ...state.player };
  const hasOptions = event.options && event.options.length > 0;

  if (hasOptions && event.options && event.options.length > optionIndex && optionIndex >= 0) {
    const option = event.options[optionIndex];
    const result = option.effect(newPlayer);

    // Merge state changes
    if (result.stateChanges.money !== undefined) newPlayer.money = result.stateChanges.money;
    if (result.stateChanges.mindBody !== undefined) newPlayer.mindBody = result.stateChanges.mindBody;
    if (result.stateChanges.trueAbility !== undefined) newPlayer.trueAbility = result.stateChanges.trueAbility;
    if (result.stateChanges.flags) newPlayer.flags = { ...newPlayer.flags, ...result.stateChanges.flags };
    if (result.stateChanges.gpaRecords) newPlayer.gpaRecords = result.stateChanges.gpaRecords;
    if (result.stateChanges.completedPolitics) newPlayer.completedPolitics = result.stateChanges.completedPolitics;
    if (result.stateChanges.eventHistory) newPlayer.eventHistory = result.stateChanges.eventHistory;

    // Handle energy deduction
    if (result.energyDeduct && result.energyDeduct > 0) {
      const alloc = state.temporaryAllocations;
      let energySpent = 0;
      if (alloc.courseEffort) energySpent += EFFORT_COST[alloc.courseEffort];
      for (const a of alloc.activities) energySpent += ACTIVITY_COST[a];
      const remaining = 10 - energySpent;
      if (result.energyDeduct > remaining) {
        newPlayer.mindBody = clamp(newPlayer.mindBody - (result.energyDeduct - remaining) * 2, 0, 100);
      }
    }
  } else if (event.noOptionEffect) {
    const result = event.noOptionEffect(newPlayer);
    if (result.stateChanges.money !== undefined) newPlayer.money = result.stateChanges.money;
    if (result.stateChanges.mindBody !== undefined) newPlayer.mindBody = result.stateChanges.mindBody;
    if (result.stateChanges.trueAbility !== undefined) newPlayer.trueAbility = result.stateChanges.trueAbility;
    if (result.stateChanges.flags) newPlayer.flags = { ...newPlayer.flags, ...result.stateChanges.flags };
  }

  // Clamp
  newPlayer.money = Math.max(0, newPlayer.money);
  newPlayer.mindBody = clamp(newPlayer.mindBody, 0, 100);
  newPlayer.trueAbility = clamp(newPlayer.trueAbility, 0, 100);

  // Record event in history
  if (!newPlayer.eventHistory.includes(event.id)) {
    newPlayer.eventHistory = [...newPlayer.eventHistory, event.id];
  }

  // For no-option events: dismiss immediately (apply phase transition in one step)
  if (!hasOptions) {
    // Check mindBody
    if (newPlayer.mindBody <= 0) {
      const ending = determineEnding(newPlayer);
      return {
        ...state,
        player: { ...newPlayer, termPhase: 'ending' },
        ending,
        pendingEvent: null,
        pendingEventResolved: true,
      };
    }
    const nextPhase = state.currentHalf === 2 ? 'mid_feedback' : 'semester_end';
    return {
      ...state,
      player: { ...newPlayer, termPhase: nextPhase },
      pendingEvent: null,
      pendingEventResolved: true,
    };
  }

  // For option events: keep pendingEvent so EventPopup shows result, then DISMISS_EVENT
  return {
    ...state,
    player: newPlayer,
    pendingEvent: event,
    pendingEventResolved: true,
  };
}

function handleDismissEvent(state: GameState): GameState {
  const { player, currentHalf } = state;

  // Check mindBody after event
  if (player.mindBody <= 0) {
    const ending = determineEnding(player);
    return {
      ...state,
      player: { ...player, termPhase: 'ending' },
      ending,
      pendingEvent: null,
      pendingEventResolved: true,
    };
  }

  // After half 1 processing (currentHalf was set to 2) → go to mid_feedback
  // After half 2 processing (currentHalf was set to 1) → go to semester_end
  const nextPhase = currentHalf === 2 ? 'mid_feedback' : 'semester_end';

  return {
    ...state,
    player: { ...player, termPhase: nextPhase },
    pendingEvent: null,
    pendingEventResolved: true,
  };
}

function handleAdvanceSemester(state: GameState): GameState {
  let newPlayer = { ...state.player };
  const nextSem = newPlayer.currentSemester + 1;

  if (nextSem > 8) {
    // Game over — determine ending
    const ending = determineEnding(newPlayer);
    return {
      ...state,
      player: { ...newPlayer, currentSemester: nextSem, termPhase: 'ending' },
      ending,
    };
  }

  // Advance semester
  newPlayer.currentSemester = nextSem;
  if (nextSem % 2 === 1) {
    // Odd semester = new year
    newPlayer.currentYear = Math.ceil(nextSem / 2);
  }

  // Clear short-lived flags
  newPlayer.flags = {
    ...newPlayer.flags,
    injured: false,
    contestWon: false,
  };

  // Add living expenses
  newPlayer.money += 1500;

  // Reset allocations
  return {
    ...state,
    player: { ...newPlayer, termPhase: 'semester_start', currentCourse: null },
    currentHalf: 1,
    temporaryAllocations: { selectedCourseId: null, courseEffort: null, activities: [] },
    lastFeedback: null,
    pendingEvent: null,
    pendingEventResolved: false,
  };
}

// ============================================================
// Main reducer
// ============================================================

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return handleStartGame();
    case 'SELECT_MAJOR':
      return handleSelectMajor(state, action.payload);
    case 'SELECT_COURSE':
      return handleSelectCourse(state, action.payload);
    case 'SET_COURSE_EFFORT':
      return handleSetEffort(state, action.payload);
    case 'TOGGLE_ACTIVITY':
      return handleToggleActivity(state, action.payload);
    case 'CONFIRM_HALF':
      return handleConfirmHalf(state);
    case 'DISMISS_FEEDBACK':
      return handleDismissFeedback(state);
    case 'RESOLVE_EVENT':
      return handleResolveEvent(state, action.payload);
    case 'DISMISS_EVENT':
      return handleDismissEvent(state);
    case 'ADVANCE_SEMESTER':
      return handleAdvanceSemester(state);
    case 'RESTART_GAME':
      return handleStartGame();
    default:
      return state;
  }
}
