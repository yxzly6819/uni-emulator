import { useGame } from '../../state/GameContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SarcasticBlock } from '../ui/SarcasticBlock';
import { getEpilogue } from '../../data/endings';

export function EndingScreen() {
  const { state, dispatch } = useGame();
  const { player, ending } = state;

  if (!ending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Button onClick={() => dispatch({ type: 'RESTART_GAME' })} variant="primary">
          重新开始
        </Button>
      </div>
    );
  }

  const avgGPA = player.gpaRecords.length > 0
    ? (player.gpaRecords.reduce((s, r) => s + r.gradePoint, 0) / player.gpaRecords.length).toFixed(2)
    : 'N/A';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Ending type badge */}
        <div className="text-center mb-6">
          <div className={`
            inline-block text-sm px-4 py-1 rounded-full font-bold mb-3
            ${ending.type === 'A' || ending.type === 'B' ? 'bg-a-grade/10 text-a-grade' :
              ending.type === 'E' || ending.type === 'F' ? 'bg-f-grade/10 text-f-grade' :
              'bg-party-gold/10 text-party-gold'}
          `}>
            结局 {ending.type}
          </div>
          <h2 className="text-3xl font-bold mb-1">{ending.title}</h2>
          {ending.subtitle && (
            <div className="text-bureau-gray text-sm italic">{ending.subtitle}</div>
          )}
        </div>

        {/* Ending text */}
        <Card className="mb-6">
          <div className="text-base leading-relaxed whitespace-pre-line">
            {ending.text}
          </div>
        </Card>

        {/* Player stats summary */}
        <Card className="mb-6">
          <h3 className="text-sm text-bureau-gray mb-3">大学四年总结</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-bureau-gray">专业</span>
              <div className="font-bold">{player.major}</div>
            </div>
            <div>
              <span className="text-bureau-gray">平均绩点</span>
              <div className="font-bold">{avgGPA}</div>
            </div>
            <div>
              <span className="text-bureau-gray">已修课程</span>
              <div className="font-bold">{player.gpaRecords.length} 门</div>
            </div>
            <div>
              <span className="text-bureau-gray">最终资金</span>
              <div className="font-bold">¥{player.money}</div>
            </div>
            <div>
              <span className="text-bureau-gray">政治课完成</span>
              <div className="font-bold">{player.completedPolitics.length}/4</div>
            </div>
            <div>
              <span className="text-bureau-gray">已修课程</span>
              <div className="font-bold">{player.gpaRecords.length} 门</div>
            </div>
          </div>
        </Card>

        {/* Epilogue */}
        <div className="mb-8">
          <SarcasticBlock className="text-center !text-base">
            {getEpilogue()}
          </SarcasticBlock>
        </div>

        {/* Restart */}
        <div className="text-center">
          <Button onClick={() => dispatch({ type: 'RESTART_GAME' })} variant="primary">
            再来一次
          </Button>
          <p className="text-xs text-bureau-gray mt-3">
            不同的专业、不同的选择，会带来完全不同的结局。
          </p>
        </div>
      </div>
    </div>
  );
}
