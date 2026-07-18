import { useGame } from '../../state/GameContext';
import { Button } from '../ui/Button';

export function TitleScreen() {
  const { dispatch } = useGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-extrabold tracking-wider mb-4">大学模拟器</h1>
      <p className="text-bureau-gray text-sm mb-12">课堂教给你的，远不如它从你身上拿走的。</p>
      <Button onClick={() => dispatch({ type: 'START_GAME' })} variant="primary">
        开始游戏
      </Button>
    </div>
  );
}
