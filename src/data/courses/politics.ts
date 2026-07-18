// ============================================================
// Political courses (4 courses, shared by both majors)
// Formula: grade = ability * abilityIndex + effort * effortIndex ± randomRange
// Politics: abilityIndex very low, effortIndex high — effort is king
// ============================================================

import type { CourseDef } from '../../types/course';

export const politicsCourses: CourseDef[] = [
  // ---- 思想道德与法治 ----
  // 20*0.002+7*0.56=3.96±0.15  → cap:4.0, 逃课=挂科, 点名100%
  {
    id: 'p_moral',
    name: '思想道德与法治',
    type: 'politics',
    major: 'ALL',
    attendance: 'mandatory',
    attendanceRate: 1.0,
    grading: 'template',
    abilityIndex: 0.002,
    effortIndex: 0.56,
    randomRange: 0.15,
    abilityGainDead: 0,
    abilityGainOther: { skip: 0, idle: 0, normal: 0, serious: 0, dead: 0 },
    mindBodyCost: { skip: 0, idle: -3, normal: -3, serious: -3, dead: -3 },
    description: '思想政治必修课',
    sarcasm: '你背熟了所有标准答案，但你还是不知道什么是真正的道德。',
  },
  // ---- 中国近现代史纲要 ----
  // 20*0.003+7*0.56=3.98±0.20  → cap:4.0, 逃课=挂科, 点名100%
  {
    id: 'p_history',
    name: '中国近现代史纲要',
    type: 'politics',
    major: 'ALL',
    attendance: 'mandatory',
    attendanceRate: 1.0,
    grading: 'date',
    abilityIndex: 0.003,
    effortIndex: 0.56,
    randomRange: 0.20,
    abilityGainDead: 1,
    abilityGainOther: { skip: 0, idle: 0, normal: 0, serious: 1, dead: 1 },
    mindBodyCost: { skip: 0, idle: -4, normal: -4, serious: -4, dead: -4 },
    description: '按年份精确度评分',
    sarcasm: '你记住了1840年以来的每一个重要日期，却忘记了昨天食堂吃坏了肚子。',
  },
  // ---- 毛概 ----
  // 20*0.002+7*0.55=3.89±0.20  → cap:3.5 (靠师生情), 逃课=挂科, 点名100%
  {
    id: 'p_mao',
    name: '毛概',
    type: 'politics',
    major: 'ALL',
    attendance: 'mandatory',
    attendanceRate: 1.0,
    grading: 'favor',
    abilityIndex: 0.002,
    effortIndex: 0.55,
    randomRange: 0.20,
    gradeCap: 3.5,
    abilityGainDead: 0,
    abilityGainOther: { skip: 0, idle: 0, normal: 0, serious: 0, dead: 0 },
    mindBodyCost: { skip: 0, idle: -5, normal: -5, serious: -5, dead: -5 },
    description: '靠师生情评分',
    sarcasm: '你反复揣摩老师的喜好，在课间递了三次烟。期末平时分95。',
  },
  // ---- 形势与政策 ----
  // 固定绩点: 2.7, 逃课=挂科, 点名100%
  {
    id: 'p_situation',
    name: '形势与政策',
    type: 'politics',
    major: 'ALL',
    attendance: 'mandatory',
    attendanceRate: 1.0,
    grading: 'fixed',
    abilityIndex: 0,
    effortIndex: 0,
    randomRange: 0,
    abilityGainDead: 0,
    abilityGainOther: { skip: 0, idle: 0, normal: 0, serious: 0, dead: 0 },
    mindBodyCost: { skip: 0, idle: -3, normal: -3, serious: -3, dead: -3 },
    description: '全勤即2.7，缺课即挂科',
    sarcasm: '你在这门课上唯一观察到的，是辅导员今天的领带和上周是同一款。',
  },
];
