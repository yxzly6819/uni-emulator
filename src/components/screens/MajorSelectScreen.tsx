import { useGame } from '../../state/GameContext';
import { Card } from '../ui/Card';
import { SarcasticBlock } from '../ui/SarcasticBlock';

const MAJORS = [
  {
    id: 'EECS' as const,
    name: 'EECS',
    fullName: '电子工程与计算机科学',
    icon: '💻',
    courses: ['C程序设计基础', '模拟电路', '机器学习导论', '科研训练', '操作系统'],
    sarcasm: '"你刷了三个月LeetCode，面了八轮。入职第一天发现mentor让你调jQuery。"',
    desc: '代码与电路的世界。热门、内卷、35岁危机。你会成为调参侠还是真正的工程师？',
  },
  {
    id: 'LAW' as const,
    name: '法学',
    fullName: '法学',
    icon: '⚖️',
    courses: ['民法总论', '法律文书写作', '模拟法庭', '宪法学'],
    sarcasm: '"你过五关斩六将进了红圈所。入职第一天客户让你看合同，你发现和在课上学的一模一样。"',
    desc: '法条与辩论的殿堂。体面、辛苦、二八法则。你会成为精英律师还是房产中介？',
  },
];

export function MajorSelectScreen() {
  const { dispatch } = useGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold mb-2">选择你的专业</h2>
      <p className="text-bureau-gray text-sm mb-8">这个选择将决定你未来四年的课程和结局走向。</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
        {MAJORS.map(major => (
          <Card
            key={major.id}
            onClick={() => dispatch({ type: 'SELECT_MAJOR', payload: major.id })}
            className="hover:-translate-y-1 transition-transform"
          >
            <div className="text-center">
              <div className="text-5xl mb-3">{major.icon}</div>
              <h3 className="text-xl font-bold mb-1">{major.fullName}</h3>
              <div className="text-sm text-bureau-gray mb-4">{major.desc}</div>

              <div className="text-xs text-bureau-gray mb-3">
                <span className="font-bold">课程：</span>
                {major.courses.join(' · ')}
              </div>

              <SarcasticBlock className="text-sm !my-0 !py-1">
                {major.sarcasm}
              </SarcasticBlock>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
