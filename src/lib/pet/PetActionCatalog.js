import {
  PetStates,
} from "./PetStates.js";


const defineAction =
  (
    id,
    states,
    tags = [],
    {
      weight = 1,
      loop = null,
      priority = 0,
    } = {}
  ) => ({
    id,
    states,
    tags,
    weight,
    loop,
    priority,
  });


/*
 * ============================================================
 * DSH Action Catalog
 * ============================================================
 *
 * 这里登记 public/pets/dsh 中的 101 个动作。
 *
 * 注意：
 * - 这里只根据动作名称做行为分类。
 * - 不分析具体帧内容。
 * - 一个动作允许属于多个状态。
 * - tags 为以后 AI 情绪联动预留。
 */
export const PetActionCatalog =
  Object.freeze([

    /*
     * ========================================================
     * 001 - 010
     * ========================================================
     */

    defineAction(
      "三球抛接",
      [
        PetStates.IDLE,
      ],
      [
        "play",
        "calm",
        "ambient",
      ],
      {
        weight: 2,
      }
    ),

    defineAction(
      "下五子棋",
      [
        PetStates.IDLE,
        PetStates.THINKING,
      ],
      [
        "thinking",
        "calm",
        "game",
      ]
    ),

    defineAction(
      "东张西望",
      [
        PetStates.IDLE,
      ],
      [
        "curious",
        "ambient",
        "look-around",
      ],
      {
        weight: 4,
      }
    ),

    defineAction(
      "中秋赏月吃月饼",
      [
        PetStates.SPECIAL,
      ],
      [
        "festival",
        "mid-autumn",
        "food",
      ]
    ),

    defineAction(
      "优雅女仆舞",
      [
        PetStates.EMOTION,
        PetStates.SPECIAL,
      ],
      [
        "happy",
        "dance",
        "elegant",
      ]
    ),

    defineAction(
      "余额-分文不剩",
      [
        PetStates.ERROR,
        PetStates.SPECIAL,
      ],
      [
        "money",
        "poor",
        "sad",
      ]
    ),

    defineAction(
      "余额-数金皱眉",
      [
        PetStates.THINKING,
        PetStates.SPECIAL,
      ],
      [
        "money",
        "thinking",
        "concerned",
      ]
    ),

    defineAction(
      "余额-袋空如洗",
      [
        PetStates.ERROR,
        PetStates.SPECIAL,
      ],
      [
        "money",
        "empty",
        "sad",
      ]
    ),

    defineAction(
      "余额-金袋叮当",
      [
        PetStates.EMOTION,
        PetStates.SPECIAL,
      ],
      [
        "money",
        "happy",
        "positive",
      ]
    ),

    defineAction(
      "余额-钱袋如常",
      [
        PetStates.SPECIAL,
      ],
      [
        "money",
        "neutral",
      ]
    ),


    /*
     * ========================================================
     * 011 - 020
     * ========================================================
     */

    defineAction(
      "余额-钱袋满溢",
      [
        PetStates.EMOTION,
        PetStates.SPECIAL,
      ],
      [
        "money",
        "happy",
        "success",
      ]
    ),

    defineAction(
      "偷吃零食被抓住",
      [
        PetStates.INTERACT,
        PetStates.REACTION,
      ],
      [
        "surprised",
        "caught",
        "funny",
      ]
    ),

    defineAction(
      "写代码",
      [
        PetStates.THINKING,
        PetStates.SPECIAL,
      ],
      [
        "coding",
        "focused",
        "work",
      ],
      {
        weight: 3,
      }
    ),

    defineAction(
      "写福字",
      [
        PetStates.SPECIAL,
      ],
      [
        "festival",
        "new-year",
        "writing",
      ]
    ),

    defineAction(
      "凭空生花",
      [
        PetStates.EMOTION,
        PetStates.REACTION,
      ],
      [
        "happy",
        "magic",
        "positive",
      ]
    ),

    defineAction(
      "动物环绕",
      [
        PetStates.REACTION,
        PetStates.SPECIAL,
      ],
      [
        "animals",
        "magic",
        "cute",
      ]
    ),

    defineAction(
      "原地专心玩魔方",
      [
        PetStates.IDLE,
        PetStates.THINKING,
      ],
      [
        "thinking",
        "focused",
        "game",
      ],
      {
        weight: 2,
      }
    ),

    defineAction(
      "原地小憩沉眠",
      [
        PetStates.IDLE,
      ],
      [
        "sleepy",
        "sleep",
        "calm",
      ],
      {
        weight: 2,
      }
    ),

    defineAction(
      "原地左转奔跑",
      [
        PetStates.WALKING,
      ],
      [
        "move",
        "running",
        "energetic",
      ]
    ),

    defineAction(
      "原地敲击桌面互动",
      [
        PetStates.INTERACT,
      ],
      [
        "interaction",
        "attention",
        "playful",
      ],
      {
        weight: 3,
      }
    ),


    /*
     * ========================================================
     * 021 - 030
     * ========================================================
     */

    defineAction(
      "原地漂浮踏步",
      [
        PetStates.WALKING,
      ],
      [
        "move",
        "floating",
      ]
    ),

    defineAction(
      "原地跳跃抓碎头顶物品",
      [
        PetStates.INTERACT,
        PetStates.REACTION,
      ],
      [
        "jump",
        "reaction",
        "energetic",
      ]
    ),

    defineAction(
      "原地蹲下玩玩具汽车",
      [
        PetStates.IDLE,
      ],
      [
        "play",
        "toy",
        "calm",
      ]
    ),

    defineAction(
      "原地重力下蹲压缩",
      [
        PetStates.REACTION,
      ],
      [
        "impact",
        "reaction",
        "funny",
      ]
    ),

    defineAction(
      "变鸽子",
      [
        PetStates.REACTION,
        PetStates.SPECIAL,
      ],
      [
        "transform",
        "funny",
        "magic",
      ]
    ),

    defineAction(
      "可爱宅舞",
      [
        PetStates.EMOTION,
        PetStates.SPECIAL,
      ],
      [
        "happy",
        "dance",
        "cute",
      ]
    ),

    defineAction(
      "吃Token",
      [
        PetStates.SPECIAL,
      ],
      [
        "ai",
        "token",
        "food",
        "funny",
      ]
    ),

    defineAction(
      "吃冰淇淋融化",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "ice-cream",
        "summer",
      ]
    ),

    defineAction(
      "吃午餐",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "lunch",
      ]
    ),

    defineAction(
      "吃大闸蟹",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "crab",
      ]
    ),


    /*
     * ========================================================
     * 031 - 040
     * ========================================================
     */

    defineAction(
      "吃年糕",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "festival",
      ]
    ),

    defineAction(
      "吃早餐",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "breakfast",
      ]
    ),

    defineAction(
      "吃晚餐",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "dinner",
      ]
    ),

    defineAction(
      "吃汤圆",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "festival",
      ]
    ),

    defineAction(
      "吃白饭",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "meal",
      ]
    ),

    defineAction(
      "吃粽子",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "festival",
        "dragon-boat",
      ]
    ),

    defineAction(
      "吃糖葫芦",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "snack",
      ]
    ),

    defineAction(
      "吃腊八粥",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "festival",
      ]
    ),

    defineAction(
      "吃西瓜",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "summer",
      ]
    ),

    defineAction(
      "吃重阳糕",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "festival",
      ]
    ),


    /*
     * ========================================================
     * 041 - 050
     * ========================================================
     */

    defineAction(
      "吃长寿面",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "birthday",
      ]
    ),

    defineAction(
      "吃青团",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "festival",
      ]
    ),

    defineAction(
      "吃饺子",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "festival",
      ]
    ),

    defineAction(
      "吹气球",
      [
        PetStates.SPECIAL,
      ],
      [
        "play",
        "balloon",
      ]
    ),

    defineAction(
      "吹笛子",
      [
        PetStates.SPECIAL,
      ],
      [
        "music",
        "performance",
      ]
    ),

    defineAction(
      "哈欠连天",
      [
        PetStates.IDLE,
      ],
      [
        "sleepy",
        "tired",
      ],
      {
        weight: 3,
      }
    ),

    defineAction(
      "大口吃零食",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "snack",
      ]
    ),

    defineAction(
      "女仆屈膝礼仪",
      [
        PetStates.INTERACT,
        PetStates.EMOTION,
      ],
      [
        "greeting",
        "elegant",
        "polite",
      ]
    ),

    defineAction(
      "小幅度原地360度旋转展示",
      [
        PetStates.SPECIAL,
        PetStates.INTERACT,
      ],
      [
        "showcase",
        "turn",
      ]
    ),

    defineAction(
      "小提琴演奏",
      [
        PetStates.SPECIAL,
      ],
      [
        "music",
        "performance",
      ]
    ),


    /*
     * ========================================================
     * 051 - 060
     * ========================================================
     */

    defineAction(
      "工作状态-原地踱步张望",
      [
        PetStates.THINKING,
      ],
      [
        "thinking",
        "focused",
        "work",
      ],
      {
        weight: 3,
      }
    ),

    defineAction(
      "工作状态-垂头叹气冒汗",
      [
        PetStates.ERROR,
        PetStates.EMOTION,
      ],
      [
        "sad",
        "frustrated",
        "error",
      ],
      {
        weight: 4,
      }
    ),

    defineAction(
      "工作状态-忙碌点按",
      [
        PetStates.SPEAKING,
        PetStates.THINKING,
      ],
      [
        "work",
        "busy",
        "focused",
      ],
      {
        weight: 4,
      }
    ),

    defineAction(
      "工作状态-思考冒泡",
      [
        PetStates.THINKING,
      ],
      [
        "thinking",
        "focused",
        "curious",
      ],
      {
        weight: 5,
      }
    ),

    defineAction(
      "工作状态-清点归档",
      [
        PetStates.SPEAKING,
      ],
      [
        "work",
        "organize",
        "focused",
      ],
      {
        weight: 3,
      }
    ),

    defineAction(
      "工作状态-雀跃庆祝",
      [
        PetStates.EMOTION,
      ],
      [
        "happy",
        "success",
        "celebrate",
      ],
      {
        weight: 5,
      }
    ),

    defineAction(
      "待机呼吸休闲",
      [
        PetStates.IDLE,
      ],
      [
        "neutral",
        "calm",
        "ambient",
      ],
      {
        weight: 7,
      }
    ),

    defineAction(
      "悠闲哼歌",
      [
        PetStates.IDLE,
      ],
      [
        "happy",
        "calm",
        "music",
      ],
      {
        weight: 3,
      }
    ),

    defineAction(
      "扑克魔术",
      [
        PetStates.SPECIAL,
      ],
      [
        "magic",
        "performance",
      ]
    ),

    defineAction(
      "打瞌睡被惊醒",
      [
        PetStates.INTERACT,
        PetStates.REACTION,
      ],
      [
        "sleepy",
        "surprised",
        "reaction",
      ]
    ),


    /*
     * ========================================================
     * 061 - 070
     * ========================================================
     */

    defineAction(
      "抽陀螺",
      [
        PetStates.IDLE,
        PetStates.SPECIAL,
      ],
      [
        "play",
        "toy",
      ]
    ),

    defineAction(
      "插茱萸赏菊",
      [
        PetStates.SPECIAL,
      ],
      [
        "festival",
        "double-ninth",
      ]
    ),

    defineAction(
      "摇扇纳凉",
      [
        PetStates.IDLE,
        PetStates.SPECIAL,
      ],
      [
        "summer",
        "calm",
        "relax",
      ]
    ),

    defineAction(
      "撸猫",
      [
        PetStates.IDLE,
      ],
      [
        "cat",
        "calm",
        "cute",
      ],
      {
        weight: 2,
      }
    ),

    defineAction(
      "收红包",
      [
        PetStates.EMOTION,
        PetStates.SPECIAL,
      ],
      [
        "happy",
        "festival",
        "money",
      ]
    ),

    defineAction(
      "放孔明灯",
      [
        PetStates.SPECIAL,
      ],
      [
        "festival",
        "lantern",
      ]
    ),

    defineAction(
      "放河灯",
      [
        PetStates.SPECIAL,
      ],
      [
        "festival",
        "lantern",
      ]
    ),

    defineAction(
      "放烟花",
      [
        PetStates.SPECIAL,
      ],
      [
        "festival",
        "fireworks",
        "celebrate",
      ]
    ),

    defineAction(
      "整体换装试色",
      [
        PetStates.REACTION,
        PetStates.SPECIAL,
      ],
      [
        "transform",
        "outfit",
      ]
    ),

    defineAction(
      "是啊，吃什么",
      [
        PetStates.THINKING,
        PetStates.IDLE,
      ],
      [
        "thinking",
        "food",
        "confused",
      ]
    ),


    /*
     * ========================================================
     * 071 - 080
     * ========================================================
     */

    defineAction(
      "晨间刷牙",
      [
        PetStates.SPECIAL,
      ],
      [
        "daily",
        "morning",
      ]
    ),

    defineAction(
      "涮火锅",
      [
        PetStates.SPECIAL,
      ],
      [
        "food",
        "hotpot",
      ]
    ),

    defineAction(
      "深度思考碎碎念",
      [
        PetStates.THINKING,
      ],
      [
        "thinking",
        "focused",
        "deep",
      ],
      {
        weight: 5,
      }
    ),

    defineAction(
      "点击回应-傲娇生气",
      [
        PetStates.INTERACT,
        PetStates.EMOTION,
      ],
      [
        "angry",
        "interaction",
        "tsundere",
      ],
      {
        weight: 3,
      }
    ),

    defineAction(
      "点击回应-元气挥手",
      [
        PetStates.INTERACT,
        PetStates.EMOTION,
      ],
      [
        "happy",
        "greeting",
        "interaction",
      ],
      {
        weight: 5,
      }
    ),

    defineAction(
      "点击回应-害羞惊讶",
      [
        PetStates.INTERACT,
        PetStates.EMOTION,
      ],
      [
        "shy",
        "surprised",
        "interaction",
      ],
      {
        weight: 4,
      }
    ),

    defineAction(
      "点击回应-开心跃动",
      [
        PetStates.INTERACT,
        PetStates.EMOTION,
      ],
      [
        "happy",
        "energetic",
        "interaction",
      ],
      {
        weight: 5,
      }
    ),

    defineAction(
      "点击回应-挠痒咯咯笑",
      [
        PetStates.INTERACT,
        PetStates.EMOTION,
      ],
      [
        "happy",
        "funny",
        "interaction",
      ],
      {
        weight: 5,
      }
    ),

    defineAction(
      "照镜子",
      [
        PetStates.IDLE,
      ],
      [
        "daily",
        "calm",
      ]
    ),

    defineAction(
      "玩水枪",
      [
        PetStates.INTERACT,
        PetStates.SPECIAL,
      ],
      [
        "play",
        "summer",
        "energetic",
      ]
    ),


    /*
     * ========================================================
     * 081 - 090
     * ========================================================
     */

    defineAction(
      "玩游戏气急败坏",
      [
        PetStates.ERROR,
        PetStates.EMOTION,
      ],
      [
        "angry",
        "frustrated",
        "game",
      ],
      {
        weight: 3,
      }
    ),

    defineAction(
      "用鲸鱼尾巴拍打地面",
      [
        PetStates.REACTION,
      ],
      [
        "impact",
        "whale",
        "energetic",
      ]
    ),

    defineAction(
      "碎碎念-发呆碎碎念",
      [
        PetStates.IDLE,
      ],
      [
        "idle",
        "talking",
        "calm",
      ],
      {
        weight: 3,
      }
    ),

    defineAction(
      "碎碎念-对屏碎碎念",
      [
        PetStates.SPEAKING,
      ],
      [
        "speaking",
        "screen",
        "talking",
      ],
      {
        weight: 6,
      }
    ),

    defineAction(
      "碎碎念-擦桌碎碎念",
      [
        PetStates.SPEAKING,
        PetStates.IDLE,
      ],
      [
        "speaking",
        "daily",
        "talking",
      ],
      {
        weight: 3,
      }
    ),

    defineAction(
      "穿针乞巧",
      [
        PetStates.SPECIAL,
      ],
      [
        "festival",
        "qixi",
      ]
    ),

    defineAction(
      "舞狮头",
      [
        PetStates.SPECIAL,
      ],
      [
        "festival",
        "lion-dance",
        "energetic",
      ]
    ),

    defineAction(
      "荡秋千",
      [
        PetStates.IDLE,
      ],
      [
        "play",
        "relax",
        "calm",
      ]
    ),

    defineAction(
      "萌化小幽灵",
      [
        PetStates.REACTION,
        PetStates.SPECIAL,
      ],
      [
        "ghost",
        "cute",
        "transform",
      ]
    ),

    defineAction(
      "蓝鲸现世",
      [
        PetStates.REACTION,
        PetStates.SPECIAL,
      ],
      [
        "whale",
        "magic",
        "dramatic",
      ]
    ),


    /*
     * ========================================================
     * 091 - 101
     * ========================================================
     */

    defineAction(
      "蝴蝶蜜蜂环绕头顶开花",
      [
        PetStates.EMOTION,
        PetStates.REACTION,
      ],
      [
        "happy",
        "flowers",
        "positive",
      ]
    ),

    defineAction(
      "螃蟹走路",
      [
        PetStates.WALKING,
      ],
      [
        "move",
        "funny",
        "walking",
      ]
    ),

    defineAction(
      "被吓一跳",
      [
        PetStates.INTERACT,
        PetStates.REACTION,
      ],
      [
        "surprised",
        "scared",
        "reaction",
      ]
    ),

    defineAction(
      "被落叶淹没",
      [
        PetStates.REACTION,
      ],
      [
        "leaves",
        "reaction",
        "funny",
      ]
    ),

    defineAction(
      "被鼠标拖拽悬空反馈",
      [
        PetStates.DRAGGING,
      ],
      [
        "dragging",
        "mouse",
      ],
      {
        weight: 10,
        loop: true,
        priority: 100,
      }
    ),

    defineAction(
      "装点圣诞树",
      [
        PetStates.SPECIAL,
      ],
      [
        "festival",
        "christmas",
      ]
    ),

    defineAction(
      "讨糖南瓜灯",
      [
        PetStates.SPECIAL,
      ],
      [
        "festival",
        "halloween",
      ]
    ),

    defineAction(
      "超大伸懒腰",
      [
        PetStates.IDLE,
      ],
      [
        "stretch",
        "relax",
        "sleepy",
      ],
      {
        weight: 3,
      }
    ),

    defineAction(
      "轻快摇摆舞",
      [
        PetStates.EMOTION,
        PetStates.SPECIAL,
      ],
      [
        "happy",
        "dance",
        "positive",
      ]
    ),

    defineAction(
      "轻快记录",
      [
        PetStates.SPEAKING,
      ],
      [
        "work",
        "writing",
        "focused",
      ],
      {
        weight: 4,
      }
    ),

    defineAction(
      "鲸鱼吐泡泡特效",
      [
        PetStates.REACTION,
        PetStates.SPECIAL,
      ],
      [
        "whale",
        "bubble",
        "magic",
      ]
    ),
  ]);


export function getActionsForState(
  state
) {

  return PetActionCatalog.filter(
    (action) =>
      action.states.includes(
        state
      )
  );
}


export function getActionDefinition(
  id
) {

  return (
    PetActionCatalog.find(
      (action) =>
        action.id === id
    ) ??
    null
  );
}


export function getActionsByTags(
  tags = []
) {

  const requestedTags =
    Array.isArray(tags)
      ? tags.filter(Boolean)
      : [];


  if (
    requestedTags.length === 0
  ) {
    return [
      ...PetActionCatalog,
    ];
  }


  return PetActionCatalog.filter(
    (action) =>
      requestedTags.every(
        (tag) =>
          action.tags.includes(
            tag
          )
      )
  );
}