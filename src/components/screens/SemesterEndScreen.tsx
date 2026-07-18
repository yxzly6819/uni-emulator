import { useGame } from '../../state/GameContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { GradeResult } from '../game/GradeResult';

export function SemesterEndScreen() {
  const { state, dispatch } = useGame();
  const { player } = state;

  const latestGrade = player.gpaRecords.length > 0
    ? player.gpaRecords[player.gpaRecords.length - 1]
    : null;

  const cumulativeGPA = player.gpaRecords.length > 0
    ? player.gpaRecords.reduce((s, r) => s + r.gradePoint, 0) / player.gpaRecords.length
    : 0;

  return (
    <div className="min-h-screen pt-16 pb-12 px-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-xs text-bureau-gray tracking-widest uppercase mb-1">
            大{player.currentYear}
          </div>
          <h2 className="text-3xl font-extrabold tracking-wide">第{player.currentSemester}学期结束</h2>
        </div>

        {/* This semester grade */}
        {latestGrade && (
          <Card className="!p-8 mb-6 text-center">
            <div className="text-xs text-bureau-gray tracking-wider uppercase mb-3">本学期绩点</div>
            <GradeResult gradePoint={latestGrade.gradePoint} label={player.currentCourse?.name} />
          </Card>
        )}

        {/* Cumulative stats */}
        <Card className="!p-6 mb-6">
          <div className="text-xs text-bureau-gray tracking-wider uppercase mb-4">累计统计</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-bureau-gray text-sm">已修课程</span>
              <div className="text-2xl font-bold">{player.gpaRecords.length}</div>
            </div>
            <div>
              <span className="text-bureau-gray text-sm">累计 GPA</span>
              <div className={`text-2xl font-bold ${cumulativeGPA >= 3.5 ? 'text-a-grade' : cumulativeGPA >= 2.0 ? 'text-party-gold' : 'text-f-grade'}`}>
                {cumulativeGPA.toFixed(2)}
              </div>
            </div>
            <div>
              <span className="text-bureau-gray text-sm">政治课</span>
              <div className="text-2xl font-bold">
                {player.completedPolitics.length}<span className="text-base text-bureau-gray">/4</span>
              </div>
            </div>
            <div>
              <span className="text-bureau-gray text-sm">资金</span>
              <div className="text-2xl font-bold">¥{player.money.toLocaleString()}</div>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar value={player.mindBody} label="身心状态" />
          </div>
        </Card>

        {/* Warnings */}
        {player.mindBody < 30 && (
          <div className="official-notice mb-4 text-sm">⚠️ 你的身心状态已经很低了。注意休息！</div>
        )}
        {player.completedPolitics.length < 4 && player.currentSemester >= 6 && (
          <div className="official-notice mb-4 text-sm">
            ⚠️ 还有 {4 - player.completedPolitics.length} 门政治课未修，毕业前必须全部完成！
          </div>
        )}

        {/* Next */}
        <div className="text-center mt-8">
          <p className="text-sm text-bureau-gray mb-4">
            {player.currentSemester >= 8 ? '这是最后一个学期了' : `下学期开学获得 ¥1,500 生活费`}
          </p>
          <Button onClick={() => dispatch({ type: 'ADVANCE_SEMESTER' })} variant="primary">
            {player.currentSemester >= 8 ? '查看结局' : '进入下学期'}
          </Button>
        </div>
      </div>
    </div>
  );
}
