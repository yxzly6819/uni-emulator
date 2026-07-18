import { useMemo } from 'react';
import { useGame } from '../../state/GameContext';
import { getAvailableCourses } from '../../data/courses/index';
import { EffortSelector } from './EffortSelector';
import { Card } from '../ui/Card';
import type { EffortLevel } from '../../types/course';

interface CourseSelectorProps {
  selectedCourseId: string | null;
  selectedEffort: EffortLevel | null;
  onSelectCourse: (courseId: string | null) => void;
  onSelectEffort: (effort: EffortLevel) => void;
  readOnly?: boolean;
}

export function CourseSelector({
  selectedCourseId,
  selectedEffort,
  onSelectCourse,
  onSelectEffort,
  readOnly = false,
}: CourseSelectorProps) {
  const { state } = useGame();
  const { player } = state;

  const completedIds = useMemo(() => {
    const ids = player.gpaRecords.map(r => r.courseId);
    return [...new Set([...ids, ...player.completedPolitics])];
  }, [player.gpaRecords, player.completedPolitics]);

  const availableCourses = useMemo(
    () => getAvailableCourses(player.major, completedIds),
    [player.major, completedIds],
  );

  const selectedCourse = availableCourses.find(c => c.id === selectedCourseId);
  const remainingPolitics = 4 - player.completedPolitics.length;

  const courseTypeLabel = (type: string) => {
    if (type === 'politics') return '🏛️ 政治课';
    return '📚 专业课';
  };

  return (
    <div>
      <h4 className="font-bold text-sm text-bureau-gray mb-3">
        选择本学期课程（最多1门）
        {availableCourses.length === 0 && (
          <span className="text-danger-red ml-2">无可选课程！本学期可能触发休学。</span>
        )}
      </h4>

      {/* Politics reminder */}
      {!readOnly && remainingPolitics > 0 && (
        <div className="official-notice mb-3 text-sm">
          ⚠️ 毕业前必须修完 4 门政治课，当前还差 <span className="font-bold text-party-red">{remainingPolitics}</span> 门。每学期只能选 1 门课。
          {player.currentSemester >= 6 && remainingPolitics > (8 - player.currentSemester) && (
            <span className="text-danger-red"><br />剩余学期不足以修完所有政治课，请立即选政治课！</span>
          )}
        </div>
      )}

      {/* "No course" option */}
      <div className="mb-3">
        <button
          onClick={() => { onSelectCourse(null); }}
          disabled={readOnly}
          className={`
            w-full p-3 rounded-lg text-center border-2 border-dashed transition-all text-sm
            ${selectedCourseId === null
              ? 'border-ink-black bg-gray-100 font-bold'
              : 'border-bureau-gray/20 text-bureau-gray hover:border-bureau-gray/40'
            }
          `}
        >
          📭 本学期不选课（休息一学期，但可能触发休学结局）
        </button>
      </div>

      <div className="grid gap-3 max-h-96 overflow-y-auto">
        {availableCourses.map(course => {
          const isSelected = selectedCourseId === course.id;
          return (
            <Card
              key={course.id}
              selected={isSelected}
              onClick={() => !readOnly && onSelectCourse(course.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{course.name}</span>
                    <span className="text-xs text-bureau-gray">{courseTypeLabel(course.type)}</span>
                  </div>
                  <div className="text-xs text-bureau-gray mt-1">{course.description}</div>
                  <div className="text-xs text-bureau-gray mt-0.5">
                    点名: {course.attendance === 'none' ? '不点名' : course.attendance === 'mandatory' ? '必点 (100%)' : course.attendance === 'strict' ? `严格 (${course.attendanceRate * 100}%)` : `随机 (${course.attendanceRate * 100}%)`}
                    {' · '}给分: {course.grading}
                  </div>
                </div>
              </div>

              {isSelected && !readOnly && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-bureau-gray mb-2">选择投入档位：</div>
                  <EffortSelector selected={selectedEffort} onChange={onSelectEffort} />
                </div>
              )}

              {isSelected && readOnly && selectedEffort && (
                <div className="mt-2 text-sm text-bureau-gray">
                  当前投入: <span className="font-bold text-ink-black">{selectedEffort}</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
