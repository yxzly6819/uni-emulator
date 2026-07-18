import { useGame } from '../../state/GameContext';
import { ProgressBar } from '../ui/ProgressBar';

export function StatsBar() {
  const { state } = useGame();
  const { player } = state;

  if (player.termPhase === 'title' || player.termPhase === 'ending') return null;

  const majorName = player.major === 'EECS' ? 'EECS' : player.major === 'LAW' ? '法学' : '';

  const mindBodyLabel = (() => {
    const mb = player.mindBody;
    if (mb >= 80) return '精力充沛';
    if (mb >= 50) return '状态尚可';
    if (mb >= 30) return '有些疲惫';
    if (mb >= 15) return '濒临崩溃';
    return '危险！';
  })();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-bureau-gray/20 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold text-base">{majorName}</span>
          <span className="text-bureau-gray">|</span>
          <span>大{player.currentYear} · 第{player.currentSemester}学期</span>
          {state.currentHalf === 1 && player.termPhase === 'semester_start' && (
            <span className="text-xs bg-ink-black text-white px-1.5 py-0.5 rounded">上半学期</span>
          )}
          {(player.termPhase === 'mid_adjust') && (
            <span className="text-xs bg-party-gold text-white px-1.5 py-0.5 rounded">下半学期</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-bureau-gray">💰</span>
            <span className="font-bold">¥{player.money}</span>
          </div>
          <div className="w-28">
            <ProgressBar value={player.mindBody} label={mindBodyLabel} showValue={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
