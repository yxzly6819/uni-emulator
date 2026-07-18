// ============================================================
// Event data — core satire events (5 events)
// ============================================================

import type { GameEvent, EventEffectResult } from '../../types/event';
import type { PlayerState } from '../../types/game';
import { clamp, chance } from '../../engine/utils';

export const coreEvents: GameEvent[] = [
  // ---- 图书馆性骚扰诬陷 ----
  {
    id: 'library_harassment',
    priority: 10,
    category: 'core',
    title: '图书馆风波',
    trigger: (state) => state.currentYear >= 2,
    text: '你在图书馆自习，旁边女生突然站起来大喊：\'你刚才碰我了！\'所有人看向你。你什么都没做，但现在你必须解释。',
    options: [
      {
        text: '公开道歉',
        effect: (state) => ({
          stateChanges: { mindBody: clamp(state.mindBody - 15, 0, 100) },
          energyDeduct: 2,
          extraText: '你低头道了歉。辅导员拍了拍你的肩：\'大度一点，事情就过去了。\'事态平息了，但你的自尊心碎了一地。',
        }),
      },
      {
        text: '要求查监控自证',
        require: (state) => state.money >= 3000 && state.trueAbility >= 50,
        requireDesc: '需要金钱 ≥ 3000 且真实能力较高',
        effect: (state) => ({
          stateChanges: {},
          extraText: '监控证明你全程双手放在桌上。女生讪讪走了。图书管理员对你点了点头。但你在校园论坛上还是被讨论了一周。',
        }),
      },
      {
        text: '发长文反击',
        effect: (state) => {
          if (state.trueAbility >= 40 && chance(0.7)) {
            return {
              stateChanges: { mindBody: clamp(state.mindBody - 20 + 10, 0, 100) },
              extraText: '你的长文逻辑清晰、证据充分，舆论反转。但你发现，赢了舆论后你并没有感到开心——只是觉得累了。',
            };
          } else {
            return {
              stateChanges: { mindBody: clamp(state.mindBody - 20, 0, 100) },
              extraText: '你的长文被断章取义，评论区一片骂声：\'做贼心虚！\'你删掉了所有社交媒体。本学期绩点受到了影响。',
            };
          }
        },
      },
    ],
  },

  // ---- 竞赛奖金被队友私吞 ----
  {
    id: 'prize_stolen',
    priority: 10,
    category: 'core',
    title: '竞赛奖金被私吞',
    trigger: (state) => state.flags.contestWon,
    text: '你们团队拿了奖。但你发现奖金全被队长转走了。他发了条消息：\'这次我出力最多，钱应该归我。\'然后把你拉黑了。',
    options: [
      {
        text: '忍了 (奖金归零)',
        effect: (state) => ({
          stateChanges: {
            money: Math.max(0, state.money - 0), // no gain expected anyway
            mindBody: clamp(state.mindBody - 10, 0, 100),
          },
          extraText: '你忍了。但每次想起这件事，你都觉得胸口闷。你没拿到钱，但记住了一件事：下次先转账再签字。',
        }),
      },
      {
        text: '找指导老师调解 (拿回30%)',
        effect: (state) => ({
          stateChanges: {
            money: state.money + Math.floor(0.3 * 1000), // symbolic recovery
            mindBody: clamp(state.mindBody - 5, 0, 100),
          },
          extraText: '老师调解后，队长很不情愿地转了账。但他在朋友圈阴阳怪气：\'有些人就是见不得别人好。\'',
        }),
      },
      {
        text: '找学院领导',
        effect: (state) => {
          const hasSkipped = state.eventHistory.some(id => id.includes('skip'));
          if (hasSkipped) {
            return {
              stateChanges: { mindBody: clamp(state.mindBody - 10, 0, 100) },
              extraText: '领导翻看了你的出勤记录，表情冷淡：\'你自己也有问题。先把自己的事管好再说。\'你什么都没拿到。',
            };
          }
          return {
            stateChanges: { money: state.money + 500, mindBody: clamp(state.mindBody - 5, 0, 100) },
            extraText: '领导主持了公道。队长不情愿地分了钱。但你在院里多了一个\'爱打小报告\'的名声。',
          };
        },
      },
      {
        text: '社交媒体挂人',
        require: (state) => state.trueAbility >= 30,
        requireDesc: '需要真实能力 ≥ 30',
        effect: (state) => ({
          stateChanges: {
            money: state.money + Math.floor(0.5 * 1500),
            mindBody: clamp(state.mindBody - 15, 0, 100),
          },
          extraText: '你的帖子火了。对方社死，被迫转回了50%的奖金。但你发现，挂人的快感只持续了三十分钟，然后你觉得很空虚。',
        }),
      },
    ],
  },

  // ---- 保研论文买卖 ----
  {
    id: 'paper_buying',
    priority: 10,
    category: 'core',
    title: '保研论文是买的',
    trigger: (state) => {
      if (state.currentYear !== 4 || state.currentSemester % 2 !== 1) return false;
      const avgGPA = state.gpaRecords.length > 0
        ? state.gpaRecords.reduce((s, r) => s + r.gradePoint, 0) / state.gpaRecords.length
        : 0;
      return avgGPA >= 3.0 && avgGPA < 3.7;
    },
    text: '保研名单公示了。你发现排在你前面的那个同学，他的论文摘要里把\'machine learning\'拼成了\'machin learning\'。但你听说他的论文是花一万块买的。',
    options: [
      {
        text: '沉默',
        effect: (state) => ({
          stateChanges: {
            mindBody: clamp(state.mindBody - 20, 0, 100),
            trueAbility: clamp(state.trueAbility + 3, 0, 100),
            flags: { ...state.flags, selfstudyHard: true },
          },
          extraText: '你选择了沉默。你开始疯狂备考。你把这次不甘变成了燃料。但夜深人静时你还是会想：凭什么？',
        }),
      },
      {
        text: '举报',
        require: (state) => state.trueAbility >= 50 || state.money >= 8000,
        requireDesc: '需要真实能力 ≥ 50 或金钱 ≥ 8000',
        effect: (state) => {
          if (chance(0.6)) {
            return {
              stateChanges: {},
              extraText: '举报成功了。那个学生的名额被取消了，你替补保研。但你在院里多了一批仇人。正义得到了伸张，但你不确定这算不算胜利。',
            };
          } else {
            return {
              stateChanges: {},
              extraText: '举报被压下来了。院长找你谈话：\'年轻人，不要破坏团结。\'你的名字在某份名单上被标记了。你没保上研，还惹了一身骚。',
            };
          }
        },
      },
      {
        text: '也买一篇 (¥10000-15000)',
        require: (state) => state.money >= 10000,
        requireDesc: '需要金钱 ≥ 10000',
        effect: (state) => {
          const cost = 10000 + Math.floor(Math.random() * 5001);
          if (chance(0.5)) {
            return {
              stateChanges: { money: state.money - cost },
              extraText: '论文到手。你的绩点加了0.3，保研成功。但你知道这篇论文经不起任何推敲。未来的某一天，这可能成为你的定时炸弹。',
            };
          } else {
            return {
              stateChanges: { money: state.money - cost, mindBody: clamp(state.mindBody - 15, 0, 100) },
              extraText: '对方收了钱就消失了。你被骗了。你不能报警——因为买论文本身就是学术不端。你只能咽下这颗苦果。',
            };
          }
        },
      },
    ],
  },

  // ---- 论文灌水投稿邀请 ----
  {
    id: 'paper_mill',
    priority: 10,
    category: 'core',
    title: '论文灌水邀请',
    trigger: (state) => state.currentYear >= 3 && state.trueAbility >= 30,
    text: '你收到一封邮件：\'尊敬的学者，您的学术潜力令人印象深刻。我们诚邀您投稿至《国际前沿学术研究》，版面费2000元，保证录用。\'下面写着：EI收录（待定），知网可查（部分）。',
    options: [
      {
        text: '花钱买署名 (¥2000)',
        effect: (state) => ({
          stateChanges: { money: state.money - 2000 },
          extraText: '你的\'论文\'被录用了。这篇论文的摘要，用ChatGPT三秒就能生成一篇更好的。但它出现在了你的简历上，并且永远不会有人去读。',
        }),
      },
      {
        text: '拒绝并自己写',
        effect: (state) => {
          if (state.trueAbility >= 50) {
            return {
              stateChanges: { trueAbility: clamp(state.trueAbility + 8, 0, 100) },
              energyDeduct: 3,
              extraText: '你花了一个月写了一篇真正的论文，投到了一个正规会议。被录用了。你的简历上多了一行真正值得骄傲的东西。但说实话——这比花钱买辛苦多了。',
            };
          } else {
            return {
              stateChanges: { mindBody: clamp(state.mindBody - 10, 0, 100) },
              energyDeduct: 3,
              extraText: '你试着认真写，但发现自己还差得远。论文被拒了。你开始理解为什么那么多人选择买——因为走正道太难了。',
            };
          }
        },
      },
      {
        text: '一笑置之',
        effect: (state) => ({
          stateChanges: {},
          extraText: '你删掉了邮件。一周后你又收到了三封同样的邀请，来自不同的\'国际期刊\'。',
        }),
      },
    ],
  },

  // ---- 教师拉人创业（ML专属） ----
  {
    id: 'ml_startup',
    priority: 10,
    category: 'core',
    title: '老师拉你创业',
    trigger: (state) => state.currentCourse?.specialRules === 'ml',
    text: '下课后老师叫住了几个同学：\'我在外面有个AI创业项目，缺人手。你们来帮忙，做得好可以拿股份。\'他的眼神很真诚。',
    options: [
      {
        text: '接受邀请',
        effect: (state) => {
          if (chance(0.5)) {
            return {
              stateChanges: { money: state.money + 1500 },
              energyDeduct: 2,
              extraText: '项目拿到了融资，你们每个人分了一笔奖金。老师发了朋友圈感谢团队，虽然配图里没有你。',
            };
          } else {
            return {
              stateChanges: {
                trueAbility: clamp(state.trueAbility + 2, 0, 100),
                mindBody: clamp(state.mindBody - 5, 0, 100),
              },
              energyDeduct: 2,
              extraText: '你为他写了三个月代码。他说\'股份正在分配\'，然后你在他朋友圈看到了新买的特斯拉。你什么都没得到，除了学会了一句话：口头承诺等于零。',
            };
          }
        },
      },
      {
        text: '婉拒',
        effect: (state) => ({
          stateChanges: {},
          extraText: '你婉拒了。一年后你在新闻上看到那家公司倒闭了。创始人跑路，还欠着实习生三个月的工资。你庆幸自己没跳进去。',
        }),
      },
    ],
  },

  // ---- 实习被白嫖 ----
  {
    id: 'intern_exploit',
    priority: 10,
    category: 'core',
    title: '实习白嫖',
    trigger: (state) => state.currentYear >= 3 && state.trueAbility >= 20,
    text: '你找到了一份"知名企业"的实习。面试时HR说"我们更看重成长机会"。入职后发现：没有工资、没有mentor、你的工作是给正式员工取外卖。',
    options: [
      {
        text: '忍了，刷简历',
        effect: (state) => ({
          stateChanges: {
            trueAbility: clamp(state.trueAbility + 1, 0, 100),
            mindBody: clamp(state.mindBody - 15, 0, 100),
          },
          extraText: '你忍了三个月。简历上多了一行"某知名企业实习经历"。但你很清楚，这三个月你什么都没学到，除了哪家外卖送得最快。',
        }),
      },
      {
        text: '辞职走人',
        effect: (state) => ({
          stateChanges: {
            trueAbility: clamp(state.trueAbility + 3, 0, 100),
            mindBody: clamp(state.mindBody + 5, 0, 100),
          },
          extraText: '你果断辞职，用剩下的时间自学。三个月后你比那些还在取外卖的同学强了一大截。但你的简历上少了一行。',
        }),
      },
      {
        text: '找HR谈',
        require: (state) => state.trueAbility >= 40,
        requireDesc: '需要真实能力 ≥ 40',
        effect: (state) => {
          if (chance(0.4)) {
            return {
              stateChanges: { money: state.money + 2000 },
              extraText: '你整理了三个月的工作记录和数据，有理有据地争取到了实习工资。HR脸色很难看，但还是批了。你赢了——虽然整个部门都觉得你"不好惹"。',
            };
          }
          return {
            stateChanges: { mindBody: clamp(state.mindBody - 10, 0, 100) },
            extraText: 'HR微笑着说：\'年轻人不要那么功利。\'然后你的实习期被提前结束了。',
          };
        },
      },
    ],
  },
];
