# Skills

这个仓库收录用于 Agent 开发协作的通用技能，以及相关的理论、感悟和文章。技能覆盖架构与界面设计、文档写作、调研、分治协作、测试和依赖维护，供不同项目按任务选用；理论与文章也可以独立阅读。维护本仓库时先读 [AGENTS.md](AGENTS.md)。

## 内容

- [skills/](skills/)：可安装的技能，每个目录以 `SKILL.md` 为入口，包含方法说明和必要资源。其中 `workcells-development-loop` 对应的工具仍在改造中、当前不可用，暂不列入安装推荐。
- [theory/](theory/README.md)：理论原文与方法摘编，涉及表达、信息管理、技能方法和结构整理。
- [notes/](notes/)：个人观察、短想法和有待探索的问题。
- [blog/](blog/)：围绕 Agent 与软件设计的文章草稿及图片。以 `_` 开头的文章保留草稿状态。

## 站点

仓库根目录的 meowpress 构建把上面的文章和短想法做成静态站点。内容仍写在 `blog/` 和 `notes/`；构建时把 `blog/` 放进内容树的 `posts/`，把 `notes/` 放进 `thoughts/`，并带上 `blog/assets/` 里的图片。以 `_` 开头的文章仍是草稿，不会进输出。

使用 `package.json` 锁定的 [Bun](https://bun.sh) 1.4.4。构建会拒绝其他版本：

```sh
bun install --frozen-lockfile
bun run build
```

输出在 `dist/`。类型检查：`bun run typecheck`。当前锁定的包是 `meowpress@0.3.0-alpha.5`、`meowjsx@0.3.0-alpha.1`、`meowcss@0.3.0-alpha.2`。

内置 Blog 已使用 Meowtail Journal 的真实页面、条目和正文组件。Newsreader、Inter、JetBrains Mono 字体及许可证随静态产物本地发布；内容、地址、筛选和技能浏览功能保持不变。

### 发布边界

`meowpress@0.3.0-alpha.5` 默认不发布项目里的 `.agents/skills/`，本站也显式设置 `includeProjectSkills: false`。另外保留干净检出检查，在发现该目录（含符号链接）时中止构建，避免本地技能混入发布工作区。请从干净检出构建，仅发布已审核的根 `skills/`、文章和短想法；不要为部署删除自己正在使用的本地技能。

每次发布先确认提交，运行测试、类型检查和构建，再审核完整 `dist/`。只发布 `dist/` 的内容，不上传仓库根目录、`.agents/`、环境文件或源代码。内容或依赖更新后必须重新审核；一次审核不代表后续提交获准公开。

### Cloudflare Workers Static Assets

部署工具还需要 Node.js 22.18 或更高版本。`cloudflare.config.ts` 定义纯静态站点，`wrangler.config.ts` 将资产目录限定为 `dist/`。没有应用 Worker、数据绑定或自动域名变更。

```sh
bun install --frozen-lockfile
bun run test
bun run typecheck
bun run build:workers
bun run check:workers
```

最后一步是部署预检，不上传文件，也不需要 Cloudflare 凭据。新版 Meowpress 原生生成带站点主题的 `404.html`，并固定首页日期标签的格式；本站保留中文错误提示，不再另行覆盖错误页或修改生成的日期 HTML。

审核通过后，使用已授权的 Cloudflare 登录运行 `bun run deploy`。自定义域名在部署验证后单独配置，不由构建更改。

#### Git 自动发布

使用 Cloudflare Workers Builds，生产分支只监听 `main`，关闭其他分支和 PR 的预览发布。合并到 `main` 就代表批准公开该提交的站点内容；内容、依赖与构建脚本应在合并前审查。自动检查不能代替内容审核。

- 构建命令：`bun install --frozen-lockfile --ignore-scripts && bun run build:ci`
- 部署命令：`bun run deploy:ci`
- 根目录：`/`；构建缓存：关闭。
- 构建变量：`BUN_VERSION=1.4.4`、`NODE_VERSION=26.12.0`、`SKIP_DEPENDENCY_INSTALL=1`、`CF_SEND_TELEMETRY=false`、`CLOUDFLARE_ACCOUNT_ID=dd50f62e0b7df1f35fcb6b661873e132`。
- 发布 token 只授予目标账户的 Workers Scripts Edit；不要使用默认宽权限模板，不授予 KV、R2、DNS 或 Workers Routes。token 只存入 Cloudflare 的构建凭据管理，不放进 Git、命令参数或构建日志。若平台支持并已验证单个 Worker 权限，应进一步收窄到 `lidessen-readme`。

`build:ci` 依次运行测试、类型检查、静态构建、产物检查和无凭据 dry-run。产物检查确认只有 `lidessen-readme` 的静态资产，无应用模块、数据绑定或路由变更；逐个比较上传目录与 `dist/` 字节，拒绝符号链接、草稿路径、环境文件、源代码、source map 和常见凭据模式，并在构建日志输出 SHA-256 清单。

`deploy:ci` 只允许 Workers Builds 的 `main` 构建，核对构建提交与 Git HEAD 一致，再次检查相同产物后以 `--prebuilt --no-provision` 发布，版本说明记录提交 SHA。构建或审核失败会中止发布，线上保留上次成功版本。

启用前先将本 PR 中的 Workers 配置和上述命令合入 `main`，确认它包含当前站点版本；不要对旧 `main` 使用默认部署命令，也不要把准备分支设为生产分支来代替合并。然后连接仓库、保存已核实权限的构建 token，并配置以上参数。提交这些文件本身不会创建 Cloudflare 触发器或启用自动发布。首次运行后还需核对构建 SHA、部署版本、正式域名正常页面及私有/草稿路径的 404。

## 安装

### 按任务选择技能

技能源码位于根 `skills/`，每个技能目录包含入口和所需资源。根据任务选择方法，再阅读对应 `SKILL.md`：

| 任务 | 方法入口 |
| --- | --- |
| 组织职责、依赖与整体结构 | [architecture](skills/architecture/SKILL.md) |
| 设计 Agent 指导或发展方法 | [agent-guidance](skills/agent-guidance/SKILL.md)、[skill-incubator](skills/skill-incubator/SKILL.md) |
| 分治协作 | [divide-and-conquer](skills/divide-and-conquer/SKILL.md) |
| 在 Herdr + Magpie 中委托任务并选择模型通道 | [task-delegation](skills/task-delegation/SKILL.md) |
| 设计测试、选择投入或接续复测 | [risk-driven-testing](skills/risk-driven-testing/SKILL.md) |
| 整理结构或评估依赖升级 | [defrag](skills/defrag/SKILL.md)、[dependency-upgrade](skills/dependency-upgrade/SKILL.md) |
| 在 Docker 中运行 Bun | [docker-bun](skills/docker-bun/SKILL.md) |
| 评估计划续费与配额价值 | [plan-value-analysis](skills/plan-value-analysis/SKILL.md) |
| 界面设计与改进 | [interface-design](skills/interface-design/SKILL.md)、[ui-improvement](skills/ui-improvement/SKILL.md) |
| 撰写项目文档 | [doc-writing](skills/doc-writing/SKILL.md) |
| 调研材料与想法 | [research-synthesis](skills/research-synthesis/SKILL.md) |

多轮测试和中断续接的方法在 `risk-driven-testing` 的按需参考中；隔离现场评估方法在 `agent-guidance` 的评估参考中。安装时先查看所选仓库版本实际提供的技能。

### Pack

Pack 提供分组浏览和安装入口，成员与仓库源码分别维护：

| Pack | 技能数 | 包含的技能 |
| --- | ---: | --- |
| [lidessen](https://skills.sh/p/VwNOI0FZ0EAGV7Hy) | 19 | 以下各组去重后的全部技能 |
| [agent](https://skills.sh/p/djYQ0UTttmOpfna4) | 4 | [skill-incubator](skills/skill-incubator/SKILL.md)、[agent-guidance](skills/agent-guidance/SKILL.md)、[agent-personality](skills/agent-personality/SKILL.md)、[divide-and-conquer](skills/divide-and-conquer/SKILL.md) |
| [development](https://skills.sh/p/SazSJU8yDLRSqIF5) | 13 | [architecture](skills/architecture/SKILL.md)、[assurance-review](skills/assurance-review/SKILL.md)、[concept-naming](skills/concept-naming/SKILL.md)、[defrag](skills/defrag/SKILL.md)、[design-forge](skills/design-forge/SKILL.md)、[design-steward](skills/design-steward/SKILL.md)、[doc-writing](skills/doc-writing/SKILL.md)、[interface-design](skills/interface-design/SKILL.md)、[ui-improvement](skills/ui-improvement/SKILL.md)、[oneshot](skills/oneshot/SKILL.md)、[risk-driven-testing](skills/risk-driven-testing/SKILL.md)、[docker-bun](skills/docker-bun/SKILL.md)、[dependency-upgrade](skills/dependency-upgrade/SKILL.md) |
| [workflow](https://skills.sh/p/id3m9AGDJSzskEsP) | 2 | [research-synthesis](skills/research-synthesis/SKILL.md)、[plan-value-analysis](skills/plan-value-analysis/SKILL.md) |

Pack 的成员按 [`skills.sh.json`](skills.sh.json) 的分组定义，各组可以交叉包含同一技能，同一份技能源码不因分组重复；GitHub 安装不受分组限制，项目按任务选择所需技能即可。线上 Pack 的成员可能滞后于源码（如缺少后加技能），以上表为准。

Pack 的完整安装尚未通过验收，已有验证副本未完整取得部分技能的引用文件和脚本。完整验证前，项目安装请继续使用下面的 GitHub 直接安装命令。

### 从 GitHub 安装

需要 Node.js 22.20 或更高版本。使用官方 [Skills CLI](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)，可先查看可安装的技能：

```sh
npx --yes skills@1.7.4 add lidessen/skills --list
```

在项目根目录安装需要的技能，例如界面设计。安装会替换同名技能目录；已有本地改动时，先另行备份再执行：

```sh
npx --yes skills@1.7.4 add lidessen/skills --skill interface-design -a codex --copy -y
```

该命令将技能完整复制到项目的 `.agents/skills/`，并在项目根目录记录 `skills-lock.json`。示例选择 Codex；使用其他 Agent 时，按 CLI 文档调整 `-a` 参数。将安装目录与锁文件一起纳入项目版本控制。

## 使用

从当前任务选择方法：[architecture](skills/architecture/SKILL.md) 用于职责、依赖与整体结构设计，[interface-design](skills/interface-design/SKILL.md) 用于界面视觉与交互，[doc-writing](skills/doc-writing/SKILL.md) 用于项目文档，[oneshot](skills/oneshot/SKILL.md) 用于一次明确请求直接落地并验收。

安装后，在 Agent 任务中明确所需技能和要解决的问题，例如“使用 interface-design 检查这个页面的视觉层级与交互，并说明改进建议”。技能的发现与调用方式以所用 Agent 为准。

阅读所选技能的 `SKILL.md`，再按任务需要使用其中的参考资料和脚本。跨技能链接提供相邻方法的阅读入口；需要使用这些方法时再安装对应技能。

脚本依赖按需准备：`interface-design` 的图像处理脚本使用 Python 3 和 Pillow；相关浏览器采集测试及 `ui-improvement` 的浏览器脚本使用 Playwright。具体依赖和参数见各技能说明。

## 更新

更新前先检查安装目录中的本地改动。CLI 会替换同名技能目录；确认需要保留的改动已另行保存后，重新运行对应的 `add` 命令，沿用所需技能名称、Agent 和复制方式。项目专属规则使用独立命名的技能维护，避免混入上游安装副本。

项目中的安装副本不会随 GitHub 或 Pack 变更自动同步。Pack 的成员也需分别维护：调整一个分组，不会自动修改其他重叠分组。使用 Pack 安装时，应在其内容更新后主动执行 CLI 更新；具体方式见官方 [Pack 更新说明](https://www.skills.sh/docs/packs#update-a-pack)。

## 来源

内容来源、命名变更和适配记录见 [MIGRATION.md](MIGRATION.md)。文献、素材与第三方引用的出处保留在各文件中。
