// ============================================================
// Activity type definitions
// ============================================================

export type ActivityId = 'parttime' | 'competition' | 'rest' | 'selfstudy';

export interface ActivityDef {
  id: ActivityId;
  name: string;
  energyCost: number;
  description: string;
}

export interface ActivityResult {
  moneyChange: number;
  abilityChange: number;
  mindBodyChange: number;
  blocked?: boolean;
  extraText?: string;
}
