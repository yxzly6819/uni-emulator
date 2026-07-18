// ============================================================
// Ending text templates
// ============================================================

import type { EndingDetail } from '../types/ending';

const EPILOGUE = '你花了四年时间，学会了一件事：课堂教给你的，远不如它从你身上拿走的。然而你还是站在这里，手里握着一张成绩单，上面印着某个盖了章的谎言。';

export const endings: Record<string, EndingDetail> = {
  A: {
    type: 'A',
    title: '保研',
    text: '你保上了本校的研究生。你看着名单，想起那些靠水课拉高的绩点，和那篇不知有没有人认真读过的论文。然后你打开导师发来的第一个课题——是给横向项目写结题报告。',
    subtitle: '保研是胜利吗？也许只是把本科的荒诞延续三年。',
  },
  B: {
    type: 'B',
    title: '考研上岸',
    text: '你在自习室泡了六个月，喝掉了上百包速溶咖啡。成绩出来那天，你哭了。你终于可以去那个更好的学校了，虽然你听说他们的食堂也会食物中毒。',
    subtitle: '你用半年时间学完了四年该学的东西。',
  },
  C: {
    type: 'C',
    title: '考研失败',
    text: '你考了，但差了几分。调剂系统里全是比你本科还差的学校。你关掉了网页，开始投简历。',
    subtitle: '你发现考研和高考不一样——高考失败还有大学上，考研失败只有社会等着你。',
  },
  // D endings are major-specific, handled in ending engine
  E: {
    type: 'E',
    title: '强制休学',
    text: '你的身心彻底崩溃了。辅导员让你填了一张休学申请表。你拎着行李走出校门，不知道还会不会回来。你妈打了三个电话，你一个都没接。',
    subtitle: '',
  },
  F: {
    type: 'F',
    title: '延毕/失业',
    text: '你没有拿到毕业证。你在出租屋里刷招聘软件，发现所有的岗位都要求\'本科学历\'。你开始考虑那个不需要学历的工作。外卖箱已经在路上了。',
    subtitle: '',
  },
};

export function getEpilogue(): string {
  return EPILOGUE;
}
