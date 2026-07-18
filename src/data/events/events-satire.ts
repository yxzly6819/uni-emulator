// ============================================================
// Event data — satire events (5 events)
// ============================================================

import type { GameEvent, EventEffectResult } from '../../types/event';
import type { PlayerState } from '../../types/game';
import { clamp, chance } from '../../engine/utils';

export const satireEvents: GameEvent[] = [
  // ---- 食堂集体食物中毒被捂嘴 ----
  {
    id: 'food_poisoning',
    priority: 5,
    category: 'satire',
    title: '食堂食物中毒',
    trigger: () => true,
    text: '你和二十几个同学吃完食堂后同时腹泻。学校派了辅导员来谈话：\'签个字，拿五十块餐券，这事就过去了。\'',
    options: [
      {
        text: '签字拿餐券',
        effect: (state) => ({
          stateChanges: {
            money: state.money + 50,
            mindBody: clamp(state.mindBody - 10, 0, 100),
          },
          extraText: '你签了字，拿到了五十块餐券。明天你依然要走进那个食堂，因为你没有别的选择。',
        }),
      },
      {
        text: '拒绝并联合发声',
        effect: (state) => {
          const success = chance(0.5);
          if (success) {
            return {
              stateChanges: { mindBody: clamp(state.mindBody - 15, 0, 100) },
              energyDeduct: 2,
              extraText: '你们的联合发声引起了校方重视，食堂卫生得到了整改。你付出了代价，但事情确实变好了一点。',
            };
          } else {
            return {
              stateChanges: { mindBody: clamp(state.mindBody - 15, 0, 100) },
              energyDeduct: 2,
              extraText: '你被记过了。辅导员说：\'你有正义感是好事，但要有大局观。\'你的档案里多了一条记录。',
            };
          }
        },
      },
    ],
  },

  // ---- 水课突击小测 ----
  {
    id: 'pop_quiz',
    priority: 5,
    category: 'satire',
    title: '水课突击小测',
    trigger: (state) => {
      const course = state.currentCourse;
      if (!course) return false;
      return course.type === 'politics' || course.grading === 'easy' || course.grading === 'fixed' || course.grading === 'favor';
    },
    text: '老师突然说：\'把书合上，我们来个小测。\'你看着卷子上的题，觉得每个字都认识，但连起来不知道在问什么。',
    noOptionEffect: (state) => ({
      stateChanges: { mindBody: clamp(state.mindBody - 5, 0, 100) },
      extraText: '你硬着头皮写满了卷子。老师扫了一眼，打了一个不高不低的分数。隔壁同学抄了你的，分数比你还高。',
    }),
  },

  // ---- 综测加分闹剧 ----
  {
    id: 'comprehensive_score',
    priority: 5,
    category: 'satire',
    title: '综测加分闹剧',
    trigger: () => true,
    text: '辅导员在群里发通知：参加校园跑、听讲座、当志愿者，都可以加综测分。你跑了一个月，膝盖隐隐作痛。',
    noOptionEffect: (state) => ({
      stateChanges: { mindBody: clamp(state.mindBody - 5, 0, 100) },
      extraText: '学期末你发现，有人用模拟器刷了全勤。你的真实付出，比不上别人的脚本。',
    }),
  },

  // ---- 学术讲座强制签到 ----
  {
    id: 'lecture_signin',
    priority: 5,
    category: 'satire',
    title: '学术讲座强制签到',
    trigger: () => true,
    text: '辅导员通知：\'今晚七点学术报告厅，必须签到，计入平时成绩。\'讲座题目是：《区块链赋能乡村振兴》。',
    options: [
      {
        text: '去',
        effect: (state) => ({
          stateChanges: {},
          energyDeduct: 1,
          extraText: '讲座的核心内容是推销他的1999元网课。你旁边的同学睡得很香，睡到打呼噜被主讲人瞪了一眼。',
        }),
      },
      {
        text: '溜号',
        effect: (state) => {
          if (chance(0.3)) {
            return {
              stateChanges: { mindBody: clamp(state.mindBody - 3, 0, 100) },
              extraText: '辅导员查到了你。他说：\'下次注意。\'语气平静但眼神让人发冷。',
            };
          }
          return {
            stateChanges: {},
            extraText: '你成功溜掉了。室友说讲座很无聊，你很庆幸自己的选择。',
          };
        },
      },
    ],
  },

  // ---- 辅导员突袭查寝 ----
  {
    id: 'dorm_check',
    priority: 5,
    category: 'satire',
    title: '辅导员突袭查寝',
    trigger: () => true,
    text: '晚上十点，辅导员突然出现在寝室门口：\'查寝，看看有没有违规电器。\'你的室友正在用电饭锅煮泡面。',
    options: [
      {
        text: '藏起来',
        effect: (state) => ({
          stateChanges: {},
          extraText: '电饭锅被塞进了衣柜，泡面洒了一地。辅导员环顾一周，什么也没发现，走了。你的袜子被泡面汤泡了。',
        }),
      },
      {
        text: '认错',
        effect: (state) => ({
          stateChanges: { mindBody: clamp(state.mindBody - 5, 0, 100) },
          extraText: '辅导员收了电饭锅，记了一次通报批评。你室友瞪了你一周。',
        }),
      },
    ],
    repeatable: true,
  },

  // ---- 选课系统崩溃 ----
  {
    id: 'course_snatch',
    priority: 5,
    category: 'satire',
    title: '选课系统崩溃',
    trigger: () => true,
    text: '选课系统在你点下"提交"的瞬间崩溃了。你刷新了四十分钟，再进去时，你想选的课已经满了。只剩下《昆虫分类学》和《殡葬礼仪实务》。',
    options: [
      {
        text: '将就选一门',
        effect: (state) => ({
          stateChanges: { mindBody: clamp(state.mindBody - 10, 0, 100) },
          extraText: '你选了一门你完全不感兴趣的课。老师比你还不感兴趣。一学期下来，你学到了蟋蟀有几种分类方法。',
        }),
      },
      {
        text: '找教务处哭诉',
        effect: (state) => {
          if (chance(0.4)) {
            return {
              stateChanges: {},
              extraText: '教务处的老师竟然帮你手动加上了。她说：\'下次早点。\'你连声道谢，虽然你知道根本不是你的问题。',
            };
          }
          return {
            stateChanges: { mindBody: clamp(state.mindBody - 5, 0, 100) },
            extraText: '教务处让你填了三张表，最后还是告诉你名额已满。你白跑了一上午。',
          };
        },
      },
    ],
    repeatable: true,
  },

  // ---- 家长电话压力 ----
  {
    id: 'parent_phone',
    priority: 5,
    category: 'satire',
    title: '家长电话',
    trigger: (state) => state.currentYear >= 3 && state.mindBody < 50,
    text: '你妈打来电话：\'最近学习怎么样？\'你说在复习。实际上你刚关掉刷了一下午的短视频。挂了电话，你盯着天花板，不知道自己在干什么。',
    noOptionEffect: (state) => ({
      stateChanges: { mindBody: clamp(state.mindBody - 10, 0, 100) },
      extraText: '你打开课本，看了五分钟，又拿起了手机。',
    }),
  },
];
