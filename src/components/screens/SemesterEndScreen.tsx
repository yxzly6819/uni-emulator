import { useGame } from '../../state/GameContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SarcasticBlock } from '../ui/SarcasticBlock';
import { ProgressBar } from '../ui/ProgressBar';
import { GradeResult } from '../game/GradeResult';

export function SemesterEndScreen() {
  const { state, dispatch } = useGame();
  const { player, lastFeedback } = state;

  const handleNext = () => {
    dispatch({ type: 'ADVANCE_SEMESTER' });
  };

  // Get the most recent GPA record (the course just completed)
  const latestGrade = player.gpaRecords.length > 0
    ? player.gpaRecords[player.gpaRecords.length - 1]
    : null;

  // Calculate cumulative GPA
  const cumulativeGPA = player.gpaRecords.length > 0
    ? player.gpaRecords.reduce((s, r) => s + r.gradePoint, 0) / player.gpaRecords.length
    : 0;

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">期末总结</h2>
          <p className="text-bureau-gray text-sm">
            第{player.currentSemester}学期结束 · 大{player.currentYear}
          </p>
        </div>

        {/* This semester's grade */}
        {latestGrade && (
          <Card className="mb-4 text-center">
            <h3 className="text-sm text-bureau-gray mb-2">本学期课程绩点</h3>
            <GradeResult gradePoint={latestGrade.gradePoint} label={player.currentCourse?.name} />
          </Card>
        )}

        {/* Cumulative stats */}
        <Card className="mb-4">
          <h3 className="text-sm text-bureau-gray mb-3">学期总结</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>累计已修课程</span>
              <span className="font-bold">{player.gpaRecords.length} 门</span>
            </div>
            <div className="flex justify-between">
              <span>累计平均绩点</span>
              <span className={`font-bold ${cumulativeGPA >= 3.5 ? 'grade-green' : cumulativeGPA >= 2.0 ? 'grade-yellow' : 'grade-red'}`}>
                {cumulativeGPA.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>已修政治课</span>
              <span className="font-bold">{player.completedPolitics.length} / 4</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={player.mindBody} label="当前身心状态" />
            </div>
            <div className="flex justify-between mt-2">
              <span>当前资金</span>
              <span className="font-bold">¥{player.money}</span>
            </div>
          </div>
        </Card>

        {/* Status warnings */}
        {player.mindBody < 30 && (
          <div className="official-notice mb-4 text-sm">
            ⚠️ 你的身心状态已经很低了。注意休息！
          </div>
        )}
        {player.completedPolitics.length < 4 && player.currentSemester >= 6 && (
          <div className="official-notice mb-4 text-sm">
            ⚠️ 你还有 {4 - player.completedPolitics.length} 门政治课未修。毕业前必须全部完成，否则延毕。
          </div>
        )}
        {player.gpaRecords.length === 0 && player.currentSemester > 1 && (
          <div className="official-notice mb-4 text-sm">
            🚨 你还没有修任何课程。如果有学期未选课，将触发休学结局。
          </div>
        )}

        {/* Summary text */}
        {lastFeedback?.summaryText && (
          <SarcasticBlock>{lastFeedback.summaryText}</SarcasticBlock>
        )}

        {/* Next semester */}
        <div className="text-center mt-6">
          <p className="text-sm text-bureau-gray mb-3">
            {player.currentSemester >= 8
              ? '这是最后一个学期了...'
              : `下学期将获得 ¥1500 生活费`}
          </p>
          <Button onClick={handleNext} variant="primary">
            {player.currentSemester >= 8 ? '查看结局' : '进入下学期'}
          </Button>
        </div>
      </div>
    </div>
  );
}
