// ============================================================
// Course registry with major→course mapping
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

export function getAvailableCourses(
  major: string | null,
  completedIds: string[],
): CourseDef[] {
  if (!major) return [];
  return allCourses.filter(c => {
    if (completedIds.includes(c.id)) return false;
    if (c.major !== 'ALL' && c.major !== major) return false;
    return true;
  });
}

export function getAllCourses(): CourseDef[] {
  return allCourses;
}
