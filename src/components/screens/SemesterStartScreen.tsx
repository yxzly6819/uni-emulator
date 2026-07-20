import { useGame } from '../../state/GameContext';
import { CourseSelector } from '../game/CourseSelector';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { EffortLevel } from '../../types/course';

export function SemesterStartScreen() {
  const { state, dispatch } = useGame();
  const { player } = state;

  const handleSelectCourse = (courseId: string | null) => {
    dispatch({ type: 'SELECT_COURSE', payload: courseId });
  };

  const handleSelectEffort = (effort: EffortLevel) => {
    dispatch({ type: 'SET_COURSE_EFFORT', payload: effort });
  };

  const canProceed = state.temporaryAllocations.selectedCourseId === null || state.temporaryAllocations.courseEffort !== null;

  const handleNext = () => {
    dispatch({ type: 'DISMISS_FEEDBACK' }); // reusing: advances to quarter_operation
  };

  return (
    <div className="min-h-screen pt-16 pb-12 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-xs text-bureau-gray tracking-widest uppercase mb-1">
            大{player.currentYear}
          </div>
          <h2 className="text-3xl font-extrabold tracking-wide">
            第{player.currentSemester}学期 · 选课
          </h2>
          <div className="mt-3 flex justify-center gap-6 text-sm text-bureau-gray">
            <span>💰 ¥{player.money.toLocaleString()}</span>
            <span>📊 {player.major}</span>
          </div>
          <p className="text-xs text-bureau-gray mt-3">
            每学期最多选 1 门课。本学期有 4 次精力分配机会。
          </p>
        </div>

        {/* Course selection */}
        <Card className="!p-8 mb-8">
          <CourseSelector
            selectedCourseId={state.temporaryAllocations.selectedCourseId}
            selectedEffort={state.temporaryAllocations.courseEffort}
            onSelectCourse={handleSelectCourse}
            onSelectEffort={handleSelectEffort}
          />
        </Card>

        {/* Next button */}
        <div className="text-center">
          <Button onClick={handleNext} disabled={!canProceed} variant="primary">
            {state.temporaryAllocations.courseEffort ? '确认选课，开始第一阶��' : '不选课，直接开始（可能触发休学）'}
          </Button>
          {state.temporaryAllocations.selectedCourseId && !state.temporaryAllocations.courseEffort && (
            <p className="text-xs text-danger-red mt-2">请先选择课程投入档位</p>
          )}
        </div>

      </div>
    </div>
  );
}
