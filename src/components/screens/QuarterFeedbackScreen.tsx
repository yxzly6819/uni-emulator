import { useGame } from '../../state/GameContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';

export function QuarterFeedbackScreen() {
  const { state, dispatch } = useGame();
  const { player, currentQuarter, lastFeedback } = state;

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
          <h2 className="text-3xl font-extrabold tracking-wide">
            第 {currentQuarter} 阶段结算
          </h2>
          <div className="mt-2 flex justify-center gap-2">
            {[1, 2, 3, 4].map(q => (
              <span key={q} className={`text-sm ${q <= currentQuarter ? 'font-bold' : 'text-bureau-gray/30'}`}>
                {q <= currentQuarter ? '●' : '○'}
              </span>
            ))}
          </div>
        </div>

        {/* Grade */}
        {lastFeedback.gradeText && (
          <Card className="!p-8 mb-6 text-center">
            <div className="text-xs text-bureau-gray tracking-wider uppercase mb-3">绩点预估</div>
            <div className="text-5xl font-extrabold text-ink-black">{lastFeedback.gradeText}</div>
            {currentQuarter < 4 && (
              <div className="text-xs text-bureau-gray mt-3">最终绩点将在第 4 阶段结算后确定</div>
            )}
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
            {currentQuarter >= 4 ? '查看期末总结' : `进入第 ${currentQuarter + 1} 阶段`}
          </Button>
        </div>

      </div>
    </div>
  );
}
