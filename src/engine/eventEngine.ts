// ============================================================
// Event selection and resolution
// ============================================================

import type { GameEvent, EventEffectResult } from '../types/event';
import type { PlayerState } from '../types/game';
import { clamp, pick } from './utils';
import type { EffortLevel } from '../types/course';
import type { ActivityId } from '../types/activity';

let _allEvents: GameEvent[] = [];
export function setEventRegistry(events: GameEvent[]) {
  _allEvents = events;
}

export function getEventRegistry(): GameEvent[] {
  return _allEvents;
}

export function selectEvent(player: PlayerState): GameEvent | null {
  if (Math.random() < 0.5) return null;

  const candidates = _allEvents.filter(e => {
    if (!e.trigger(player)) return false;
    if (!e.repeatable && player.eventHistory.includes(e.id)) return false;
    return true;
  });
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.priority - a.priority);
  const maxPriority = candidates[0].priority;
  const topTier = candidates.filter(e => e.priority === maxPriority);
  return pick(topTier) ?? null;
}

export function applyEventResult(
  player: PlayerState,
  result: EventEffectResult,
): PlayerState {
  const p = { ...player };
  if (result.stateChanges.money !== undefined) p.money = result.stateChanges.money;
  if (result.stateChanges.mindBody !== undefined) p.mindBody = result.stateChanges.mindBody;
  if (result.stateChanges.trueAbility !== undefined) p.trueAbility = result.stateChanges.trueAbility;
  if (result.stateChanges.flags) p.flags = { ...p.flags, ...result.stateChanges.flags };
  if (result.stateChanges.gpaRecords) p.gpaRecords = result.stateChanges.gpaRecords;
  if (result.stateChanges.completedPolitics) p.completedPolitics = result.stateChanges.completedPolitics;
  if (result.stateChanges.eventHistory) p.eventHistory = result.stateChanges.eventHistory;
  p.money = Math.max(0, p.money);
  p.mindBody = clamp(p.mindBody, 0, 100);
  p.trueAbility = clamp(p.trueAbility, 0, 100);
  return p;
}
