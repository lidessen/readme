# 原则与方法索引

- 状态：current
- 最后核对：`b3d6ef6` / 2026-11-21（来源基线；本次索引改动、divide-and-conquer 技能正文及新增的 worker-advisor 参考除外）
- 增量核对：`f277e90` / 2026-11-22（architecture 技能与代码库设计参考；本次 architecture 原则及索引改动除外）
- 维护：[principles-index](skills/principles-index/SKILL.md)（收录标准、状态口径与刷新流程见该技能）

这是本仓库哲学、方法论与原则的检索工具（finding aid）。每条 = 主题、鉴别性搜索关键词、来源位置
（链接直达文件或标题锚点）、状态。不概述论点、不改写原文、不替代阅读；判断与表述以来源原文为准。
条目按任务/概念分组，同一材料可在多组出现。来源变化后按 [principles-index](skills/principles-index/SKILL.md)
刷新，并用 [check_index.py](skills/principles-index/scripts/check_index.py) 校验链接与锚点。

## 范围

- 技能入口共 25 个：既有索引记录标题与触发逐个核对；本次报告仅支持部分技能及参考资料的选择性语义阅读，未重新逐篇语义复核。`theory/` 一级材料、想法文件和归档说明有全文阅读报告；归档中其余 20 个文件仅采集标题，未逐篇读正文。
- `notes/` 11 篇中文原文和 `blog/` 4 篇草稿有全文阅读报告；按收录标准选择相关入口。`blog/_02` 仅有标题，无正文。
- 未逐条收录：各技能 `references/` 的其余文件（需要时打开对应目录）、与原则无关的个人观察类短想法、图片资产、构建与站点配置。
- 译文 `notes/*.en.md` 是派生副本（frontmatter `translation.source` 记录原文哈希），不作为独立来源。
- 线上 Pack 分组以 [`skills.sh.json`](skills.sh.json) 为准，与本索引的任务分组无关。

## 状态图例

| 状态 | 覆盖 | 阅读方式 |
| --- | --- | --- |
| 当前技能 | `skills/*/SKILL.md` 入口 | 当前维护的指导，可直接使用 |
| 当前技能（参考） | 技能内被点名的方法 references | 按需加载的深化材料 |
| 方法摘编 | `theory/` 两篇摘编 | 从形成资料整理，不是原始记录，不替代原文 |
| 演进想法 | `theory/thoughts/` 与相关短想法 | 方法形成中的材料，不是已验证结论 |
| 历史原文 | 旧仓固定提交迁入的三份文件 | 保留原始字节与历史表述，按历史地位阅读 |
| 项目材料归档 | `theory/archive/**` | 有保留价值的 Rossovia 项目材料，不是本仓库当前方法 |
| 草稿 | `blog/_*.md` | `_` 前缀草稿，不进公开构建 |
| 短想法 | `notes/` 独立短文 | 个人观察，不构成方法 |
| 治理文档 | 仓库级规则与来源记录 | 仓库维护时先读 |

## 一、理论与表达基线

| 主题 | 搜索关键词 | 来源 | 状态 |
| --- | --- | --- | --- |
| 哲学序列 P01–P16（认识→分析→解决） | 实事求是、具体问题具体分析、抓住主要矛盾 | [theory/theory.md § 哲学序列](theory/theory.md#哲学序列philosophical-sequence) | 历史原文 |
| 条目=基因型：可再生、抗漂移、可诊断 | 基因型/表型、条目对 | [theory/theory.md § 为什么条目值得单独保留](theory/theory.md#为什么条目值得单独保留) | 历史原文 |
| 层级：道—一—二—三—万物 | 对象同一性、skill、激活 | [theory/theory.md](theory/theory.md) | 历史原文 |
| 表达是保真变换；四项使用关系 | 受众、目的、行动、媒介 | [theory/theory.md § 四项使用关系](theory/theory.md#四项使用关系) | 历史原文 |
| 面向人与面向 Agent 的表达 | 事实/指令/候选/未知 | [theory/theory.md § 面向人与面向 Agent 的表达](theory/theory.md#面向人与面向-agent-的表达) | 历史原文 |
| 双受众与单一语义源 | projection、派生视图不取第二权威 | [theory/theory.md § 双受众与单一语义源](theory/theory.md#双受众与单一语义源) | 历史原文 |
| 承重语义先于 token economy | 压缩、承重语义 | [theory/theory.md § 承重语义先于 token economy](theory/theory.md#承重语义先于-token-economy) | 历史原文 |
| 文本质量由接收效果证明 | 复述、可解释证据 | [theory/theory.md § 检验](theory/theory.md#检验文本质量由接收效果证明) | 历史原文 |
| 概念形成与指称 | 对象/概念/定义/名称、最近邻、临时 handle | [theory/theory.md § 概念形成与指称](theory/theory.md#概念形成与指称concept-articulation) | 历史原文 |
| 概念命名的操作方法 | 从对象开始、开源用法、改名预期 | [skills/concept-naming/SKILL.md § 从对象而非同义词开始](skills/concept-naming/SKILL.md#从对象而非同义词开始) | 当前技能 |
| 信息的干与湿 | 脱水/补水、归档浓度 | [notes/2026-08-26-information-hydration.md](notes/2026-08-26-information-hydration.md) | 短想法 |
| 归档价值、信息干湿、文档组织、错放审计的原话 | IN-2026-08-26-006A / 008A / 014A、IN-2026-08-25-003A | [theory/thoughts/information.md](theory/thoughts/information.md) | 历史原文 |
| 语言之前的碎片化思考 | prompt、对话模式、原始思绪 | [notes/2026-08-24-fragmented-thinking.md](notes/2026-08-24-fragmented-thinking.md) | 短想法 |
| 设身处地既是价值观也是方法 | 第一视角、prompt 与环境设计 | [notes/2026-08-25-situated-perspective.md](notes/2026-08-25-situated-perspective.md) | 短想法 |

## 二、指导载体与技能形成

| 主题 | 搜索关键词 | 来源 | 状态 |
| --- | --- | --- | --- |
| 载体成立性、表达与激活；不变量 | method / guidance carrier / activation、最小真实载体 | [skills/agent-guidance/SKILL.md § 不变量](skills/agent-guidance/SKILL.md#不变量) | 当前技能 |
| 是否沉淀为 skill：准入与生命周期 | 六面 review、证据等级 | [agent-guidance formation.md § 持久 guidance 与载体准入](skills/agent-guidance/references/formation.md#持久-guidance-与载体准入) | 当前技能（参考） |
| Agent-facing 正文的必要关系与压缩 | 压缩与展开、失败回报 | [agent-guidance composition.md § 压缩与展开](skills/agent-guidance/references/composition.md#压缩与展开) | 当前技能（参考） |
| 上下文与视图投影：保留结构、折叠而非替代 | 渐进披露、过滤可见 | [agent-guidance context-interface.md § 保留底层结构](skills/agent-guidance/references/context-interface.md#保留底层结构折叠而非替代) | 当前技能（参考） |
| 载体诊断与六面评审 | 先过诊断门 | [agent-guidance review.md § 六面评审](skills/agent-guidance/references/review.md#六面评审) | 当前技能（参考） |
| 行为探针与证据强度 | 最小探针、证据与处置 | [agent-guidance evaluation.md § 最小行为探针](skills/agent-guidance/references/evaluation.md#最小行为探针) | 当前技能（参考） |
| 现场试验与开放评价 | 自然输入、答案隔离 | [agent-guidance field-trial.md § 准备自然输入](skills/agent-guidance/references/field-trial.md#准备自然输入隔离核验答案) | 当前技能（参考） |
| 方法孵化与分层验证 | L0/L1/L2、隔离试验 | [skills/skill-incubator/SKILL.md § 以最便宜的充分证据推进](skills/skill-incubator/SKILL.md#以最便宜的充分证据推进) | 当前技能 |
| 方法发展、八维评估与遗传演进 | development / quality-assessment / evolution | [skill-incubator development.md § 把核心选择发展为工作关系](skills/skill-incubator/references/development.md#把核心选择发展为工作关系)、[quality-assessment.md § 八维设计量表](skills/skill-incubator/references/quality-assessment.md#八维设计量表)、[evolution.md § 遗传什么](skills/skill-incubator/references/evolution.md#遗传什么表达什么) | 当前技能（参考） |
| 技能怎样发展、效果怎样判断 | 验证分层、比较、结论强度 | [theory/skill-development.md § 写清当前能支持的结论](theory/skill-development.md#写清当前能支持的结论) | 方法摘编 |
| 技能形成记录（doc-writing、质量评估、architecture、divide、defrag、steward、孵化实验） | Rossovia 形成记录 | [theory/archive/README.md § 技能形成记录](theory/archive/README.md#技能形成记录) | 项目材料归档 |
| Agent 人格与差异化视角设计 | MBTI 维度、委派人格 | [skills/agent-personality/SKILL.md § 主流程](skills/agent-personality/SKILL.md#主流程) | 当前技能 |
| AI 性格与 Agent 心理学的探索 | 矛盾人格、统一自我、输入形式、harness | [notes/2026-08-24-conflicting-thoughts-and-self.md](notes/2026-08-24-conflicting-thoughts-and-self.md)、[notes/2026-08-27-agent-psychology.md](notes/2026-08-27-agent-psychology.md)、[blog/_01-ai-personality.md](blog/_01-ai-personality.md) | 短想法、草稿 |

## 三、整体架构、分治与整理

| 主题 | 搜索关键词 | 来源 | 状态 |
| --- | --- | --- | --- |
| 从目的与现实矛盾组织整体 | 责任、权力、依赖 | [skills/architecture/SKILL.md § 从整体目的与现实矛盾出发](skills/architecture/SKILL.md#从整体目的与现实矛盾出发) | 当前技能 |
| 先修路，再装防护栏 | 业务主路径、生命周期、真实风险、边界护栏 | [skills/architecture/SKILL.md § 先修路，再装防护栏](skills/architecture/SKILL.md#先修路再装防护栏) | 当前技能 |
| 结构决策模型 | 六关系、boundary ladder、命名 | [architecture decision-model.md § Boundary ladder](skills/architecture/references/decision-model.md#boundary-ladder) | 当前技能（参考） |
| 代码库边界、组织设计与技能体系 | codebase-design、hybrid-repositories、skill-systems | [architecture codebase-design.md § 核心判断](skills/architecture/references/codebase-design.md#核心判断)、[organization-design.md § 从真实工作看分工](skills/architecture/references/organization-design.md#从真实工作看分工)、[skill-systems.md § 同时看覆盖与接合](skills/architecture/references/skill-systems.md#同时看覆盖与接合) | 当前技能（参考） |
| 分治：有界贡献与整合验收 | sub-agent、swarm、合起来验证 | [skills/divide-and-conquer/SKILL.md § 先掌握整体](skills/divide-and-conquer/SKILL.md#先掌握整体再划出可独立推进的部分) | 当前技能 |
| 实现核对与执行器选路 | 双向核对、计费边界 | [divide implementation-audit.md § 两个方向共同覆盖](skills/divide-and-conquer/references/implementation-audit.md#两个方向共同覆盖) | 当前技能（参考） |
| Worker 与 Advisor：高劳动执行与高价值拍板 | 写清细节≠完善设计、零设计空白、按需多轮交替 | [divide worker-advisor.md § 职责切分](skills/divide-and-conquer/references/worker-advisor.md#职责切分) | 当前技能（参考） |
| 整理归位与语义保留 | 反事实检查、四类判断 | [skills/defrag/SKILL.md § 不变量](skills/defrag/SKILL.md#不变量)、[defrag evidence.md § 四类判断](skills/defrag/references/evidence.md#四类判断) | 当前技能 |
| 机制必要性锻打 | 反例、消融、重写而非追加 | [skills/design-forge/SKILL.md § 用减法辨明必要性](skills/design-forge/SKILL.md#用减法辨明必要性) | 当前技能 |
| 长期维护者的设计取舍 | design-steward 角色 | [skills/design-steward/SKILL.md § 角色正文](skills/design-steward/SKILL.md#角色正文) | 当前技能 |
| 保障性过度工程审查 | 门禁、误阻断、归位 | [skills/assurance-review/SKILL.md § 用最小证据区分必要与多余](skills/assurance-review/SKILL.md#用最小证据区分必要与多余) | 当前技能 |
| 历史方法：委派、工作量与实践回返 | agent-delegation、work-estimation、practice-cycle | [theory/skills.md](theory/skills.md) | 历史原文 |
| 边界、接回与归位 | 分工、语义保留、结果检查 | [theory/architecture-and-defrag.md § 归位时保留有效的使用关系](theory/architecture-and-defrag.md#归位时保留有效的使用关系) | 方法摘编 |
| 归档的协作、变更与测试约定 | team-learning、change-review、testing | [theory/archive/README.md § 方法与协作](theory/archive/README.md#方法与协作) | 项目材料归档 |
| Agent 组织与运行时设想 | WorkCell 最小模型、无总指挥的秩序 | [blog/_03-agent-organization.md](blog/_03-agent-organization.md) | 草稿 |

## 四、开发推进、并行与测试

| 主题 | 搜索关键词 | 来源 | 状态 |
| --- | --- | --- | --- |
| 先认识项目再定本地做法；基线→定形→起胚→合形→打磨→验收 | 工作基线、快车道 | [skills/agile-development/SKILL.md § 先认识项目](skills/agile-development/SKILL.md#先认识项目再定本地做法) | 当前技能 |
| 工作基线载体与连续工作环境 | 项目本地载体、决策记录 | [agile work-baseline.md § 项目本地工作基线载体](skills/agile-development/references/work-baseline.md#项目本地工作基线载体) | 当前技能（参考） |
| 环境解阻与摩擦审计 | 最小闭环、fresh context | [agile environment.md § 先识别摩擦](skills/agile-development/references/environment.md#先识别摩擦不先建平台)、[friction-audit.md § 四、fresh context 测试](skills/agile-development/references/friction-audit.md#四fresh-context-测试) | 当前技能（参考） |
| 任务规模与编制判断 | 工作图、快速分诊 | [agile task-sizing.md § 快速分诊](skills/agile-development/references/task-sizing.md#快速分诊) | 当前技能（参考） |
| 和人交流：少量、自足的决策点 | 自足性检查、授权边界 | [agile human-interface.md § 自足性检查](skills/agile-development/references/human-interface.md#自足性检查) | 当前技能（参考） |
| 保障剪枝：门禁要有预算 | gate 剪枝 | [skills/agile-development/SKILL.md § 保障剪枝](skills/agile-development/SKILL.md#保障剪枝门禁要有预算) | 当前技能 |
| TDD 回到验收、三三制、任务规模、人类接口的原始想法 | AG-2026-11-13-001A…015A | [theory/thoughts/agile-development.md § 未决问题](theory/thoughts/agile-development.md#未决问题) | 演进想法 |
| 按风险选择测试保障 | 执行投影、复测接续 | [skills/risk-driven-testing/SKILL.md § 比较目标失败与现有保障](skills/risk-driven-testing/SKILL.md#比较目标失败与现有保障) | 当前技能 |
| 行为规格、执行投影与项目本地化 | YAML 用例、generate/localize | [risk-driven behavior-spec.md § 行为比执行表达更稳定](skills/risk-driven-testing/references/behavior-spec.md#行为比执行表达更稳定)、[execution-projection.md § 三种执行单元与组装](skills/risk-driven-testing/references/execution-projection.md#三种执行单元与组装)、[localize.md § 找到影响项目取舍的事实](skills/risk-driven-testing/references/localize.md#找到影响项目取舍的事实) | 当前技能（参考） |
| 依赖升级：声明范围与锁定结果分开 | npm / Bun / Go | [skills/dependency-upgrade/SKILL.md § 找到真实检查范围](skills/dependency-upgrade/SKILL.md#找到真实检查范围) | 当前技能 |
| Docker 中运行 Bun | 版本门禁、开发服务 | [skills/docker-bun/SKILL.md](skills/docker-bun/SKILL.md) | 当前技能 |
| Workcells 开发闭环（工具仍在改造，暂不推荐安装） | Delegate / Task / Actions | [skills/workcells-development-loop/SKILL.md § 划界与委托](skills/workcells-development-loop/SKILL.md#划界与委托) | 当前技能 |
| 工作流与信息流 | channel 模式、角色、信息流向、WorkCell | [notes/2026-11-13-232600-channel-mode-workflow.md](notes/2026-11-13-232600-channel-mode-workflow.md)、[blog/_03-agent-organization.md](blog/_03-agent-organization.md) | 短想法、草稿 |
| 和 AI 做项目仍要亲自下场 | 掌控感、实践是试金石 | [notes/2026-11-13-232700-ai-project-participation.md](notes/2026-11-13-232700-ai-project-participation.md) | 短想法 |
| 资源不足的计划 | 衣架、预案 | [notes/2026-11-13-232700-resource-shortage-planning.md](notes/2026-11-13-232700-resource-shortage-planning.md) | 短想法 |
| Agent Loop as a Service | AaaS、harness 分工 | [blog/_04-agent-loop-as-service.md](blog/_04-agent-loop-as-service.md) | 草稿 |

## 五、写作、内容与调研

| 主题 | 搜索关键词 | 来源 | 状态 |
| --- | --- | --- | --- |
| 文档：读者怎么读、先定轻重、去 AI 味 | 维护者材料、事实/读者/立场 | [skills/doc-writing/SKILL.md § 读者是怎么读的](skills/doc-writing/SKILL.md#读者是怎么读的) | 当前技能 |
| 短想法捕获 | `notes/`、语义保真、不扩张承诺 | [skills/capture/SKILL.md § 工作流](skills/capture/SKILL.md#工作流) | 当前技能 |
| 草稿生长 | `blog/` 编号、轻量编辑 | [skills/draft/SKILL.md](skills/draft/SKILL.md) | 当前技能 |
| 文章审校 | `_` 前缀、人性化处理 | [skills/post-review/SKILL.md § Draft 规则](skills/post-review/SKILL.md#draft-规则) | 当前技能 |
| 配图与封面 | 视觉任务、资产挂接 | [skills/post-visual/SKILL.md § 参考与审美方向](skills/post-visual/SKILL.md#参考与审美方向) | 当前技能 |
| 辩证调研与吸收 | 矛盾、可迁移结构 | [skills/research-synthesis/SKILL.md § 从自身的问题进入](skills/research-synthesis/SKILL.md#从自身的问题进入) | 当前技能 |
| 套餐性价比分析 | API 等值、标价倍率 | [skills/plan-value-analysis/SKILL.md § 取证与估计](skills/plan-value-analysis/SKILL.md#取证与估计) | 当前技能 |
| 都江堰与工程化 Harness 设计（仅标题） | 都江堰、Harness、工程设计 | [blog/_02-dujiangyan-harness-design.md](blog/_02-dujiangyan-harness-design.md) | 草稿 |

## 六、界面与视觉

| 主题 | 搜索关键词 | 来源 | 状态 |
| --- | --- | --- | --- |
| 界面设计：真实关系、立场与语言 | 视觉层级、交互、后果 | [skills/interface-design/SKILL.md § 理论用于改变判断](skills/interface-design/SKILL.md#理论用于改变判断) | 当前技能 |
| UI 分批改善 | 任务动线、风格复验 | [skills/ui-improvement/SKILL.md § 从画面判断缺口在哪一层](skills/ui-improvement/SKILL.md#从画面判断缺口在哪一层) | 当前技能 |

## 七、仓库治理与来源

| 主题 | 搜索关键词 | 来源 | 状态 |
| --- | --- | --- | --- |
| 维护入口与语言规范 | 根 `skills/` 唯一源码、简体中文治理文档 | [AGENTS.md](AGENTS.md) | 治理文档 |
| 站点、安装与 Pack | 按任务选择技能、GitHub 安装 | [README.md § 按任务选择技能](README.md#按任务选择技能) | 治理文档 |
| 内容来源与适配 | Rossovia 固定提交、更名记录 | [MIGRATION.md § 理论](MIGRATION.md#理论) | 治理文档 |
| 理论材料的身份与引用边界 | 旧仓原文 / 摘编 / 归档 / 当前想法 | [theory/README.md § 旧仓原文](theory/README.md#旧仓原文) | 治理文档 |
| 项目材料归档说明 | 归档不等于采纳 | [theory/archive/README.md](theory/archive/README.md) | 项目材料归档 |
| 战略地图 | 组织架构、健康判断 | [PROJECT-MAP.md](PROJECT-MAP.md) | 治理文档 |
| 本索引的收录与刷新 | finding aid、状态口径 | [skills/principles-index/SKILL.md](skills/principles-index/SKILL.md) | 当前技能 |
