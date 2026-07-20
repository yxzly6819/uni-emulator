// ============================================================
// Ending determination
// ============================================================

import type { PlayerState } from '../types/game';
import type { EndingDetail } from '../types/ending';

export function determineEnding(player: PlayerState): EndingDetail {
  const avgGPA = player.gpaRecords.length > 0
    ? player.gpaRecords.reduce((s, r) => s + r.gradePoint, 0) / player.gpaRecords.length
    : 0;
  const politicsComplete = player.completedPolitics.length >= 4;

  if (player.mindBody <= 0 || player.flags.expelled) {
    return {
      type: 'E', title: '强制休学',
      text: '你的身心彻底崩溃了。辅导员让你填了一张休学申请表。你拎着行李走出校门，不知道还会不会回来。',
    };
  }

  if (!politicsComplete || avgGPA < 2.0) {
    return {
      type: 'F', title: '延毕/失业',
      text: '你没有拿到毕业证。你在出租屋里刷招聘软件，发现所有的岗位都要求\'本科学历\'。你开始考虑那个不需要学历的工作。外卖箱已经在路上了。',
    };
  }

  if (avgGPA >= 3.5 && !player.flags.expelled) {
    return {
      type: 'A', title: '保研',
      text: '你保上了本校的研究生。你看着名单，想起那些靠水课拉高的绩点，和那篇不知有没有人认真读过的论文。然后你打开导师发来的第一个课题——是给横向项目写结题报告。',
      subtitle: '保研是胜利吗？也许只是把本科的荒诞延续三年。',
    };
  }

  if (player.flags.selfstudyHard) {
    if (player.trueAbility >= 40) {
      return {
        type: 'B', title: '考研上岸',
        text: '你在自习室泡了六个月，喝掉了上百包速溶咖啡。成绩出来那天，你哭了。你终于可以去那个更好的学校了，虽然你听说他们的食堂也会食物中毒。',
        subtitle: '你用半年时间学完了四年该学的东西。',
      };
    }
    return {
      type: 'C', title: '考研失败',
      text: '你考了，但差了几分。调剂系统里全是比你本科还差的学校。你关掉了网页，开始投简历。',
      subtitle: '你发现考研和高考不一样——高考失败还有大学上，考研失败只有社会等着你。',
    };
  }

  return getEmploymentEnding(player);
}

function getEmploymentEnding(player: PlayerState): EndingDetail {
  const ta = player.trueAbility;
  const major = player.major ?? 'EECS';

  if (major === 'EECS') {
    if (ta >= 60) {
      return {
        type: 'D1', title: '大厂offer',
        text: '你刷了三个月LeetCode，面了八轮，终于拿到了offer。入职第一天，你发现mentor让你做的第一件事，是调一个jQuery项目。',
      };
    } else if (ta >= 30) {
      return {
        type: 'D2', title: '中小企业码农',
        text: '你进了一家小公司，全栈，996。老板说我们要成为下一个字节跳动。你看着用了十年的技术栈，没有说破。',
      };
    }
    return {
      type: 'D3', title: '外包/转行',
      text: '你最终去了一家外包公司。你每天的工作是把设计稿转成网页。你大学学过的那些课程，从未出现在你的工作中。',
    };
  }

  // LAW
  if (ta >= 60) {
    return {
      type: 'D1', title: '红圈所/精品所',
      text: '你过五关斩六将进了红圈所。入职第一天，合伙人让你起草一份法律意见书。你打开模板，发现和《法律文书写作》课教的一模一样。但这次，客户是真的会付款的。',
    };
  } else if (ta >= 30) {
    return {
      type: 'D2', title: '普通律所/法务',
      text: '你在一个中型律所做诉讼。案子大多是交通事故和离婚纠纷。你发现真正有用的是跟法院立案庭混个脸熟，而不是分析德国民法典。',
    };
  }
  return {
    type: 'D3', title: '法考未过/转行',
    text: '法考没过。你去了一个房产中介。同事问你大学学什么的，你说法学，他们问：\'那你会看合同吗？\'你说：\'会一点。\'',
  };
}
