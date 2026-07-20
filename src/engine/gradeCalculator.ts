// ============================================================
// Grade calculation — additive formula
// grade = ability * abilityIndex + effort * effortIndex ± randomRange
// ============================================================

import type { CourseDef, EffortLevel } from '../types/course';
import { round2, randFloat, chance } from './utils';

export const EFFORT_VALUE: Record<EffortLevel, number> = {
  skip: 0, idle: 1, normal: 3, serious: 5, dead: 7,
};

export function calculateGrade(
  course: CourseDef,
  effort: EffortLevel,
  trueAbility: number,
  money: number,
  effortValOverride?: number,
): { gradePoint: number; note: string } {
  const effortVal = effortValOverride ?? EFFORT_VALUE[effort];
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

  // ability term (with threshold support)
  let aIdx = course.abilityIndex;
  if (course.abilityIndexHigh !== undefined && course.thresholdAbility !== undefined) {
    if (trueAbility >= course.thresholdAbility) {
      aIdx = course.abilityIndexHigh;
    }
  }
  let gradePoint = trueAbility * aIdx + effortVal * eIdx;

  // Random fluctuation
  gradePoint += (Math.random() - 0.5) * 2 * course.randomRange;

  // Attendance penalty (skip effort + random check)
  if (effort === 'skip' && course.attendanceRate > 0) {
    if (chance(course.attendanceRate)) {
      gradePoint -= 0.3;
    }
  }

  // Moot court: suit bonus if money > 2000
  if (course.specialRules === 'moot' && money > 2000) {
    gradePoint += 0.2;
  }

  // Apply grade cap
  if (course.gradeCap !== undefined) {
    gradePoint = Math.min(gradePoint, course.gradeCap);
  }

  return { gradePoint: round2(Math.max(0, Math.min(4.0, gradePoint))), note: '' };
}

export function calculateAbilityGain(course: CourseDef, effort: EffortLevel, trueAbility: number): number {
  if (effort === 'skip') {
    if (course.specialRules === 'research') return 0;
    return course.abilityGainOther['skip'] ?? 0;
  }
  if (effort === 'dead') {
    const gain = course.abilityGainDead;
    if (typeof gain === 'number') return gain;
    return gain[0] + Math.floor(Math.random() * (gain[1] - gain[0] + 1));
  }
  if (course.specialRules === 'os') return 0;
  let gain = course.abilityGainOther[effort] ?? 0;
  if (course.specialRules === 'civil') gain = Math.floor(gain * 0.8);
  if (course.specialRules === 'research') {
    if (trueAbility < 40) return 0;
    return course.abilityGainOther[effort] ?? 0;
  }
  if (course.specialRules === 'moot') {
    if (trueAbility >= 40) return 6;
    return course.abilityGainOther[effort] ?? 0;
  }
  return gain;
}

export function calculateMindBodyCost(course: CourseDef, effort: EffortLevel): number {
  return course.mindBodyCost[effort] ?? 0;
}
