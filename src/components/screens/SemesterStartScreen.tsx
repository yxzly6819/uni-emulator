import { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { CourseSelector } from '../game/CourseSelector';
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

export function SemesterStartScreen() {
  const { state, dispatch } = useGame();
  const { player, currentHalf, temporaryAllocations } = state;
  const [step, setStep] = useState<'course' | 'energy'>('course');

  const totalEnergy =
    (temporaryAllocations.courseEffort ? EFFORT_COST[temporaryAllocations.courseEffort] : 0) +
    temporaryAllocations.activities.reduce((s, a) => s + ACTIVITY_COST[a], 0);

  const canConfirm = totalEnergy <= 10 && (temporaryAllocations.selectedCourseId === null || temporaryAllocations.courseEffort !== null);
  const canProceed = temporaryAllocations.selectedCourseId === null || temporaryAllocations.courseEffort !== null;

  const handleSelectCourse = (courseId: string | null) => {
    dispatch({ type: 'SELECT_COURSE', payload: courseId });
  };

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
          <h2 className="text-3xl font-extrabold tracking-wide">
            {currentHalf === 1 ? '上半学期' : '下半学期'}
          </h2>
          <div className="mt-3 flex justify-center gap-6 text-sm text-bureau-gray">
            <span>💰 ¥{player.money.toLocaleString()}</span>
            <span>📊 {player.major}</span>
          </div>

          {/* Step indicator */}
          <div className="flex justify-center gap-1 mt-8">
            <button
              onClick={() => setStep('course')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                step === 'course'
                  ? 'bg-ink-black text-white'
                  : 'bg-gray-100 text-bureau-gray hover:bg-gray-200'
              }`}
            >
              ① 选课
            </button>
            <div className="w-8 flex items-center justify-center text-bureau-gray/30">—</div>
            <button
              onClick={() => { if (canProceed) setStep('energy'); }}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                step === 'energy'
                  ? 'bg-ink-black text-white'
                  : canProceed
                    ? 'bg-gray-100 text-bureau-gray hover:bg-gray-200 cursor-pointer'
                    : 'bg-gray-100 text-bureau-gray/30 cursor-not-allowed'
              }`}
            >
              ② 精力分配
            </button>
          </div>
        </div>

        {/* Step 1: Course selection */}
        {step === 'course' && (
          <div className="space-y-6">
            <Card className="!p-8">
              <CourseSelector
                selectedCourseId={temporaryAllocations.selectedCourseId}
                selectedEffort={temporaryAllocations.courseEffort}
                onSelectCourse={handleSelectCourse}
                onSelectEffort={handleSelectEffort}
              />
            </Card>
            <div className="text-center">
              <Button
                onClick={() => setStep('energy')}
                disabled={!canProceed}
                variant="primary"
              >
                {temporaryAllocations.courseEffort ? '下一步：精力分配' : '不选课，直接分配精力'}
              </Button>
              {temporaryAllocations.selectedCourseId && !temporaryAllocations.courseEffort && (
                <p className="text-xs text-danger-red mt-2">请先选择课程投入档位</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Energy allocation */}
        {step === 'energy' && (
          <div className="space-y-6">
            {/* Show selected course summary */}
            {temporaryAllocations.selectedCourseId && temporaryAllocations.courseEffort && (
              <Card className="!p-5 flex items-center justify-between">
                <div>
                  <span className="text-sm text-bureau-gray">已选课程</span>
                  <div className="font-bold text-lg">{player.currentCourse?.name ?? temporaryAllocations.selectedCourseId}</div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-bureau-gray">投入档位</span>
                  <div className="font-bold text-lg">
                    {temporaryAllocations.courseEffort === 'skip' ? '逃课' :
                     temporaryAllocations.courseEffort === 'idle' ? '摸鱼' :
                     temporaryAllocations.courseEffort === 'normal' ? '正常' :
                     temporaryAllocations.courseEffort === 'serious' ? '认真' : '死磕'}
                    <span className="text-sm text-bureau-gray ml-1">({EFFORT_COST[temporaryAllocations.courseEffort]}精力)</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Effort selector (show again for easy adjustment) */}
            {temporaryAllocations.selectedCourseId && (
              <Card className="!p-6">
                <h4 className="text-xs text-bureau-gray tracking-wider uppercase mb-4">调整投入档位</h4>
                <EffortSelector selected={temporaryAllocations.courseEffort} onChange={handleSelectEffort} />
              </Card>
            )}

            {/* Energy allocator */}
            <Card className="!p-8">
              <EnergyAllocator
                selectedActivities={temporaryAllocations.activities}
                onToggle={handleToggleActivity}
                courseEffort={temporaryAllocations.courseEffort}
                injured={player.flags.injured}
                half={currentHalf}
              />
            </Card>

            {/* Confirm */}
            <div className="text-center">
              <Button
                onClick={() => dispatch({ type: 'CONFIRM_HALF' })}
                disabled={!canConfirm}
                variant="primary"
              >
                {currentHalf === 1 ? '开始上半学期' : '开始下半学期'}
              </Button>
              {!canConfirm && totalEnergy > 10 && (
                <p className="text-xs text-danger-red mt-2">精力超出 {totalEnergy - 10} 点，请调整分配</p>
              )}
              <p className="mt-3">
                <button onClick={() => setStep('course')} className="text-xs text-bureau-gray hover:text-ink-black underline">
                  ← 返回选课
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
