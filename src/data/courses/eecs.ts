// ============================================================
// EECS major courses (5 courses)
// Formula: grade = ability * abilityIndex + effort * effortIndex ± randomRange
// ============================================================

import type { CourseDef } from '../../types/course';

const EFFORT_VALUES: Record<string, number> = { skip: 0, idle: 1, normal: 3, serious: 5, dead: 7 };

export const eecsCourses: CourseDef[] = [
  // ---- C程序设计基础 ----
  // ability<50: 20*0.018+3*0.35=1.41  ability=50: 50*0.030+5*0.35=3.25
  {
    id: 'c_eecs_c',
    name: 'C程序设计基础',
    type: 'major',
    major: 'EECS',
    attendance: 'none',
    attendanceRate: 0,
    grading: 'normal',
    abilityIndex: 0.018,
    abilityIndexHigh: 0.030,
    thresholdAbility: 50,
    effortIndex: 0.35,
    randomRange: 0.40,
    abilityGainDead: 2,
    abilityGainOther: { idle: 0, normal: 1, serious: 1, skip: 0, dead: 2 },
    mindBodyCost: { skip: 0, idle: -2, normal: -4, serious: -7, dead: -15 },
    description: 'C语言基础，编程入门课',
    sarcasm: '能把这门课学好的，开学前就已经会了。它存在的意义是给剩下的人制造挫败感。',
  },
  // ---- 模拟电路 ----
  // cap 3.3  20*0.012+3*0.32=1.20  50*0.012+7*0.32=2.84
  {
    id: 'c_eecs_analog',
    name: '模拟电路',
    type: 'major',
    major: 'EECS',
    attendance: 'strict',
    attendanceRate: 0.8,
    grading: 'strict',
    abilityIndex: 0.012,
    effortIndex: 0.32,
    randomRange: 0.30,
    gradeCap: 3.3,
    abilityGainDead: 1,
    abilityGainOther: { skip: 0, idle: 0, normal: 0, serious: 1, dead: 1 },
    mindBodyCost: { skip: 0, idle: -4, normal: -8, serious: -12, dead: -18 },
    specialRules: 'analog',
    description: '经典硬件课程，绩点上限3.3',
    sarcasm: '你熟练分析了二十年前就已停产的芯片，面试官问你用过Git吗，你沉默了。',
  },
  // ---- 机器学习导论 ----
  // 20*0.010+3*0.42=1.46  50*0.010+7*0.42=3.44
  {
    id: 'c_eecs_ml',
    name: '机器学习导论',
    type: 'major',
    major: 'EECS',
    attendance: 'none',
    attendanceRate: 0,
    grading: 'easy',
    abilityIndex: 0.010,
    effortIndex: 0.42,
    randomRange: 0.25,
    abilityGainDead: 3,
    abilityGainOther: { skip: 0, idle: 1, normal: 2, serious: 2, dead: 3 },
    mindBodyCost: { skip: 0, idle: -2, normal: -5, serious: -8, dead: -12 },
    specialRules: 'ml',
    description: '热门AI课程，绩点易高',
    sarcasm: '你学会了调参，并误以为自己精通人工智能。直到面试让你手推反向传播。',
  },
  // ---- 科研训练 ----
  // ability<40: 20*0.022+3*0.12=0.80  ability≥40: 40*0.035+5*0.12=2.00
  {
    id: 'c_eecs_research',
    name: '科研训练',
    type: 'major',
    major: 'EECS',
    attendance: 'none',
    attendanceRate: 0,
    grading: 'paper',
    abilityIndex: 0.022,
    abilityIndexHigh: 0.035,
    thresholdAbility: 40,
    effortIndex: 0.12,
    randomRange: 0.50,
    abilityGainDead: [0, 2],
    abilityGainOther: { skip: 0, idle: 0, normal: 1, serious: 1, dead: 1 },
    mindBodyCost: { skip: 0, idle: -2, normal: -4, serious: -6, dead: -8 },
    specialRules: 'research',
    description: '全靠期末论文，真实能力决定一切',
    sarcasm: '你在这门课上最大的收获，是学会如何把三页笔记扩充成一篇像模像样的论文。',
  },
  // ---- 操作系统 ----
  // 必须死磕  20*0.005+7*0.52=3.74  50*0.005+7*0.52=3.89
  {
    id: 'c_eecs_os',
    name: '操作系统',
    type: 'major',
    major: 'EECS',
    attendance: 'none',
    attendanceRate: 0,
    grading: 'fair',
    abilityIndex: 0.005,
    effortIndex: 0.52,
    randomRange: 0.15,
    abilityGainDead: 18,
    abilityGainOther: { skip: 0, idle: 0, normal: 0, serious: 0, dead: 18 },
    mindBodyCost: { skip: 0, idle: -3, normal: -5, serious: -8, dead: -12 },
    specialRules: 'os',
    description: '必须死磕才能通过，jyy的传奇课程',
    sarcasm: 'jyy的课没有一句废话。你无数次在崩溃边缘怀疑人生，但当你写完最后一个实验，你发现你已经能碾压外面培训班出来的。',
  },
];
