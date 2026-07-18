// ============================================================
// Event registry — aggregates all events
// ============================================================

import type { GameEvent } from '../../types/event';
import { dailyEvents } from './events-daily';
import { satireEvents } from './events-satire';
import { coreEvents } from './events-core';

export const allEvents: GameEvent[] = [
  ...dailyEvents,
  ...satireEvents,
  ...coreEvents,
];
