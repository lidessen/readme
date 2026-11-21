# Claude Design 工程方法与社区复刻调研

状态：2026-10-10 调研与吸收建议。读取官方资料、社区作者文档及一处公开协议源码；未安装、运行或验收外部产品。建议尚未接入 Meowbook 或生产 UI，不构成新的设计标准。

## 研究要解决的问题

用户指出 MeowUI 截图整体缺少原型的精致感，并有不居中对齐的问题。修复六个局部缺陷仍不能证明整页还原。
本次研究围绕三个问题：设计上下文如何保持、局部修改如何可靠落到源码、如何用真实画面驱动迭代。
模型能力会影响结果，但已有材料不足以把 Claude Design 的质感归因于某条提示词或某一种架构。

## 官方提供的工作结构

Claude Design 作者描述了 HTML 可运行画布、产品品牌上下文与可分享原型的结合；设计用于探索和反馈，生产实现交给 Claude Code，并保留原有工作。可借鉴的是先形成可见的实例，再进入实现，而不是只给 agent 抽象形容词。[作者实践](https://claude.com/resources/articles/how-the-product-designer-who-built-claude-design-uses-it-to-explore-ideas-before-building-them)

官方文档描述导入真实设计系统、组件和代码，设计输出自查，以及对话、元素评论和直接编辑三种反馈方式。它们分别服务整体结构、局部修改和快速视觉调整。公开文档没有证明内部检查算法或最终还原度。[使用指南](https://support.claude.com/en/articles/14604416-get-started-with-claude-design)

## 社区材料与可借鉴部分

### 1. imsai-sh/open-claude-design：运行时分析与 Web 复刻

作者记录了 2026 年 4 月登录态 DOM、网络和运行时调查，给出 iframe 预览、Tweaks、Comment、Edit、Draw 的复刻；项目自标 pre-alpha。其对 Claude Design 内部结构的陈述属于社区观察，不能当成官方合同；README 也将部分能力列为未实现。[项目与分析](https://github.com/imsai-sh/open-claude-design)

实际读取 `editmode-protocol.ts`：元素选择消息携带 selector、HTML、边界框与样式；协议另有截图、运行时求值、日志和 requestId。元素定位优先专用 ID、其次 DOM ID、最后 XPath。可借鉴的是让反馈带上准确对象与当前画面，而不是只说“这块不精致”。协议类型存在不等于调用链已验证。[公开协议源码](https://github.com/imsai-sh/open-claude-design/blob/main/packages/iframe-runtime/src/editmode-protocol.ts)

对 Meowbook：已有组件树与局部裁图，可先用 story、组件用法、part、状态和视口形成反馈定位。实例 ID 只在当前挂载有效；重拍后重新解析，不照搬外部跨生成 ID 的保证。暂不需要复刻整套编辑器或改变 Agent 执行宿主。

### 2. OpenCoworkAI/open-codesign：本地设计工作区与视觉复验

项目提供本地工作区、模型接入、预览和导出，并描述元素评论等反馈方式。它是独立替代产品，不是已证明等价于 Claude Design 的实现。[项目](https://github.com/OpenCoworkAI/open-codesign)

其 UI Kit 实验将参考图拆成组件与 token，渲染后用视觉模型逐项判断布局、字体、颜色、内容和组件结构，把失败理由交回迭代。值得借鉴的是保存参考、候选、失败理由与每轮产物。文档中的旧连续评分与新布尔规则混在结果表中，样本也有限，不能据此接受模型排名或“达到阈值即精致”的结论。[实验记录](https://github.com/OpenCoworkAI/open-codesign/blob/main/BENCHMARKS.md)

其直接编辑文档明确区分点击的 DOM 实例与源码定义：改共享定义可能影响所有实例；只支持有限字段，无法可靠映射就拒绝，修改后复看预览。若以后给 Meowbook 加视觉调参，这个边界很重要：浏览器临时样式只能试作，最终必须回到 MeowUI 主题 owner，并复查其他用法。[源码编辑合同](https://github.com/OpenCoworkAI/open-codesign/blob/main/SOURCE_EDITING.md)

### 3. nexu-io/open-design：设计系统包与现有 Agent 复用

它组织本地 Agent、规范文件和可预览的项目文件；设计系统包可包含规范、token、组件实例、资产和来源。README 同时明确部分评论编辑和调参能力尚未完整实现。对我们最有用的是把设计依据变成可运行、可追溯的一组材料，而不是新增一个设计工具宿主。[项目](https://github.com/nexu-io/open-design)

迁移时复用现有 TS token、MeowUI 组件和 Meowbook 场景；规范解释关系与选择理由，避免另外维护一份手填色板或多个模板系统。

### 4. maxritter/open-claude-design：连接真实 Claude Design 的同步工具

这个同名项目是连接器，不是画布复刻。作者描述从代码形成设计、画布修改后同步回代码，并用版本、文件哈希和回读处理并发变化；新 artifact 后端使用观察到的协议，仍标为实验性。可借鉴设计快照与代码版本绑定，双方都变化时显式核对，不能覆盖最新内容。本次未验证其登录与同步能力。[项目](https://github.com/maxritter/open-claude-design)

我们当前只需在对照记录中保存参考版本、源码状态、story 与拍摄环境；不为本地走查引入远端同步层。

### 5. alchaincyf/huashu-design：把方法压缩为 HTML 原生工作流

作者说明从 Claude Design 的社区提示词和机制吸收品牌上下文，组织真实资产、早期可见样板、变体、Tweaks 和浏览器复看。它是方法复刻，不是 Anthropic 内部实现证据。值得吸收的是尽早展示真实内容、用可见变体讨论选择、最后实际看浏览器；不吸收随机选择设计哲学、固定多轮问答或审美雷达分数。[作者项目](https://github.com/alchaincyf/huashu-design)

### 6. Impeccable：设计判断与技术审计分开

这是源于 Anthropic frontend-design 的邻近项目，不能称为 Claude Design 复刻。它区分产品事实与视觉规范，并区分 critique、audit、layout、typeset、polish 等任务。对本项目有价值的是把“结构是否协调”“字与控件是否精细”“技术是否可用”分别观察；其反模式和检测规则不是本项目审美标准。[上游项目](https://github.com/pbakaus/impeccable)

### 7. eddie199/claude-design-md：带边界的实践分析

作者保存了模型自述、四类项目试验、矛盾与未验证项，尤其提醒默认问题选项可能提前限定视觉方向。其关于 `CLAUDE.md` 特殊加载的说法基于 4 月观察和模型自述，不是当前官方解析合同。借鉴研究方法和证据区分，不复制文件名假设；我们通过现有技能入口显式加载共同规范。[实践记录与模板](https://github.com/eddie199/claude-design-md)

## 本地反例：规范和 token 已有，组合仍会失真

本轮实际查看了 `chat-workspace` 的 1100×900 浅色照片。Assistant 正文约从 x59 开始，用户气泡靠近右边缘，输入框却居中在约 x175–925，阅读轴断开。

- `packages/node/meowui/stories/chat-workspace.stories.tsx` 直接把消息放进 `ChatMessageList`。
- `src/chat/message-list.tsx` 的 List 只输出 root；独立 Content 才表达内部消息目标。
- `src/theme/chat/frame.styles.ts` 已给 Content 设置 720px 上限和自动外边距，但这个场景没有实例化 Content。
- `apps/meowland/web/src/conversation/chat.tsx` 已使用 Content，因此目前证据只确认该展示场景有问题，不能推导整个产品都未居中。
- 场景还固定阅读区高度 340px，内容仅两条短消息；不足以比较原型完整窗口中的区域比例、阅读节奏和底部输入区关系。

照片保存在本次走查的临时目录。
此发现说明“使用了规范”“组件都有样式”“拍摄成功”仍可能漏掉组合问题。需要先校准代表性完整场景。

## 建议的最小吸收方案

1. **用真实公共组件建立完整标杆场景。** 在 Meowbook 中还原 research 的阅读轴、区域比例与内容密度，使用现有 Content、Item、作者信息、过程组与 Composer。业务状态继续由宿主拥有；不复制原型业务系统。
2. **先对整屏，再看组件。** 在相同视口、主题和相近内容状态下，比较区域位置、共同中心、左右边距、正文行长、累计留白，再看字号、图标、边界和状态色。明确哪项偏离、影响什么，不用总体评分压缩这些判断。
3. **把画面反馈绑定到用法与来源。** 每个问题同时包含参考图、实拍、story/状态/part 和修复 owner。改动在当前源码落实，重拍确认；需要时用 DOM 测量解释已经看到的偏差。
4. **局部试作，确认后传播。** 对一个完整场景试作宽度、间距或排印方案，实际看差异；成立后回写共享组件或主题，并检查其他消费者。避免每页补一层 CSS。
5. **保留设计意图的交接。** 规范回答规则为什么成立、何时调整；真实标杆回答它怎样长出来；主题与组件回答怎样实现。新组件用真实内容先放进完整组合，证明继承关系，再扩大实现。

当前优先级：先补齐并修正完整标杆，再建立参考/实现的并排对照；元素批注和临时 Tweaks 只有在现有报告定位成本仍高时再做。Meowbook 已有拍摄、组件树和报告，不需要为了这次质感问题另建 Agent 平台。

外部材料尚未证明自动审美评分、某个系统提示词、替换模型或复刻编辑器能解决我们的差距。吸收效果应由同一完整场景的前后实拍检验；六项局部修复与整体设计还原分别记录。
