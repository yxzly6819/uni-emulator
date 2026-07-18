// ============================================================
// Activity definitions
// ============================================================

import type { ActivityDef } from '../types/activity';

export const activities: ActivityDef[] = [
  {
    id: 'parttime',
    name: '兼职',
    energyCost: 3,
    description: '金钱 +800~1200。EECS专业有30%概率真实能力+1。',
  },
  {
    id: 'competition',
    name: '竞赛/项目',
    energyCost: 5,
    description: '按真实能力判定获奖概率和奖金。受伤时不可选。',
  },
  {
    id: 'rest',
    name: '休息',
    energyCost: 0,
    description: '身心 +15（上限100）。每半学期限选一次。',
  },
  {
    id: 'selfstudy',
    name: '自学',
    energyCost: 4,
    description: '真实能力 +3~6。无直接绩点收益。',
  },
];
