import { useGame } from '../../state/GameContext';
import { Card } from '../ui/Card';
import { SarcasticBlock } from '../ui/SarcasticBlock';
import { getAllMajors } from '../../data/majors';
import { getAllCourses } from '../../data/courses/index';

export function MajorSelectScreen() {
  const { dispatch } = useGame();
  const majors = getAllMajors();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold mb-2">选择你的专业</h2>
      <p className="text-bureau-gray text-sm mb-8">这个选择将决定你未来四年的课程和结局走向。</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
        {majors.map(major => {
          const courseNames = getAllCourses()
            .filter(c => major.courseIds.includes(c.id))
            .map(c => c.name);
          return (
            <Card
              key={major.id}
              onClick={() => dispatch({ type: 'SELECT_MAJOR', payload: major.id })}
              className="hover:-translate-y-1 transition-transform"
            >
              <div className="text-center">
                <div className="text-5xl mb-3">{major.icon}</div>
                <h3 className="text-xl font-bold mb-1">{major.name}</h3>
                <div className="text-sm text-bureau-gray mb-4">{major.desc}</div>
                <div className="text-xs text-bureau-gray mb-3">
                  <span className="font-bold">课程：</span>
                  {courseNames.join(' · ')}
                </div>
                <SarcasticBlock className="text-sm !my-0 !py-1">
                  {major.sarcasm}
                </SarcasticBlock>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
