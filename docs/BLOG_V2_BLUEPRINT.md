# FJK Blog Desktop Pet — Project Blueprint

> 项目最终蓝图 / 当前进度 / 架构决策 / 恢复上下文入口  
>  
> 本文档是本项目的 **Single Source of Truth**。  
> 如果开发对话、AI 上下文或临时记录丢失，新的开发会话必须优先阅读本文档，再继续开发。
>
> **原则：本文档同时描述“最终目标”和“当前实际状态”，两者不得混淆。**

---

# 1. 项目基本信息

## 1.1 项目

个人 Astro 博客 + AI 桌宠系统。

核心目标不是简单加入一个动画角色，而是最终实现：

- 可交互桌宠
- AI 多轮聊天
- 稳定人物人格
- 有“人味”的聊天表达
- 情绪变化
- 行为变化
- 情绪与动画联动
- 人格与动画联动
- 后续可扩展记忆
- 后续可扩展更多角色
- 后续可替换动作资源包

最终桌宠应当同时具备：

```text
会说话
+
有稳定人格
+
有情绪
+
会根据情绪产生行为
+
行为通过动画表现
```

---

# 2. 项目环境

## 2.1 本地项目

```text
D:\Personal Blog
```

技术栈：

```text
Astro 7
TypeScript
Tailwind CSS 4
Static Build
```

GitHub：

```text
https://github.com/jiashuaifu13-blip/fjk-blog.git
```

线上地址：

```text
https://fjksp.cn
```

---

# 3. 服务器环境

服务器目前：

```text
CentOS 7.6
Kernel 3.10
Nginx 1.20.1
```

SSH 用户：

```text
fjkadmin
```

静态网站目录：

```text
/var/www/personal-blog
```

后端：

```text
/opt/fjk-chat
```

Go：

```text
/usr/local/go/bin/go
```

版本：

```text
Go 1.20.14
```

后端监听：

```text
127.0.0.1:8787
```

systemd：

```text
/etc/systemd/system/fjk-chat.service
```

服务：

```text
fjk-chat
```

当前服务应保持：

```text
enabled
active
```

---

# 4. API 架构

公开接口：

```text
/api/health
/api/chat
```

Nginx：

```text
/api/health
    ↓
127.0.0.1:8787/health
```

```text
/api/chat
    ↓
127.0.0.1:8787/api/chat
```

聊天接口采用流式返回。

当前已验证：

```text
NDJSON Streaming
```

可使用的 AI Provider：

```text
DeepSeek
OpenAI
OpenRouter
```

已经测试：

```text
DeepSeek
deepseek-flash
```

---

# 5. 多轮聊天状态

多轮上下文已经修复并验证。

服务器日志曾确认：

```text
context_messages=1
context_messages=3
context_messages=5
context_messages=7
```

说明聊天历史能够正确增长。

---

# 6. 当前前端桌宠入口

主要组件：

```text
src/components/pet/DesktopPet.astro
```

全局布局：

```text
src/layouts/Layout.astro
```

`DesktopPet` 当前挂载在：

```text
Footer
之后
```

---

# 7. 当前桌宠资源

主资源包：

```text
public/pets/dsh
```

该资源包当前正式使用。

扩展资源：

```text
public/pets/dsh1
```

当前不要修改，保留后续使用。

---

# 8. dsh 动作资源状态

当前：

```text
actions.json         101
spritesheet json     101
missing webp         0
```

即：

```text
101 个动作全部已接入
```

---

# 9. 当前桌宠核心模块

主要位于：

```text
src/lib/pet/
```

核心模块包括：

```text
PetDataLoader
AnimationLibrary
AnimationCache
PetRenderer
PetAnimator
PetAudioManager

PetStates
PetStateMachine

PetActionCatalog
PetActionSelector

PetHitTest
PetInteractionController
```

---

# 10. 当前动作架构

已经确定：

```text
State
  ↓
Action Category / Action Pool
  ↓
Concrete Animation
```

不得退回：

```text
State
→ 固定动画
```

这种旧结构。

---

# 11. 当前 PetStates

当前语义状态：

```text
BOOT
IDLE
THINKING
SPEAKING
WALKING
INTERACT
EMOTION
REACTION
SPECIAL
DRAGGING
ERROR
```

说明：

`State` 表示桌宠当前主要在做什么。

以后不会用 `State` 单独承担全部人格和情绪信息。

---

# 12. 当前动作分类原则

动作分类只能根据：

```text
动作名称
动作语义
```

进行。

不得通过单帧图片或声音文件主观重新解释动作含义。

---

# 13. 当前已经稳定的桌宠功能

以下功能属于 **非回归项**。

未来修改不得破坏。

## Canvas

桌宠使用 Canvas Renderer。

## Canvas 性能

启用：

```text
willReadFrequently
```

---

## Alpha Hit Test

透明区域穿透使用：

```text
alphaThreshold = 25
```

---

## 真透明点击穿透

必须保持：

```text
document capture pointer handling
```

桌宠透明区域不能阻挡网页本身。

---

## Pointer Events

必须保持：

```text
desktop-pet root
pointer-events: none
```

```text
canvas
pointer-events: none
```

语音气泡：

```text
pointer-events: auto
```

---

## Drag

已经支持：

```text
拖拽
Viewport Clamp
localStorage 保存位置
```

---

## Drag Animation

拖拽时必须使用：

```text
被鼠标拖拽悬空反馈
```

拖拽已经确认稳定。

---

## Drag 性能优化

`pointermove` 不再阻塞等待状态机。

拖动位置使用：

```text
requestAnimationFrame batching
```

包含：

```text
pendingLeft
pendingTop
dragFrameId
scheduleDragFrame
flushDragPosition
flushFinalDragPosition
```

pointerup 必须 flush 最终位置。

---

## Drag CSS

拖拽过程中必须保持：

```css
.desktop-pet[data-dragging="true"] {
  transition: none;
}
```

---

# 14. 点击交互状态

点击交互目前已经稳定。

已确认能够随机出现：

```text
原地敲击桌面互动

原地跳跃抓碎头顶物品

点击回应-傲娇生气

点击回应-元气挥手

点击回应-害羞惊讶

点击回应-开心跃动

点击回应-挠痒咯咯笑

偷吃零食被抓住

打瞌睡被惊醒

被吓一跳

玩水枪

女仆屈膝礼仪

小幅度原地360度旋转展示
```

---

# 15. 当前实时预热机制

当前实时预热状态已经确认正常。

实时状态：

```text
DRAGGING
INTERACT
THINKING
SPEAKING
```

浏览器调试结果：

```text
28 条 realtime state/action mapping
全部 cached = true
```

其中：

```text
DRAGGING    1
INTERACT   13
THINKING    9
SPEAKING    5
```

注意：

某些动作可以同时属于多个 State。

例如：

```text
工作状态-忙碌点按
```

同时属于：

```text
THINKING
SPEAKING
```

AnimationCache 应避免重复加载。

---

# 16. 当前缓存性能测试

已测：

```text
AnimationCache.size = 40
```

JS Heap：

```text
usedJSHeapMB  = 11.34
totalJSHeapMB = 13.15
heapLimitMB   = 4192
```

桌宠资源：

```text
resourceCount = 42
decodedBodySize ≈ 37.91 MB
```

当前决定：

```text
暂时保持现有预热策略
```

原因：

当前体验正常，优化重点已经转向：

```text
聊天
+
人格
+
情绪
+
动作映射
```

暂时不要继续优化预加载。

---

# 17. 当前 IDLE 轮换

IDLE 动画播放完成后会重新选择 IDLE 动作。

例如：

```text
三球抛接
→ 东张西望
→ 下五子棋
→ 碎碎念-发呆碎碎念
→ 抽陀螺
```

这是正常行为。

同一个动作可以同时具有：

```text
IDLE
THINKING
```

等多个语义标签。

---

# 18. 当前 Chat 架构

当前大致结构：

```text
DesktopPet.astro
   ↓
ChatController
   ↓
HttpChatClient
   ↓
/api/chat
   ↓
Go Backend
   ↓
AI Provider
```

---

# 19. 当前聊天行为状态

目前聊天和动作的联动只有：

```text
用户发送
    ↓
THINKING

首个 AI Token
    ↓
SPEAKING

回复完成
    ↓
IDLE
```

这是当前最大的架构限制之一。

---

# 20. 当前人格系统

当前人格并不是独立角色卡。

当前人格主要存在于：

```text
Go Backend
System Prompt
```

当前旧人格大体方向：

```text
聪明
放松
克制
可靠
偏技术
```

允许：

```text
轻度吐槽 Bug
轻度吐槽场景
```

禁止：

```text
攻击用户
```

回答要求：

```text
适合桌宠气泡
偏短
```

同时存在：

```text
服务端固定 Persona
```

前端不能覆盖人格。

---

# 21. 当前人格系统的问题

现在是：

```text
人格 System Prompt
        ↓
文本回复
```

同时：

```text
ChatController
        ↓
THINKING / SPEAKING
        ↓
动画
```

两条链路彼此独立。

即：

```text
人格
≠
动作
```

AI 即使表现：

```text
开心
生气
惊讶
害羞
失落
困惑
```

前端目前也不知道。

---

# 22. 最终人格系统参考

未来人格系统参考开源项目：

```text
fishonalities
```

仓库：

```text
https://github.com/melosic/fishonalities
```

我们不会直接把 fishonalities 整个项目作为运行依赖。

定位是：

```text
人格架构参考
+
人格卡设计参考
+
Prompt Build 思想参考
```

---

# 23. fishonalities 借鉴原则

重点吸收：

```text
kernel
persona
reacts_to
quirks
taboos
memories
moments
prompt build
```

尤其重点：

```text
reacts_to
```

人格不能只写：

```text
温柔
傲娇
可爱
聪明
```

而应该写：

```text
发生什么
↓
角色如何自然反应
```

---

# 24. 最终人格架构

最终设计：

```text
Character Card
       ↓
Persona Compiler
       ↓
System Prompt
       ↓
AI
```

Character Card 不直接等于最终 Prompt。

---

# 25. 最终人格目录规划

暂定：

```text
server/
└─ persona/
   ├─ kernel/
   │  ├─ voice.md
   │  ├─ rules.md
   │  └─ private.md
   │
   ├─ characters/
   │  └─ dsh.yaml
   │
   └─ compiled/
```

未来具体目录可以调整。

---

# 26. Kernel

## voice.md

负责：

```text
怎么像真人聊天
```

例如：

```text
聊天节奏
表达习惯
句子长度
自然程度
避免客服腔
```

---

## rules.md

负责不可随人格变化的规则，例如：

```text
系统边界
安全
输出限制
气泡长度
格式规则
```

---

## private.md

负责网页桌宠的一对一聊天模式。

---

# 27. Character Card 草案

临时技术结构：

```yaml
id: character-id

identity:
  name: ""
  description: ""

personality:
  traits: []
  flaws: []
  values: []

voice:
  style: []
  habits: []
  avoid: []

quirks: []

taboos: []

reacts_to:
  - when: ""
    response: ""
    emotion: neutral
    intensity: 0.0
    behavior: none

moments: {}

memories: []
```

注意：

这只是架构草案。

**正式人物性格必须等待新的角色卡。**

未经角色卡确认，不要擅自设计最终人物人格。

---

# 28. 人格设计原则

最终角色不能只靠：

```text
traits
```

应该重点设计：

```text
reacts_to
```

例如：

```yaml
reacts_to:

  - when: 用户夸她

    response:
      有点高兴，但不一定直接说谢谢

    emotion:
      happy

    intensity:
      0.45

    behavior:
      shy_reaction
```

---

# 29. Activity 与 Emotion 必须拆开

这是最终系统核心设计。

当前：

```text
THINKING
SPEAKING
IDLE
```

实际上表示：

```text
Activity
```

也就是：

```text
角色正在做什么
```

而不是：

```text
角色现在心情怎样
```

因此最终系统必须同时存在：

```text
Activity State
+
Emotion State
```

---

# 30. Activity State

继续使用现有 PetStates。

例如：

```text
IDLE
THINKING
SPEAKING
INTERACT
DRAGGING
```

---

# 31. Emotion State

临时候选：

```text
neutral
happy
excited
sad
annoyed
angry
shy
surprised
confused
worried
relaxed
tired
```

注意：

这些不是最终角色情绪集合。

正式集合需要根据：

```text
新角色卡
```

重新决定。

---

# 32. Emotion Intensity

每个情绪未来可以带：

```text
intensity
```

暂定：

```text
0.0 ~ 1.0
```

例如：

```text
happy 0.2
```

表示轻微高兴。

```text
happy 0.8
```

表示明显高兴。

---

# 33. Behavior

Emotion 不能单独决定动画。

例如：

```text
happy
```

可能代表：

```text
开心聊天
开心庆祝
开心被夸
开心玩耍
```

因此加入：

```text
Behavior
```

临时候选：

```text
idle
listen
think
speak
react
celebrate
protest
avoid
comfort
tease
work
rest
```

最终仍然根据角色卡调整。

---

# 34. 最终动画选择上下文

未来：

```text
PetBehaviorContext
```

大致：

```js
{
  activity: "SPEAKING",
  emotion: "happy",
  behavior: "celebrate",
  intensity: 0.7
}
```

动画系统根据：

```text
Activity
+
Emotion
+
Behavior
+
Intensity
```

选择动作。

---

# 35. AI 不得直接控制动画文件

这是架构硬规则。

禁止：

```json
{
  "animation": "点击回应-开心跃动"
}
```

AI 不应该知道：

```text
资源文件名
动作文件名
Spritesheet 名
```

AI 只能输出抽象语义：

```json
{
  "emotion": "happy",
  "behavior": "celebrate",
  "intensity": 0.7
}
```

然后：

```text
PetActionSelector
```

选择真正动画。

---

# 36. 最终 AI 输出结构

未来内部可以类似：

```json
{
  "reply": "终于搞定了，差点被这个 bug 绕进去。",
  "state": {
    "emotion": "happy",
    "behavior": "celebrate",
    "intensity": 0.65
  }
}
```

用户只能看到：

```text
reply
```

其他字段：

```text
仅供桌宠运行时使用
```

---

# 37. 最终行为链

最终目标：

```text
用户输入
   ↓
Persona
   ↓
AI Reasoning / Response
   ↓
Text Reply
+
Emotion
+
Behavior
+
Intensity
   ↓
PetBehaviorController
   ↓
PetStateMachine
   ↓
PetActionSelector
   ↓
Animation
```

---

# 38. 未来新增模块

暂定：

```text
src/lib/persona/
├─ PersonaSchema.js
├─ PersonaRuntime.js
└─ EmotionTypes.js
```

以及：

```text
src/lib/pet/
├─ PetBehaviorContext.js
└─ PetBehaviorController.js
```

注意：

这些目前只是规划。

**尚未正式建立。**

---

# 39. PetStateMachine 的长期职责

以后：

```text
PetStateMachine
```

只负责：

```text
角色正在做什么
```

例如：

```text
THINKING
SPEAKING
DRAGGING
INTERACT
```

不要把：

```text
happy
sad
angry
```

全部塞入 StateMachine 主 State。

---

# 40. PetBehaviorContext 的长期职责

负责：

```text
角色是以什么情绪做这件事
```

例如：

```text
SPEAKING + HAPPY
```

```text
SPEAKING + ANNOYED
```

```text
INTERACT + SURPRISED
```

---

# 41. PetActionSelector 长期职责

最终应接收：

```text
activity
emotion
behavior
intensity
tags
```

然后：

```text
过滤候选动作
↓
计算权重
↓
避免连续重复
↓
选择实际动作
```

---

# 42. 101 动作最终处理方式

下一阶段的重要设计工作：

```text
101 个动作
↓
重新建立完整语义映射
```

每个动作最终至少应包含：

```text
Activity
Emotion
Behavior
Intensity Range
Usage Context
Tags
Weight
```

例如概念上：

```text
工作状态-雀跃庆祝

Activity:
REACTION / SPEAKING

Emotion:
happy / excited

Behavior:
celebrate

Intensity:
0.5 - 1.0
```

---

# 43. 动作语义不能过度绑定角色人格

例如：

```text
点击回应-傲娇生气
```

资源名称可以保留。

但内部语义不要必须解释成：

```text
这个角色一定是傲娇
```

应该理解为：

```text
annoyed
angry
protest
```

等更抽象行为。

这样换角色卡时仍可复用动画。

---

# 44. Moments

fishonalities 的：

```text
moments
```

非常适合桌宠。

未来可以覆盖：

```text
startup
poke
repeated_poke
drag_start
drag_end
chat_start
first_token
chat_done
chat_error
idle_long
```

---

# 45. 当前桌宠事件

未来可以映射：

```text
pointer-click
pointer-drag-start
pointer-drag-end
chat-start
first-token
chat-done
chat-error
```

至 Persona Moment / Reaction。

---

# 46. Memory 规划

必须区分两种 Memory。

## Character Memory

角色背景中的固定经历。

例如：

```text
角色以前发生过什么
角色为什么有某个习惯
角色对某件事为什么有特殊反应
```

属于：

```text
Character Card
```

---

## User Memory

用户长期聊天记忆。

例如：

```text
用户最近在做什么
用户长期偏好
之前发生的对话事件
```

这是未来独立系统。

不得和角色背景记忆混为一谈。

---

# 47. 当前阶段暂不实现长期记忆

优先级：

```text
Persona
↓
Emotion
↓
Behavior
↓
Animation Mapping
↓
稳定测试
↓
Memory
```

不要提前增加复杂度。

---

# 48. Persona Compiler

未来不要继续在 Go 代码中维护大型：

```go
const systemPrompt = `...`
```

应该：

```text
Character YAML
+
Kernel
↓
Compiler
↓
Compiled Prompt
```

例如：

```text
server/persona/compiled/dsh.prompt.txt
```

Go 服务启动时读取。

---

# 49. Persona Compiler 的优点

以后换角色只需要：

```text
修改角色卡
↓
重新 build
↓
重启 Chat Server
```

而不是：

```text
修改 Go 业务逻辑
```

---

# 50. fishonalities 的定位

本项目不会变成：

```text
fishonalities fork
```

而是：

```text
fishonalities
=
人格架构参考

FJK Desktop Pet
=
Persona
+
Emotion
+
Behavior
+
Animation
```

fishonalities 的终点：

```text
像真人一样聊天
```

本项目最终目标：

```text
像角色一样聊天
+
像角色一样产生情绪
+
像角色一样做出行为
+
用动画表现行为
```

---

# 51. 当前阶段决定

当前不继续优化：

```text
Animation preload
Canvas
Drag
Click Hit Test
```

除非出现明确 Bug。

开发重心正式转为：

```text
Persona
Chat
Emotion
Behavior
Action Mapping
```

---

# 52. 正式角色卡状态

当前：

```text
尚未确定
```

开发原则：

```text
禁止擅自提前定义最终人物性格
```

需要等待新的：

```text
人物角色卡
```

角色卡到位后再决定：

```text
核心人格
说话方式
缺点
行为模式
情绪表达强度
喜怒哀乐
特殊反应
禁忌
```

---

# 53. 角色卡到位后的开发顺序

必须按以下顺序推进。

## Phase A

分析新角色卡。

提取：

```text
Identity
Traits
Flaws
Voice
Quirks
Taboos
React Rules
Emotion Threshold
Behavior Style
```

---

## Phase B

建立角色专属 Emotion Model。

确认：

```text
哪些情绪存在
哪些情绪明显
哪些情绪克制
哪些情绪几乎不会表现
```

---

## Phase C

重新检查 101 个动作。

建立：

```text
Activity
Emotion
Behavior
Intensity
```

映射。

---

## Phase D

设计 AI 输出协议。

例如：

```text
reply
emotion
behavior
intensity
```

---

## Phase E

建立：

```text
PetBehaviorController
```

---

## Phase F

让：

```text
ChatController
```

真正驱动：

```text
Emotion
Behavior
Action
```

---

## Phase G

本地测试。

---

## Phase H

服务器测试。

---

# 54. 当前部署流程

本地：

```powershell
cd "D:\Personal Blog"
npm run build
Remove-Item .\fjk-blog-dist.tar.gz -Force -ErrorAction SilentlyContinue
tar -czf .\fjk-blog-dist.tar.gz -C .\dist .
```

上传：

```text
fjk-blog-dist.tar.gz
```

至：

```text
/tmp/fjk-blog-dist.tar.gz
```

服务器执行：

```bash
sudo find /var/www/personal-blog -mindepth 1 -maxdepth 1 -exec rm -rf {} +
sudo tar -xzf /tmp/fjk-blog-dist.tar.gz -C /var/www/personal-blog
sudo chmod -R a+rX /var/www/personal-blog
```

静态文件部署后：

```text
通常不需要重启 Nginx
```

---

# 55. 命令环境注意

Windows PowerShell 命令：

```text
PS D:\Personal Blog>
```

Linux Server 命令：

```text
[fjkadmin@server ~]$
```

禁止把：

```bash
sudo
```

命令运行到 Windows PowerShell。

---

# 56. 开发协作规则

以后修改代码：

```text
提供完整可覆盖版源码
```

不要只提供零碎 Patch。

如果修改文件：

```text
必须基于当前最新源文件
```

如果不确定本地文件是否比现有记录更新：

```text
先获取最新文件
```

不得根据旧版本猜测修改。

---

# 57. 不能随意回退的架构

以下设计已经确认，应当视为稳定基础设施：

```text
Canvas Renderer
Alpha Hit Test
Transparent Click Through
Drag RAF
Saved Position
AnimationCache
PetActionCatalog
PetActionSelector
PetStateMachine
Realtime Preload
Streaming Chat
Server Persona Protection
Multi-turn Context
```

未来人格重构应尽量建立在这些模块之上。

不要为了人格系统重写整个桌宠底层。

---

# 58. 当前最大技术缺口

目前最大的缺口不是动画播放器。

而是：

```text
AI Text
和
Pet Animation
之间没有语义桥梁
```

当前只有：

```text
THINKING
SPEAKING
```

缺少：

```text
Emotion
Behavior
Intensity
```

因此最终核心新增层应该是：

```text
PetBehaviorController
```

---

# 59. 最终架构蓝图

```text
┌───────────────────────────────┐
│ Character Card                │
│ identity                      │
│ personality                   │
│ voice                         │
│ quirks                        │
│ taboos                        │
│ reacts_to                     │
│ moments                       │
│ character memories            │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ Persona Compiler              │
│ + Voice Kernel                │
│ + Private Rules               │
│ + System Rules                │
└──────────────┬────────────────┘
               │
               ▼
        Compiled System Prompt
               │
               ▼
┌───────────────────────────────┐
│ Go Chat Backend               │
│                               │
│ Conversation Context          │
│ Provider Adapter              │
│ Streaming                     │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│ AI Response                   │
│                               │
│ reply                         │
│ emotion                       │
│ behavior                      │
│ intensity                     │
└───────────┬───────────┬───────┘
            │           │
            │           ▼
            │   PetBehaviorController
            │           │
            │           ▼
            │     PetStateMachine
            │           │
            │           ▼
            │     PetActionSelector
            │           │
            │           ▼
            │       PetAnimator
            │           │
            └──────────► Canvas

            reply
              │
              ▼
        Speech Bubble
```

---

# 60. 最终产品原则

桌宠不能只是：

```text
ChatGPT
+
动画皮肤
```

最终目标：

```text
角色人格
决定
她如何理解场景

↓

场景
触发
情绪

↓

情绪
影响
说话

↓

情绪 + 场景
产生
行为

↓

行为
产生
动画
```

也就是：

```text
人格
→ 语言
→ 情绪
→ 行为
→ 动画
```

这些必须形成统一系统。

---

# 61. 当前项目状态

当前阶段：

```text
桌宠基础设施：稳定
动作系统：稳定
拖拽：稳定
点击：稳定
实时缓存：稳定
流式聊天：稳定
多轮上下文：稳定
旧 Persona：可用

新 Persona 系统：设计阶段
Emotion 系统：设计阶段
Behavior 系统：设计阶段
Chat → Animation Bridge：尚未实现
长期 Memory：尚未实现
```

---

# 62. 下一开发任务

当前下一任务不是直接修改源码。

下一任务：

```text
等待新的正式人物角色卡
```

角色卡收到后：

```text
角色人格建模
↓
情绪模型
↓
行为模型
↓
101 动作重新语义映射
↓
确定 AI 输出协议
↓
开始实现
```

---

# 63. 恢复开发上下文的标准流程

如果未来新的 AI 会话完全不知道之前发生过什么：

第一步：

```text
读取本文件
```

第二步：

确认：

```text
PROJECT_BLUEPRINT.md 的更新时间
```

第三步：

检查：

```text
当前 Git 状态
当前关键源码
```

第四步：

重点读取：

```text
DesktopPet.astro
PetActionCatalog.js
PetActionSelector.js
PetStates.js
PetStateMachine.js
PetInteractionController.js
ChatController.js
HttpChatClient.js
Go Chat Backend
```

第五步：

比较实际代码与本文档：

```text
如果代码比本文档更新
→ 先更新本文档

如果本文档比实现领先
→ 按 Roadmap 继续实现
```

---

# 64. 文档维护规则

每完成一个重要阶段，都更新：

```text
Current Project Status
```

同时记录：

```text
Completed
In Progress
Next
Do Not Regress
```

重大架构决策必须进入本文档。

例如：

```text
Persona 输出协议变更
Emotion Model 变更
Action Mapping 变更
后端架构变更
Memory 架构变更
部署方式变更
```

---

# 65. 最重要的开发原则

```text
不要为了快速实现而把人格、情绪和动作硬编码在一起。
```

应该始终保持：

```text
Persona
Emotion
Behavior
Animation
```

彼此独立，但通过明确协议连接。

只有这样：

```text
换角色
换模型
换动画包
增加记忆
```

时才不需要推翻整个项目。

---

# 66. 当前蓝图版本

```text
Blueprint Version: 0.1
Status: Architecture Design
```

当前里程碑：

```text
Desktop Pet Runtime Foundation
COMPLETE

Realtime Action Foundation
COMPLETE

Streaming Chat Foundation
COMPLETE

Persona / Emotion / Behavior Architecture
DESIGNED

Character Persona
WAITING

Emotion → Animation Mapping
WAITING

Implementation
WAITING
```

---

# 67. 当前唯一下一步

```text
获取新的正式人物角色卡。
```

在角色卡确定之前：

```text
不要提前锁死最终人格
不要提前锁死最终 Emotion Model
不要提前重构 ChatController
不要提前修改 PetStateMachine
```

等待人格完成后统一进入下一阶段。