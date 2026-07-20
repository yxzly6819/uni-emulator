// ============================================================
// Major registry — add majors by adding entries here
// ============================================================

import type { CourseDef } from '../types/course';
import { eecsCourses } from './courses/eecs';
import { lawCourses } from './courses/law';
import { politicsCourses } from './courses/politics';

export interface MajorDef {
  id: string;
  name: string;
  icon: string;
  desc: string;
  sarcasm: string;
  courseIds: string[];
}

export const MAJORS: Record<string, MajorDef> = {
  EECS: {
    id: 'EECS',
    name: '电子工程与计算机科学',
    icon: '💻',
    desc: '代码与电路的世界。热门、内卷、35岁危机。',
    sarcasm: '"你刷了三个月LeetCode，面了八轮。入职第一天发现mentor让你调jQuery。"',
    courseIds: eecsCourses.map(c => c.id),
  },
  LAW: {
    id: 'LAW',
    name: '法学',
    icon: '⚖️',
    desc: '法条与辩论的殿堂。体面、辛苦、二八法则。',
    sarcasm: '"你过五关斩六将进了红圈所。入职第一天客户让你看合同，你发现和在课上学的一模一样。"',
    courseIds: lawCourses.map(c => c.id),
  },
};

export function getMajor(majorId: string): MajorDef | undefined {
  return MAJORS[majorId];
}

export function getAllMajors(): MajorDef[] {
  return Object.values(MAJORS);
}
