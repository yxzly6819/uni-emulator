import { useGame } from '../../state/GameContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SarcasticBlock } from '../ui/SarcasticBlock';
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

  const handleContinue = () => {
    dispatch({ type: 'DISMISS_FEEDBACK' });
  };

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">期中反馈</h2>
          <p className="text-bureau-gray text-sm">
            第{player.currentSemester}学期 · 上半学期结算
          </p>
        </div>

        {/* Grade prediction */}
        {lastFeedback.gradeText && (
          <Card className="mb-4 text-center">
            <h3 className="text-sm text-bureau-gray mb-2">课程表现</h3>
            <div className="text-2xl font-bold">{lastFeedback.gradeText}</div>
            <div className="text-xs text-bureau-gray mt-1">（期末结算时确定最终绩点）</div>
          </Card>
        )}

        {/* Stats changes */}
        <Card className="mb-4">
          <h3 className="text-sm text-bureau-gray mb-3">属性变化</h3>
          <div className="space-y-2 text-sm">
            {lastFeedback.moneyChange !== 0 && (
              <div className="flex justify-between">
                <span>金钱</span>
                <span className={lastFeedback.moneyChange >= 0 ? 'text-health-green' : 'text-danger-red'}>
                  {lastFeedback.moneyChange >= 0 ? '+' : ''}{lastFeedback.moneyChange}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>身心状态</span>
              <span className={lastFeedback.mindBodyChange >= 0 ? 'text-health-green' : 'text-danger-red'}>
                {lastFeedback.mindBodyChange >= 0 ? '+' : ''}{lastFeedback.mindBodyChange}
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar value={player.mindBody} label="当前身心" />
            </div>
            <div className="flex justify-between mt-2">
              <span>金钱</span>
              <span className="font-bold">¥{player.money}</span>
            </div>
          </div>
        </Card>

        {/* Ability hint */}
        <Card className="mb-4">
          <h3 className="text-sm text-bureau-gray mb-2">能力评估</h3>
          <div className="text-sm">{lastFeedback.abilityText}</div>
        </Card>

        {/* Summary */}
        {lastFeedback.summaryText && (
          <SarcasticBlock>{lastFeedback.summaryText}</SarcasticBlock>
        )}

        {/* Continue */}
        <div className="text-center mt-6">
          <Button onClick={handleContinue} variant="primary">
            进入期中调整
          </Button>
        </div>
      </div>
    </div>
  );
}
