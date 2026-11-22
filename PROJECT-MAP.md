# Readme 项目地图

- 状态：current
- 最后核对：`8d8a17e` / 2026-11-22
- 维护者：readme 项目窗
- 战略健康：正常 —— 通用技能库、理论归档、短想法与 Meowpress 静态站点职责清晰；私有协调材料已完整迁出至 `~/.workcells/workspace/`。
- 用途：给技术型决策者判断仓库边界、构建与发布健康；不写日常待办、私有现场或个人工作状态。

> 详细构建、语言树与发布护栏见 [README.md](README.md) 与 [AGENTS.md](AGENTS.md)。

## 1. 战略目标

- 要解决的问题：沉淀可跨项目复用的通用 Agent 技能与方法论，并以静态博客形式发布个人思考与文章。
- 目标状态：根目录 `skills/` 作为公开技能的唯一源码真值；`notes/`、`blog/` 与 `theory/` 通过 Meowpress 稳定构建并安全发布。
- 不做什么：不存放特定业务项目的组件契约、运行命令或常驻规则；不存放私有跨项目协调状态、本机绝对路径或凭据；不在本仓库维护 `.agents/skills/` 副本。
- 判断走对的标准：技能与文章保持通用清晰、公开构建审计零私密泄露、站点与 Pack 清单语义一致。

## 2. 组织架构

| 部分 | 职责 | 不负责 / 边界 | 关键入口 | 状态 |
| --- | --- | --- | --- | --- |
| 通用技能库 | 跨项目复用的开发、架构、写作、测试与方法技能（当前暂排除未就绪的 `workcells-development-loop` 出推荐安装） | 不承载具体项目合同与私有路径 | [skills/](skills/)、[skills.sh.json](skills.sh.json) | 可用 |
| 理论与归档 | 历史原文、方法摘编、当前想法与 Rossovia 材料归档 | 归档保留当时证据边界，不冒充当前方法 | [theory/README.md](theory/README.md) | 可用 |
| 内容写作 | 中文源短想法、英文译文、文章草稿与配图 | 以 `_` 开头的草稿严禁进入公开构建输出 | `notes/`、`blog/` | 可用 |
| 静态构建与发布 | Meowpress (`0.3.0-alpha.9`) + Cloudflare Workers Static Assets 审计与 dry-run 门禁 | 只发布 `dist/`；`build:ci`/`deploy:ci` 锁定 `bun@1.4.4` | [package.json](package.json)、[README.md](README.md#站点) | 可用 |

## 3. 主要工作内容

- 按需迭代 `skills/` 中的通用技能，并与 `skills.sh.json` 展示分组对齐（线上 Pack 另行同步）。
- 通过 `notes/` 与 `blog/` 持续记录短想法与文章，并以 `meowpress locales` 维护中英译文哈希同步。
- 维持 Workers Builds 自动发布护栏，确保草稿路径、源码、`.agents/skills/` 与私有路径不进入线上产物。

## 4. 工作方法

- 指导与方法进化：编辑技能遵循 [agent-guidance](skills/agent-guidance/SKILL.md)，待验证方法放入 [skill-incubator](skills/skill-incubator/SKILL.md)，主线开发推进参考 [agile-development](skills/agile-development/SKILL.md)。
- 来源与边界：跨仓库迁移记录留存 [MIGRATION.md](MIGRATION.md)；私有跨项目协调已迁入 `~/.workcells/workspace/`。
- 基本规范对齐：内容、技能（按 `lang` 声明）与治理文档用简体中文（站点含 `/en/` 英文树），脚本、代码标识符与 Git 提交信息用英文；`CLAUDE.md` 指向 `@AGENTS.md`；保持 `main` 线性历史。

## 5. 核心机制与命令

- **公开构建门禁**：`build.ts` 校验锁定 `bun@1.4.4` 与零 `.agents/skills/` 后再打包；`build:ci` 依次运行单测、类型检查、Workers 构建、SHA-256 产物字节审计及无凭据 dry-run。
- **双语内容跟踪**：英文译文通过 frontmatter 的 `translation.source` 哈希与中文原文对应，由 `meowpress locales` 检测缺失与过期。

| 命令 | 用途 | 状态 | 参考 |
| --- | --- | --- | --- |
| `bun run test` / `bun run typecheck` | 运行发布脚本单测与 TypeScript 检查 | 可用 | [package.json](package.json) |
| `bun run build` | 使用锁定 `bun@1.4.4` 构建静态站点至 `dist/` | 可用 | [README.md](README.md#站点) |
| `bun run build:ci` | 完整测试 + 类型 + Workers 构建 + 资产审计 + dry-run | 可用 | [README.md](README.md#git-自动发布) |
| `bunx --no-install meowpress locales` | 检查中英译文缺失或过期清单 | 可用 | [README.md](README.md#语言) |

## 6. 变化、风险与健康

- 最近变化：`e3e0239`→`8d8a17e`（2026-11-21~22）新增本 `PROJECT-MAP.md`、根目录 [PRINCIPLES-INDEX.md](PRINCIPLES-INDEX.md) 与仓库内 `principles-index` 维护技能（含 `check_index.py` 校验与刷新流程）；退役 `skills/task-delegation/`，把 runner 路由并入 `divide-and-conquer`；并按索引迭代技能：`agent-guidance` 增加 Agent 可自行探索、保留底层结构的视图投影要求，`agile-development` 落实按当前主导约束定兼容与测试姿态与预算化安全审查门禁，`architecture` 增加“先修路，再装防护栏”，`divide-and-conquer` 增加 worker-advisor 多轮协作参考，`interface-design` 增加程序化渲染与视觉闭环。
- 走偏风险：将私有协调状态、具体业务项目命令或未脱敏路径混入公开仓库或博客构建产物。
- 债务与限制：线上 `skills.sh` Pack 与本地 `skills.sh.json`（含新增 `writing` 组）仍需单独按官方 Pack 流程核对同步；`workcells-development-loop` 尚待 Workcells 底座能力齐备后评估。
- 结论：**正常**。仓库内容边界清晰，公开构建与审计护栏完备。

## 7. 深入阅读

- 维护与来源：[README.md](README.md)、[AGENTS.md](AGENTS.md)、[MIGRATION.md](MIGRATION.md)
- 理论与方法入口：[theory/README.md](theory/README.md)
