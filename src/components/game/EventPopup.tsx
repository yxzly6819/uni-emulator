import { useGame } from '../../state/GameContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SarcasticBlock } from '../ui/SarcasticBlock';

export function EventPopup() {
  const { state, dispatch } = useGame();
  const { pendingEvent, pendingEventResolved } = state;

  if (!pendingEvent) return null;

  const handleOption = (index: number) => {
    dispatch({ type: 'RESOLVE_EVENT', payload: index });
  };

  const handleNoOption = () => {
    dispatch({ type: 'RESOLVE_EVENT', payload: -1 });
  };

  const handleDismiss = () => {
    dispatch({ type: 'DISMISS_EVENT' });
  };

  const categoryColor =
    pendingEvent.category === 'core' ? 'border-party-red' :
    pendingEvent.category === 'satire' ? 'border-sarcasm-purple' :
    'border-party-gold';

  // For no-option events, auto-dismiss after resolve
  const noOptions = !pendingEvent.options;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="max-w-lg w-full animate-in fade-in zoom-in">
        <Card className={`border-l-4 ${categoryColor} max-h-[80vh] overflow-y-auto`}>
          {/* Title */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-ink-black">{pendingEvent.title}</span>
          </div>

          {/* Event text */}
          <div className="my-4 text-base leading-relaxed whitespace-pre-line">
            {pendingEvent.text}
          </div>

          {/* Options (before resolved) */}
          {!pendingEventResolved && pendingEvent.options && (
            <div className="space-y-2">
              {pendingEvent.options.map((opt, i) => {
                const meetsRequirement = opt.require ? opt.require(state.player) : true;
                return (
                  <button
                    key={i}
                    onClick={() => meetsRequirement && handleOption(i)}
                    disabled={!meetsRequirement}
                    className={`
                      w-full text-left p-3 rounded-lg border transition-all text-sm
                      ${meetsRequirement
                        ? 'border-bureau-gray/20 hover:border-ink-black/40 hover:bg-gray-50 cursor-pointer'
                        : 'border-bureau-gray/10 bg-gray-50 text-bureau-gray cursor-not-allowed'
                      }
                    `}
                  >
                    <span>{opt.text}</span>
                    {!meetsRequirement && opt.requireDesc && (
                      <span className="block text-xs text-danger-red mt-1">需要: {opt.requireDesc}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* No-option events: one-click dismiss */}
          {!pendingEventResolved && noOptions && (
            <Button onClick={handleNoOption} fullWidth variant="primary">
              继续
            </Button>
          )}

          {/* Resolved state */}
          {pendingEventResolved && (
            <div className="space-y-3">
              <SarcasticBlock>事件已处理</SarcasticBlock>
              <Button onClick={handleDismiss} fullWidth variant="primary">
                继续
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
