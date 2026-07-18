// ============================================================
// Course registry — getCourseById, getAvailableCourses
// ============================================================

import type { CourseDef } from '../../types/course';
import { eecsCourses } from './eecs';
import { lawCourses } from './law';
import { politicsCourses } from './politics';

const allCourses: CourseDef[] = [
  ...eecsCourses,
  ...lawCourses,
  ...politicsCourses,
];

const courseMap = new Map<string, CourseDef>();
for (const c of allCourses) {
  courseMap.set(c.id, c);
}

export function getCourseById(id: string): CourseDef | undefined {
  return courseMap.get(id);
}

/** Get courses available to a player given their major and completed course IDs */
export function getAvailableCourses(
  major: 'EECS' | 'LAW' | null,
  completedIds: string[],
): CourseDef[] {
  if (!major) return [];

  return allCourses.filter(c => {
    // Must not be completed
    if (completedIds.includes(c.id)) return false;
    // Must match major or be ALL
    if (c.major !== 'ALL' && c.major !== major) return false;
    return true;
  });
}

export function getAllCourses(): CourseDef[] {
  return allCourses;
}
