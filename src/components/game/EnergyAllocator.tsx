import { useState } from 'react';
import type { ActivityId } from '../../types/activity';
import { activities as allActivities } from '../../data/activities';
import type { EffortLevel } from '../../types/course';

const EFFORT_COST: Record<EffortLevel, number> = {
  skip: 0, idle: 1, normal: 3, serious: 5, dead: 7,
};

const ACTIVITY_COST: Record<ActivityId, number> = {
  parttime: 3, competition: 5, rest: 0, selfstudy: 4,
};

interface EnergyAllocatorProps {
  selectedActivities: ActivityId[];
  onToggle: (activityId: ActivityId) => void;
  courseEffort: EffortLevel | null;
  maxEnergy?: number;
  injured?: boolean;
  half: 1 | 2;
}

export function EnergyAllocator({
  selectedActivities,
  onToggle,
  courseEffort,
  maxEnergy = 10,
  injured = false,
  half,
}: EnergyAllocatorProps) {
  const courseCost = courseEffort ? EFFORT_COST[courseEffort] : 0;
  const activityCost = selectedActivities.reduce((sum, a) => sum + ACTIVITY_COST[a], 0);
  const totalCost = courseCost + activityCost;
  const remaining = maxEnergy - totalCost;
  const overBudget = remaining < 0;

  // Rest can only be used once per half
  const restUsed = selectedActivities.includes('rest');

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-sm text-bureau-gray">额外活动</h4>
        <div className={`text-sm font-bold ${overBudget ? 'text-danger-red' : remaining <= 2 ? 'text-party-gold' : 'text-health-green'}`}>
          剩余精力: {remaining} / {maxEnergy}
        </div>
      </div>

      {/* Energy breakdown */}
      <div className="mb-3 flex gap-1">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-ink-black rounded-full transition-all" style={{ width: `${Math.min(100, (courseCost / maxEnergy) * 100)}%` }} />
        </div>
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-party-gold rounded-full transition-all" style={{ width: `${Math.min(100, (activityCost / maxEnergy) * 100)}%` }} />
        </div>
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-health-green rounded-full transition-all" style={{ width: `${Math.min(100, (Math.max(0, remaining) / maxEnergy) * 100)}%` }} />
        </div>
      </div>
      <div className="flex gap-1 text-xs text-bureau-gray mb-4">
        <span className="flex-1">课程 {courseCost}</span>
        <span className="flex-1">活动 {activityCost}</span>
        <span className="flex-1 text-right">余量</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {allActivities.map(act => {
          const isSelected = selectedActivities.includes(act.id);
          const isDisabled =
            (act.id === 'competition' && injured) ||
            (act.id === 'rest' && restUsed && !isSelected) ||
            (overBudget && !isSelected && (totalCost + ACTIVITY_COST[act.id] > maxEnergy));

          return (
            <button
              key={act.id}
              onClick={() => onToggle(act.id)}
              disabled={isDisabled}
              className={`
                p-3 rounded-lg text-left transition-all duration-200 border text-sm
                ${isSelected
                  ? 'bg-ink-black text-white border-ink-black shadow-md'
                  : isDisabled
                    ? 'bg-gray-100 border-bureau-gray/10 text-bureau-gray cursor-not-allowed'
                    : 'bg-white border-bureau-gray/20 text-ink-black hover:border-ink-black/30'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">{act.name}</span>
                <span className={`text-xs ${isSelected ? 'opacity-70' : 'text-bureau-gray'}`}>
                  {act.energyCost === 0 ? '0精力' : `${act.energyCost}精力`}
                </span>
              </div>
              <div className={`text-xs mt-0.5 ${isSelected ? 'opacity-70' : 'text-bureau-gray'}`}>
                {act.description}
              </div>
              {act.id === 'competition' && injured && (
                <div className="text-xs text-danger-red mt-1">🚫 受伤中，不可选</div>
              )}
            </button>
          );
        })}
      </div>

      {overBudget && (
        <div className="mt-3 text-sm text-danger-red font-bold">
          ⚠️ 精力超出 {Math.abs(remaining)} 点！请调整分配。
        </div>
      )}
    </div>
  );
}
