import { useGame } from './state/GameContext';
import { StatsBar } from './components/game/StatsBar';
import { EventPopup } from './components/game/EventPopup';
import { TitleScreen } from './components/screens/TitleScreen';
import { MajorSelectScreen } from './components/screens/MajorSelectScreen';
import { SemesterStartScreen } from './components/screens/SemesterStartScreen';
import { MidFeedbackScreen } from './components/screens/MidFeedbackScreen';
import { MidAdjustScreen } from './components/screens/MidAdjustScreen';
import { SemesterEndScreen } from './components/screens/SemesterEndScreen';
import { EndingScreen } from './components/screens/EndingScreen';

export default function App() {
  const { state } = useGame();
  const { termPhase } = state.player;

  const renderScreen = () => {
    switch (termPhase) {
      case 'title':
        return <TitleScreen />;
      case 'major_select':
        return <MajorSelectScreen />;
      case 'semester_start':
        return <SemesterStartScreen />;
      case 'mid_feedback':
        return <MidFeedbackScreen />;
      case 'mid_adjust':
        return <MidAdjustScreen />;
      case 'semester_end':
        return <SemesterEndScreen />;
      case 'ending':
        return <EndingScreen />;
      default:
        return <TitleScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-paper-white">
      <StatsBar />
      {renderScreen()}
      {state.pendingEvent && <EventPopup />}
    </div>
  );
}
