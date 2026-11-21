# Structuring skill 设计记录

状态：2026-10-03 已扩展并重命名为 Architecture；原代码库方法保留为按需参考，真实任务效果尚待评估。

本文件保存原 Structuring skill 的形成依据、研究历史和边界，不属于普通 skill 激活时的必读内容。当前入口是 [`skills/architecture/SKILL.md`](../../skills/architecture/SKILL.md)，按对象读取代码库、技能体系或组织设计参考。

2026-10-03 的扩展将整体目的、责任与决策权、协作接合、实践检验和演进放在通用入口，
原代码库正文移入 `references/codebase-design.md`，原边界、语言和混合仓库参考保留。
技能体系 review 与长期组织设计各有按需参考，不将软件边界直接套用于人或指导载体。
以下名称、位置与形成过程保留初版语境，不再作为当前入口；本轮接线与格式检查也不能
证明实际加载或任务效果已改善。

## 要解决的问题

项目经常需要回答这些结构问题：代码、文档、配置和生成物应该放在哪里；哪些内容应该共置或拆开；目录、package、module、crate、binary 和 service 的边界是什么；名字如何表达职责、消费者和环境；混合语言项目如何连接而不把构建单元误当作运行单元。

现有相邻能力不能完整覆盖这个问题：

- `defrag` 处理已有的残留、重复、分散和错位责任，需要先知道目标结构。
- `agent-guidance` 处理 prompt、skill、AGENTS 等指导内容的载体与激活，不拥有代码和模块边界。
- `runtime-check` 处理实际执行链路，不替代结构判断。

因此需要一个通用 skill，提供“结构化判断”而不是一套固定目录模板。

## 已接受的设计决定

### 名称

使用 `structuring`，而不是 `project-organization` 或 `structure-design`。

这个名字描述的是持续把内容组织成清晰结构的动作，覆盖新建、评审、重组、命名和边界维护；不把问题缩小为项目管理或一次性架构设计。

### 放置位置

放在 `skills/structuring/`，因为它不依赖 Meowland 私有 API、固定路径或某个运行时角色，应该可以被不同项目和 Agent 复用。

### 方法而非模板

Skill 不规定默认的 `src/`、`packages/`、`internal/` 或 `common/` 树。它要求先恢复职责、依赖/API、构建/版本、运行/交付、状态/资源和 ownership/release 六类关系，再选择能够执行和验证的最小边界。

### 渐进披露

- `SKILL.md`：触发条件、核心判断、工作流程和交付格式。
- `references/decision-model.md`：共置、拆分、命名和边界强度。
- `references/language-idioms.md`：Node/TypeScript、Go、Rust、Python 的工具链线索。
- `references/hybrid-repositories.md`：跨语言、schema、生成物、平台、插件和多仓库关系。
- `references/review-and-evidence.md`：评审/改动模式、验证层级和报告格式。

完整研究史留在本文件，不进入每次激活的上下文。

## 理论和研究来源

核心方法来自模块化和结构判断的几个稳定关系：

- Parnas 的模块化原则：围绕容易变化或需要隐藏的设计决策组织模块，不简单照着执行流程拆分。[On the Criteria to Be Used in Decomposing Systems into Modules](https://ckrybus.com/static/papers/decomposing_systems_into_modules_1972.pdf)
- 当前 Meowland 的本地架构约定：区分 library/app、import/runtime/process/delivery 和当前/目标状态，见 [`repository.md`](../architecture/repo/repository.md)、[`library-app-boundaries.md`](../architecture/repo/library-app-boundaries.md)、[`packages.md`](../architecture/repo/packages.md)。
- 现有 skill 形成记录：研究和设计历史放在项目文档，激活文件只保留可改变当前判断的内容；格式验证不能代替行为和验收。

本轮只读研究的代表性项目如下：

| 方向            | 项目                                                             | 形成的可迁移观察                                                                             |
| --------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Node/TypeScript | Node.js、TypeScript、pnpm、Next.js、VS Code                      | manifest、exports、project references、build target 和运行环境共同定义边界；目录可能只是导航 |
| Go              | Go、Kubernetes、etcd、Prometheus、Caddy、OpenTelemetry Collector | module、package、`internal`、`cmd`、binary、plugin 和发布仓库不是同一概念                    |
| Rust            | Cargo、rust-analyzer、Tokio、ripgrep、Rust compiler              | workspace、crate、feature、proc-macro、平台 target 和最终 binary 需要分别建模                |
| Python          | CPython、Django、pytest、FastAPI、Ruff                           | `src`/flat 是工作流取舍；公共 facade、注册机制、application 和 process 必须区分              |
| 混合架构        | LLVM、Chromium、Envoy、Kubernetes、OpenTelemetry                 | source、build、API/schema、generated output、deploy 和 ownership 需要多张图表达              |

代表性的一手资料：

- [TypeScript project references](https://www.typescriptlang.org/docs/handbook/project-references)
- [Go module layout](https://go.dev/doc/modules/layout)
- [Cargo workspaces](https://doc.rust-lang.org/cargo/reference/workspaces.html)
- [Python src vs flat layout](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/)
- [Ruff project structure](https://github.com/astral-sh/ruff/blob/main/CONTRIBUTING.md#project-structure)
- [LLVM CMake](https://llvm.org/docs/CMake.html)
- [Chromium DEPS](https://chromium.googlesource.com/chromium/src/+/main/DEPS)
- [Kubernetes staging](https://github.com/kubernetes/kubernetes/blob/master/staging/README.md)
- [Envoy repository layout](https://github.com/envoyproxy/envoy/blob/main/REPO_LAYOUT.md)
- [OpenTelemetry Collector builder](https://github.com/open-telemetry/opentelemetry-collector/blob/main/cmd/builder/README.md)

## 不可直接迁移的内容

- 大型项目的 `OWNERS`、`CODEOWNERS`、`DEPS`、GN/Bazel/CMake 规则不能只按文件名复制；要迁移的是依赖约束、review、ownership 和发布关系。
- `public/`、`api/`、`pkg/`、`components/`、`plugin/`、`contrib/` 不是跨语言通用语义。
- `go.mod`、`Cargo.toml`、workspace 或 build target 不自动意味着独立服务、公开 API 或独立部署。
- CPython、LLVM、Chromium 的规模和工具链不应成为普通项目的目录模板。
- 跨语言项目不必强行合并成 monorepo，也不必因为语言不同就拆仓库；决定因素是原子提交、依赖隔离、版本治理、发布频率和 ownership。

## 与当前项目的关系

本 skill 可以帮助评审 `apps/`、`packages/node/`、`packages/go/` 和 `skills/` 的职责关系，但不改写当前 Meowland 的产品定位或模块 ownership。对现有架构，应先以源码、manifest、入口、运行调用和发布物核对文档；不因目录数量或历史计划自动得出拆分结论。

## 后续评估

需要用真实任务而不是关键词匹配验证它是否有效。至少准备以下三类场景：

1. 一个既有仓库中判断某目录是共享库、应用内部实现还是独立服务。
2. 一个 Node/Go/Rust/Python 混合仓库中追踪 source → build → artifact → runtime 的关系。
3. 一个已有结构需要重组的任务，观察 skill 是否保留未决关系、避免过度拆分，并能给出可执行的验证计划。

当前只证明了文件结构和内容已经写入；尚未证明 Agent 激活后会减少错误归类、改善命名或提高真实维护效率。后续应记录格式检查、行为观察、边界支持和用户验收，不把其中一项冒充全部证据。

## 2026-10-03：体系锻打

这轮先清点通用、项目开发和产品运行三处入口：24 个入口对应 23 个唯一维护源，运行侧
的 agent-personality 复用通用源。入口定位检查覆盖全库，正文与反例比较重点覆盖
architecture、agent-guidance、design-forge、defrag、assurance-review、research-synthesis、
design-steward 和 divide-and-conquer；没有对全部技能做真实任务验收。

保留这八种贡献。architecture 判断整体安排，design-forge 用反例与减法检验选择；两者
可以在同一任务中结合，不必接连运行两轮调查。把它们合并只会将不同触发塞进一个更大
入口，并未消除判断责任。assurance-review 保留局部保障审查，避免一次误拒就重做整体
设计；design-steward 保留维护者视角，避免为了判断哪些发现值得推动而重新启动调查。

独立阅读试验发现两处入口问题。design-forge 的描述只写技术设计，不能清楚表达技能和
组织规则的锻打；现已明确这些对象。两份 skill 是否该合并，在仅看描述时先命中 defrag，
读正文后才转到 agent-guidance；现已将技能载体的拆合写入后者描述，并收紧 defrag 到
保留有效责任与行为的整理。architecture 同时明确主 Agent 的综合责任，不成为前置审批。

另将 formation 参考中的“依次检查”改为“分别检查”，与主文不规定必经阶段的约定一致。
没有因此扩展评审流程或建立统一模板。

修改后由另一独立代理先看描述、再按歧义读取正文，对七个相邻请求作出有依据的首选。
其中技能拆合进入 agent-guidance，已有组织反复追加协调岗位进入 design-forge，新团队
权责设计进入 architecture，已确定维护源的整理进入 defrag。普通更名保留为普通任务。
这些是阅读与选择观察，前后请求并非冻结的同一实验，不据此声称匹配改善或长期效果。

本机 YAML、入口名称、97 个相对引用和本轮文件格式检查通过；未调用产品中的真实模型，
未验证运行环境中的自动发现、加载、协作效果或维护效率。本记录保留判断来路，当前
方法仍以各技能正文为准，不另建第二份规则。
