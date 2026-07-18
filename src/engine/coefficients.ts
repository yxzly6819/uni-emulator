// ============================================================
// Core coefficient functions for grade calculation
// ============================================================

/**
 * True ability coefficient: scales grade output
 * At ability 0 → 0.5, at ability 100 → 1.0
 */
export function trueAbilityCoefficient(trueAbility: number): number {
  return 0.5 + trueAbility / 200;
}

/**
 * Mind-body penalty: if mindBody < 30, learning efficiency drops to 0.5
 */
export function mindBodyPenalty(mindBody: number): number {
  return mindBody < 30 ? 0.5 : 1.0;
}

/**
 * Combined efficiency multiplier
 */
export function overallEfficiency(trueAbility: number, mindBody: number): number {
  return trueAbilityCoefficient(trueAbility) * mindBodyPenalty(mindBody);
}
