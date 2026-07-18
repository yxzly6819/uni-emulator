import { useGame } from '../../state/GameContext';
import { EffortSelector } from '../game/EffortSelector';
import { EnergyAllocator } from '../game/EnergyAllocator';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { EffortLevel } from '../../types/course';
import type { ActivityId } from '../../types/activity';

const EFFORT_COST: Record<EffortLevel, number> = {
  skip: 0, idle: 1, normal: 3, serious: 5, dead: 7,
};

const ACTIVITY_COST: Record<ActivityId, number> = {
  parttime: 3, competition: 5, rest: 0, selfstudy: 4,
};

export function MidAdjustScreen() {
  const { state, dispatch } = useGame();
  const { player, temporaryAllocations } = state;

  const totalEnergy =
    (temporaryAllocations.courseEffort ? EFFORT_COST[temporaryAllocations.courseEffort] : 0) +
    temporaryAllocations.activities.reduce((s, a) => s + ACTIVITY_COST[a], 0);

  const canConfirm = totalEnergy <= 10;

  const handleSelectEffort = (effort: EffortLevel) => {
    dispatch({ type: 'SET_COURSE_EFFORT', payload: effort });
  };

  const handleToggleActivity = (activityId: ActivityId) => {
    dispatch({ type: 'TOGGLE_ACTIVITY', payload: activityId });
  };

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">期中调整</h2>
          <p className="text-bureau-gray text-sm">
            大{player.currentYear} · 第{player.currentSemester}学期 · 下半学期
          </p>
          <p className="text-xs text-bureau-gray mt-2">
            💡 课程已锁定，但你可以调整投入档位和额外活动。
          </p>
        </div>

        {/* Fixed course display */}
        {player.currentCourse ? (
          <Card className="mb-6">
            <h4 className="font-bold text-sm text-bureau-gray mb-2">本学期课程</h4>
            <div className="p-3 bg-gray-50 rounded-lg mb-3">
              <span className="font-bold">{player.currentCourse.name}</span>
              <span className="text-xs text-bureau-gray ml-2">{player.currentCourse.type === 'politics' ? '政治课' : '专业课'}</span>
            </div>
            <div className="text-xs text-bureau-gray mb-2">调整投入档位：</div>
            <EffortSelector
              selected={temporaryAllocations.courseEffort}
              onChange={handleSelectEffort}
            />
          </Card>
        ) : (
          <Card className="mb-6">
            <div className="text-bureau-gray text-sm text-center py-4">本学期未选课（可能触发休学结局）</div>
          </Card>
        )}

        {/* Energy re-allocation */}
        <Card className="mb-6">
          <EnergyAllocator
            selectedActivities={temporaryAllocations.activities}
            onToggle={handleToggleActivity}
            courseEffort={temporaryAllocations.courseEffort}
            injured={player.flags.injured}
            half={2}
          />
        </Card>

        <div className="text-center">
          <Button
            onClick={() => dispatch({ type: 'CONFIRM_HALF' })}
            disabled={!canConfirm}
            variant="primary"
          >
            开始下半学期
          </Button>
          {!canConfirm && (
            <p className="text-xs text-bureau-gray mt-2">
              精力超出 {totalEnergy - 10} 点，请调整分配
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
