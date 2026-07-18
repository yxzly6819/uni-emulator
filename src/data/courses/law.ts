// ============================================================
// LAW major courses (4 courses)
// Formula: grade = ability * abilityIndex + effort * effortIndex ± randomRange
// ============================================================

import type { CourseDef } from '../../types/course';

export const lawCourses: CourseDef[] = [
  // ---- 民法总论 ----
  // cap 3.5, 点名30%  20*0.018+3*0.30=1.26  50*0.018+7*0.30=3.00
  {
    id: 'c_law_civil',
    name: '民法总论',
    type: 'major',
    major: 'LAW',
    attendance: 'random',
    attendanceRate: 0.3,
    grading: 'strict',
    abilityIndex: 0.018,
    effortIndex: 0.30,
    randomRange: 0.30,
    gradeCap: 3.5,
    abilityGainDead: [6, 6],
    abilityGainOther: { skip: 0, idle: 1, normal: 3, serious: 5, dead: 6 },
    mindBodyCost: { skip: 0, idle: -2, normal: -5, serious: -8, dead: -10 },
    specialRules: 'civil',
    description: '研究寻呼机时代的民事纠纷',
    sarcasm: '你研究了大量发生在寻呼机时代的民事纠纷。你比任何人都清楚传呼台的责任认定，尽管你再也不会见到传呼机。',
  },
  // ---- 法律文书写作 ----
  // 逃课=挂科, 点名100%  20*0.005+3*0.44=1.34  50*0.005+7*0.44=3.33
  {
    id: 'c_law_writing',
    name: '法律文书写作',
    type: 'major',
    major: 'LAW',
    attendance: 'mandatory',
    attendanceRate: 1.0,
    grading: 'template',
    abilityIndex: 0.005,
    effortIndex: 0.44,
    randomRange: 0.20,
    abilityGainDead: 2,
    abilityGainOther: { skip: 0, idle: 1, normal: 1, serious: 2, dead: 2 },
    mindBodyCost: { skip: 0, idle: -2, normal: -4, serious: -5, dead: -6 },
    specialRules: 'writing',
    description: '按格式评分，套用模板即可高分',
    sarcasm: '你把\'请求还钱\'四个字扩写成两页纸，文采飞扬。实习时律师扫了一眼，让你重写。',
  },
  // ---- 模拟法庭 ----
  // ability<40: abilityIndex=0.025  ability≥40: abilityIndexHigh=0.035
  // 20*0.025+3*0.20=1.10  40*0.035+5*0.20=2.40  +money>2000西装+0.2
  {
    id: 'c_law_moot',
    name: '模拟法庭',
    type: 'major',
    major: 'LAW',
    attendance: 'none',
    attendanceRate: 0,
    grading: 'performance',
    abilityIndex: 0.025,
    abilityIndexHigh: 0.035,
    thresholdAbility: 40,
    effortIndex: 0.20,
    randomRange: 0.35,
    abilityGainDead: [2, 6],
    abilityGainOther: { skip: 0, idle: 1, normal: 2, serious: 3, dead: 3 },
    mindBodyCost: { skip: 0, idle: -3, normal: -5, serious: -7, dead: -8 },
    specialRules: 'moot',
    description: '看现场表现。穿好西装（资金>2000）额外加分。',
    sarcasm: '你的法律逻辑漏洞百出，但你的西装剪裁得体。老师说你很有职业范儿。',
  },
  // ---- 宪法学 ----
  // 20*0.018+3*0.30=1.26  50*0.018+7*0.30=3.00
  {
    id: 'c_law_constitution',
    name: '宪法学',
    type: 'major',
    major: 'LAW',
    attendance: 'random',
    attendanceRate: 0.3,
    grading: 'normal',
    abilityIndex: 0.018,
    effortIndex: 0.30,
    randomRange: 0.35,
    abilityGainDead: 7,
    abilityGainOther: { skip: 0, idle: 1, normal: 3, serious: 5, dead: 7 },
    mindBodyCost: { skip: 0, idle: -2, normal: -5, serious: -7, dead: -10 },
    description: '宪法基础理论',
    sarcasm: '你熟读了宪法全文，但你不确定其中的权利是否真的属于你。',
  },
];
