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

const EFFORT_LABEL: Record<EffortLevel, string> = {
  skip: '逃课', idle: '摸鱼', normal: '正常', serious: '认真', dead: '死磕',
};

export function QuarterOperationScreen() {
  const { state, dispatch } = useGame();
  const { player, currentQuarter, temporaryAllocations } = state;

  const totalEnergy =
    (temporaryAllocations.courseEffort ? EFFORT_COST[temporaryAllocations.courseEffort] : 0) +
    temporaryAllocations.activities.reduce((s, a) => s + ACTIVITY_COST[a], 0);

  const canConfirm = totalEnergy <= 10;

  return (
    <div className="min-h-screen pt-16 pb-12 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-xs text-bureau-gray tracking-widest uppercase mb-1">
            大{player.currentYear} · 第{player.currentSemester}学期
          </div>
          <h2 className="text-3xl font-extrabold tracking-wide">
            第 {currentQuarter} 阶段
          </h2>
          <div className="mt-3 flex justify-center gap-6 text-sm text-bureau-gray">
            <span>💰 ¥{player.money.toLocaleString()}</span>
            <span>📊 {player.major}</span>
            <span>
              {currentQuarter === 1 ? '◉' : '○'} {currentQuarter === 2 ? '◉' : '○'} {currentQuarter === 3 ? '◉' : '○'} {currentQuarter === 4 ? '◉' : '○'}
            </span>
          </div>
          <p className="text-xs text-bureau-gray mt-2">
            剩余 {10} 精力点 · 可调整课程投入和额外活动
          </p>
        </div>

        {/* Course card (fixed) */}
        {player.currentCourse ? (
          <Card className="!p-6 mb-8 flex items-center justify-between">
            <div>
              <span className="text-xs text-bureau-gray tracking-wider uppercase">本学期课程</span>
              <div className="font-bold text-xl">{player.currentCourse.name}</div>
              <div className="text-xs text-bureau-gray mt-1 italic">
                {player.currentCourse.sarcasm.slice(0, 60)}...
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-bureau-gray">绩点取 4 个阶段平均</span>
              <div className="font-bold text-sm mt-1">
                {temporaryAllocations.quarterEfforts.filter(e => e !== null).length} / 4 已完成
              </div>
            </div>
          </Card>
        ) : (
          <Card className="!p-6 mb-8 text-center">
            <div className="text-bureau-gray py-4">本学期未选课</div>
          </Card>
        )}

        {/* Effort selector */}
        {player.currentCourse && (
          <Card className="!p-8 mb-8">
            <h4 className="text-xs text-bureau-gray tracking-wider uppercase mb-4">
              第 {currentQuarter} 阶段投入档位
            </h4>
            <EffortSelector
              selected={temporaryAllocations.courseEffort}
              onChange={(e) => dispatch({ type: 'SET_COURSE_EFFORT', payload: e })}
            />
            {/* Show previous efforts */}
            <div className="mt-4 flex gap-2 justify-center text-xs text-bureau-gray">
              {[1, 2, 3, 4].map(q => {
                const e = temporaryAllocations.quarterEfforts[q - 1];
                return (
                  <span key={q} className={`px-2 py-1 rounded ${q === currentQuarter ? 'bg-ink-black text-white font-bold' : e ? 'bg-gray-100' : 'bg-gray-50 text-bureau-gray/40'}`}>
                    Q{q}: {e ? EFFORT_LABEL[e] : '—'}
                  </span>
                );
              })}
            </div>
          </Card>
        )}

        {/* Energy allocation */}
        <Card className="!p-8 mb-8">
          <EnergyAllocator
            selectedActivities={temporaryAllocations.activities}
            onToggle={(a) => dispatch({ type: 'TOGGLE_ACTIVITY', payload: a })}
            courseEffort={temporaryAllocations.courseEffort}
            injured={player.flags.injured}
            half={currentQuarter === 1 || currentQuarter === 2 ? 1 : 2}
          />
        </Card>

        {/* Confirm */}
        <div className="text-center">
          <Button
            onClick={() => dispatch({ type: 'CONFIRM_QUARTER' })}
            disabled={!canConfirm}
            variant="primary"
          >
            结算第 {currentQuarter} 阶段
          </Button>
          {!canConfirm && (
            <p className="text-xs text-danger-red mt-2">精力超出 {totalEnergy - 10} 点</p>
          )}
        </div>

      </div>
    </div>
  );
}
