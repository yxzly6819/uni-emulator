// ============================================================
// Event data — daily events (8 events)
// ============================================================

import type { GameEvent, EventEffectResult } from '../../types/event';
import type { PlayerState } from '../../types/game';
import { clamp } from '../../engine/utils';

function noopEffect(state: PlayerState): EventEffectResult {
  return { stateChanges: {}, extraText: '' };
}

export const dailyEvents: GameEvent[] = [
  // ---- 外卖被偷 ----
  {
    id: 'stolen_food',
    priority: 1,
    category: 'daily',
    title: '外卖被偷',
    trigger: () => true,
    text: '你回到宿舍，发现外卖不见了。你在室友的垃圾袋里看到了疑似你外卖的残骸，但没有证据。',
    noOptionEffect: (state) => ({
      stateChanges: { money: state.money - 25, mindBody: clamp(state.mindBody - 5, 0, 100) },
      extraText: '你饿着肚子睡了。明天还有早八。',
    }),
    repeatable: true,
  },

  // ---- 恋爱 ----
  {
    id: 'romance',
    priority: 1,
    category: 'daily',
    title: '恋爱',
    trigger: (state) => !state.flags.hasLove,
    text: '你在图书馆遇到一个聊得来的人。你们从黑格尔聊到食堂哪家好吃。对方递给你一包纸巾，说：\'你嘴角有饭粒。\'',
    noOptionEffect: (state) => ({
      stateChanges: {
        mindBody: clamp(state.mindBody + 15, 0, 100),
        flags: { ...state.flags, hasLove: true, loveCostActive: true },
      },
      extraText: '你觉得大学好像也没那么糟糕。但你的钱包以后每个月都会瘦200块。',
    }),
  },

  // ---- 分手 ----
  {
    id: 'breakup',
    priority: 1,
    category: 'daily',
    title: '分手',
    trigger: (state) => state.flags.hasLove,
    text: '对方发来一条消息：\'我们不太合适。\'你把对方删了，但深夜还是忍不住点开头像看。对方已经换了情侣头像。',
    noOptionEffect: (state) => ({
      stateChanges: {
        mindBody: clamp(state.mindBody - 20, 0, 100),
        flags: { ...state.flags, hasLove: false, loveCostActive: false },
      },
      extraText: '你删了所有的合照，然后从回收站里恢复了三遍。',
    }),
  },

  // ---- 感冒/生病 ----
  {
    id: 'sick',
    priority: 1,
    category: 'daily',
    title: '感冒',
    trigger: () => true,
    text: '你在校医院排了两小时队，医生给你开了三盒中成药。总共90块。你说谢谢，医生说：下一个。',
    noOptionEffect: (state) => ({
      stateChanges: {
        money: state.money - 90,
        mindBody: clamp(state.mindBody - 15, 0, 100),
      },
      extraText: '你吃完药睡了一整天，醒来发现自己错过了三次点名。',
    }),
    repeatable: true,
  },

  // ---- 受伤 ----
  {
    id: 'injured',
    priority: 1,
    category: 'daily',
    title: '受伤',
    trigger: () => true,
    text: '你在操场上跑步，踩到一个没盖好的井盖。校医院说：\'软组织挫伤，休息一周。\'',
    noOptionEffect: (state) => ({
      stateChanges: {
        money: state.money - 100,
        mindBody: clamp(state.mindBody - 10, 0, 100),
        flags: { ...state.flags, injured: true },
      },
      extraText: '本半学期竞赛/项目不可选。',
    }),
    repeatable: true,
  },

  // ---- 搬宿舍 ----
  {
    id: 'dorm_move',
    priority: 1,
    category: 'daily',
    title: '搬宿舍',
    trigger: () => true,
    text: '辅导员通知你搬宿舍。你的新室友养了一只仓鼠，仓鼠的笼子占据了你的书桌。',
    noOptionEffect: (state) => ({
      stateChanges: { mindBody: clamp(state.mindBody - 10, 0, 100) },
      energyDeduct: 1,
      extraText: '你花了一整天搬东西，腰酸背痛。',
    }),
  },

  // ---- 室友打呼噜 ----
  {
    id: 'snoring',
    priority: 1,
    category: 'daily',
    title: '室友打呼噜',
    trigger: () => true,
    text: '凌晨三点，室友的呼噜声穿透了你的降噪耳机。你开始理解为什么有人在图书馆过夜。',
    options: [
      {
        text: '买耳塞',
        effect: (state) => ({
          stateChanges: { money: state.money - 30 },
          extraText: '耳塞效果不错，虽然还是有隐约的低音炮。',
        }),
      },
      {
        text: '忍着',
        effect: (state) => ({
          stateChanges: { mindBody: clamp(state.mindBody - 5, 0, 100) },
          extraText: '你在床上翻来覆去，天亮的时候终于睡着了。',
        }),
      },
    ],
    repeatable: true,
  },

  // ---- 快递丢失 ----
  {
    id: 'lost_package',
    priority: 1,
    category: 'daily',
    title: '快递丢失',
    trigger: () => true,
    text: '菜鸟驿站说你的快递被误取了。你翻遍了所有货架，只找到一个和你同名的——里面是两包猫粮。你没有猫。',
    noOptionEffect: (state) => ({
      stateChanges: { money: state.money - 60, mindBody: clamp(state.mindBody - 5, 0, 100) },
      extraText: '你投诉了三天，最后不了了之。',
    }),
    repeatable: true,
  },

  // ---- 校园网崩溃 ----
  {
    id: 'network_down',
    priority: 1,
    category: 'daily',
    title: '校园网崩溃',
    trigger: () => true,
    text: '校园网在提交作业截止前半小时崩溃了。信息中心说"正在抢修"。你端着电脑在宿舍楼道里寻找那一个微弱的WiFi信号。',
    options: [
      {
        text: '去图书馆蹭网',
        effect: (state) => ({
          stateChanges: {},
          energyDeduct: 1,
          extraText: '你在图书馆门口排了二十分钟才找到一个座位。作业终于交上了。',
        }),
      },
      {
        text: '用手机热点',
        effect: (state) => ({
          stateChanges: { money: state.money - 30 },
          extraText: '你花掉了这个月的流量包。作业是交了，但下个月只能蹭室友的网了。',
        }),
      },
    ],
    repeatable: true,
  },

  // ---- 遇到好老师 ----
  {
    id: 'good_teacher',
    priority: 1,
    category: 'daily',
    title: '遇到好老师',
    trigger: () => true,
    text: '一个老教授在下课后叫住你，认真点评了你的作业。他说：\'你很有想法，不要浪费了。\'原来学校还是有认真教书的人。',
    noOptionEffect: (state) => ({
      stateChanges: {
        trueAbility: clamp(state.trueAbility + 2, 0, 100),
        mindBody: clamp(state.mindBody + 5, 0, 100),
      },
      extraText: '你感到一丝珍贵的希望。这种希望在下一节课被念PPT的老师成功扑灭了。',
    }),
  },
];
