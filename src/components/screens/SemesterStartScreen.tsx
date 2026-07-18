import { useGame } from '../../state/GameContext';
import { CourseSelector } from '../game/CourseSelector';
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

  const totalEnergy =
    (temporaryAllocations.courseEffort ? EFFORT_COST[temporaryAllocations.courseEffort] : 0) +
    temporaryAllocations.activities.reduce((s, a) => s + ACTIVITY_COST[a], 0);

  const canConfirm = totalEnergy <= 10 && (temporaryAllocations.selectedCourseId === null || temporaryAllocations.courseEffort !== null);

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
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">
            第{player.currentSemester}学期 · {currentHalf === 1 ? '上半学期' : '下半学期'}
          </h2>
          <p className="text-bureau-gray text-sm mt-1">
            大{player.currentYear} · {player.major} · 资金 ¥{player.money}
          </p>
          {currentHalf === 1 && (
            <p className="text-xs text-bureau-gray mt-2">
              💡 提示：每学期最多选1门课。剩余精力可分配给额外活动。
            </p>
          )}
        </div>

        {/* Course selection (only for half 1) */}
        {currentHalf === 1 ? (
          <Card className="mb-6">
            <CourseSelector
              selectedCourseId={temporaryAllocations.selectedCourseId}
              selectedEffort={temporaryAllocations.courseEffort}
              onSelectCourse={handleSelectCourse}
              onSelectEffort={handleSelectEffort}
            />
          </Card>
        ) : (
          /* Half 2: course is fixed, show it */
          <Card className="mb-6">
            <h4 className="font-bold text-sm text-bureau-gray mb-3">本学期已选课程</h4>
            {temporaryAllocations.selectedCourseId ? (
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="font-bold">{player.currentCourse?.name ?? temporaryAllocations.selectedCourseId}</span>
                <span className="text-bureau-gray text-sm ml-2">
                  当前投入: {temporaryAllocations.courseEffort ?? '未选择'}
                </span>
              </div>
            ) : (
              <div className="text-bureau-gray text-sm">本学期未选课</div>
            )}
          </Card>
        )}

        {/* Energy allocation */}
        <Card className="mb-6">
          <EnergyAllocator
            selectedActivities={temporaryAllocations.activities}
            onToggle={handleToggleActivity}
            courseEffort={temporaryAllocations.courseEffort}
            injured={player.flags.injured}
            half={currentHalf}
          />
        </Card>

        {/* Confirm button */}
        <div className="text-center">
          <Button
            onClick={() => dispatch({ type: 'CONFIRM_HALF' })}
            disabled={!canConfirm}
            variant="primary"
          >
            {currentHalf === 1 ? '开始上半学期' : '开始下半学期'}
          </Button>
          {!canConfirm && (
            <p className="text-xs text-bureau-gray mt-2">
              {temporaryAllocations.selectedCourseId && !temporaryAllocations.courseEffort
                ? '请选择课程投入档位'
                : totalEnergy > 10
                  ? `精力超出 ${totalEnergy - 10} 点，请调整分配`
                  : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
