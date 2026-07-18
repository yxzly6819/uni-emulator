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

const EFFORT_LABEL: Record<EffortLevel, string> = {
  skip: '逃课', idle: '摸鱼', normal: '正常', serious: '认真', dead: '死磕',
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
    <div className="min-h-screen pt-16 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-xs text-bureau-gray tracking-widest uppercase mb-1">
            大{player.currentYear} · 第{player.currentSemester}学期
          </div>
          <h2 className="text-3xl font-extrabold tracking-wide">下半学期调整</h2>
          <div className="mt-3 flex justify-center gap-6 text-sm text-bureau-gray">
            <span>💰 ¥{player.money.toLocaleString()}</span>
            <span>📊 {player.major}</span>
          </div>
          <p className="text-xs text-bureau-gray mt-3">课程已锁定，可以调整投入档位和额外活动</p>
        </div>

        {/* Fixed course card */}
        {player.currentCourse ? (
          <Card className="!p-6 mb-8 flex items-center justify-between">
            <div>
              <span className="text-xs text-bureau-gray tracking-wider uppercase">本学期课程</span>
              <div className="font-bold text-xl">{player.currentCourse.name}</div>
              <div className="text-xs text-bureau-gray mt-1">
                {player.currentCourse.type === 'politics' ? '政治课' : '专业课'}
                {' · '}
                {player.currentCourse.sarcasm.slice(0, 50)}...
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-bureau-gray">上半学期投入</span>
              <div className="font-bold text-lg">
                {temporaryAllocations.half1Effort ? EFFORT_LABEL[temporaryAllocations.half1Effort] : '—'}
              </div>
              <span className="text-xs text-bureau-gray">最终绩点取两半学期平均</span>
            </div>
          </Card>
        ) : (
          <Card className="!p-6 mb-8 text-center">
            <div className="text-bureau-gray py-4">本学期未选课（可能触发休学结局）</div>
          </Card>
        )}

        {/* Effort adjustment */}
        {player.currentCourse && (
          <Card className="!p-8 mb-8">
            <h4 className="text-xs text-bureau-gray tracking-wider uppercase mb-4">调整下半学期投入档位</h4>
            <EffortSelector
              selected={temporaryAllocations.courseEffort}
              onChange={handleSelectEffort}
            />
            {temporaryAllocations.courseEffort && temporaryAllocations.half1Effort && (
              <div className="mt-3 text-xs text-bureau-gray text-center">
                平均投入值 = ({EFFORT_COST[temporaryAllocations.half1Effort]} + {EFFORT_COST[temporaryAllocations.courseEffort]}) / 2 = {((EFFORT_COST[temporaryAllocations.half1Effort] + EFFORT_COST[temporaryAllocations.courseEffort]) / 2).toFixed(1)}
              </div>
            )}
          </Card>
        )}

        {/* Energy allocation */}
        <Card className="!p-8 mb-8">
          <EnergyAllocator
            selectedActivities={temporaryAllocations.activities}
            onToggle={handleToggleActivity}
            courseEffort={temporaryAllocations.courseEffort}
            injured={player.flags.injured}
            half={2}
          />
        </Card>

        {/* Confirm */}
        <div className="text-center">
          <Button
            onClick={() => dispatch({ type: 'CONFIRM_HALF' })}
            disabled={!canConfirm}
            variant="primary"
          >
            开始下半学期
          </Button>
          {!canConfirm && (
            <p className="text-xs text-danger-red mt-2">精力超出 {totalEnergy - 10} 点，请调整分配</p>
          )}
        </div>
      </div>
    </div>
  );
}
