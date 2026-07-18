// ============================================================
// Course type definitions
// ============================================================

export type EffortLevel = 'skip' | 'idle' | 'normal' | 'serious' | 'dead';
export type AttendanceType = 'none' | 'random' | 'strict' | 'mandatory';
export type GradingStyle =
  | 'normal' | 'strict' | 'easy' | 'template' | 'fixed'
  | 'paper' | 'performance' | 'date' | 'favor' | 'fair';
export type CourseType = 'major' | 'politics';

export interface GradeRange {
  skip: [number, number];
  idle: [number, number];
  normal: [number, number];
  serious: [number, number];
  dead: [number, number];
}

export interface CourseDef {
  id: string;
  name: string;
  type: CourseType;
  major: 'EECS' | 'LAW' | 'ALL';
  attendance: AttendanceType;
  attendanceRate: number;
  grading: GradingStyle;
  // New formula: grade = ability * abilityIndex + effort * effortIndex + random + special
  abilityIndex: number;            // 真实能力系数
  abilityIndexHigh?: number;       // 达到阈值后使用的能力系数（C程序设计≥50, 科研≥40, 模拟法庭≥40）
  thresholdAbility?: number;       // 能力阈值
  effortIndex: number;             // 努力系数
  randomRange: number;             // 随机波动±范围
  gradeCap?: number;               // 绩点上限（模拟电路3.3, 民法3.5, 毛概3.5）
  // Deprecated: kept for backward compat, no longer used in calculation
  gradeRange?: GradeRange;
  gradeRangeHigh?: GradeRange;
  hasThreshold?: boolean;
  abilityGainDead: number | [number, number];
  abilityGainOther: Record<string, number>;
  mindBodyCost: Record<string, number>;
  specialRules?: string;
  description: string;
  sarcasm: string;
}
