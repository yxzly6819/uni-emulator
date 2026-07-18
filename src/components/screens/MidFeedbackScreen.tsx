import { useGame } from '../../state/GameContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

export function MidFeedbackScreen() {
  const { state, dispatch } = useGame();
  const { player, lastFeedback } = state;

  if (!lastFeedback) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Button onClick={() => dispatch({ type: 'DISMISS_FEEDBACK' })}>继续</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-12 px-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-xs text-bureau-gray tracking-widest uppercase mb-1">
            大{player.currentYear} · 第{player.currentSemester}学期
          </div>
          <h2 className="text-3xl font-extrabold tracking-wide">期中反馈</h2>
          <p className="text-bureau-gray text-sm mt-2">上半学期结算</p>
        </div>

        {/* Grade prediction */}
        {lastFeedback.gradeText && (
          <Card className="!p-8 mb-6 text-center">
            <div className="text-xs text-bureau-gray tracking-wider uppercase mb-3">预期绩点</div>
            <div className="text-5xl font-extrabold text-ink-black">{lastFeedback.gradeText}</div>
            <div className="text-xs text-bureau-gray mt-2">期末结算时确定最终绩点</div>
          </Card>
        )}

        {/* Stats */}
        <Card className="!p-6 mb-6">
          <div className="text-xs text-bureau-gray tracking-wider uppercase mb-4">属性变化</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {lastFeedback.moneyChange !== 0 && (
              <div>
                <span className="text-bureau-gray">资金变化</span>
                <div className={`text-lg font-bold ${lastFeedback.moneyChange >= 0 ? 'text-health-green' : 'text-danger-red'}`}>
                  {lastFeedback.moneyChange >= 0 ? '+' : ''}¥{lastFeedback.moneyChange}
                </div>
              </div>
            )}
            <div className={lastFeedback.moneyChange !== 0 ? '' : 'col-span-2'}>
              <span className="text-bureau-gray">身心变化</span>
              <div className={`text-lg font-bold ${lastFeedback.mindBodyChange >= 0 ? 'text-health-green' : 'text-danger-red'}`}>
                {lastFeedback.mindBodyChange >= 0 ? '+' : ''}{lastFeedback.mindBodyChange}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar value={player.mindBody} label="当前身心" />
          </div>
          <div className="flex justify-between mt-3 text-sm">
            <span className="text-bureau-gray">当前资金</span>
            <span className="font-bold">¥{player.money.toLocaleString()}</span>
          </div>
        </Card>

        {/* Ability hint */}
        <Card className="!p-6 mb-8">
          <div className="text-xs text-bureau-gray tracking-wider uppercase mb-2">能力评估</div>
          <div className="text-base leading-relaxed">{lastFeedback.abilityText}</div>
        </Card>

        <div className="text-center">
          <Button onClick={() => dispatch({ type: 'DISMISS_FEEDBACK' })} variant="primary">
            进入期中调整
          </Button>
        </div>
      </div>
    </div>
  );
}
