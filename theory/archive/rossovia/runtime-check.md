---
name: runtime-check
description: Verify or diagnose Meowland CLI, Assistant, WorkCell, runner, and Dashboard execution chains with tests and real runtime evidence. Use for integration, startup, or delivery issues; not Agent reasoning evaluation or unrelated Blog work.
---

# Runtime Check

验证真实运行链路，而不是以页面显示“已连接”或一次 mock 成功代替功能验收。
需要多轮充分验证、修复复测或中断续接时，使用 [test-cycle](../test-cycle/SKILL.md)
管理本轮清单与证据；本技能提供运行链路的检查方法，不另建一份进度。

## 定位边界

确认用户在用的地址、启动方式、进程和数据目录。读涉及模块的 README、脚本与测试入口，
不要假定 localhost 上的旧服务是当前代码。不要重启不属于此次任务的服务。

常见链路为 meowland CLI/start → Dashboard → Assistant → WorkCell → Runner / CLI；
认知适配层与 Meilisearch 另查。只追踪失败涉及的环节，不把局部修复扩大成全仓测试。

## 确定性检查

执行检查前按技术栈读[执行与证据](../../../docs/maintenance/testing.md#执行与证据)；
新增、修改或清理测试时读[测试价值原则](../../../docs/maintenance/testing.md#测试价值)。

先检查失败落在了正确边界：普通工具错误应沿现有调用结果回到 Agent，不应直接终止整个执行。
发现局部重试、计数或特殊状态时，先确认为什么不能复用现有工具、事件和调度机制；不要用新的
限制掩盖接线错误。权限、持久化和取消边界仍由宿主保证。修复后检查同类入口，并验证错误反馈、
继续执行与恢复幂等，不编排模型必须纠正几次或选择哪条路径。通用原则见根 `AGENTS.md`。

- 前端或 Runner 接线：根目录 `bun run check`；修改 `packages/workcell-runner/` 时运行
  `bun run --filter @meowland/workcell-runner test` 和 `bun run --filter @meowland/workcell-runner typecheck`，
  再按改动覆盖对应 integration 或 transport。
- Go 改动：在实际 module 内先运行相关包的 `go test` 与构建。只有改动涉及共享状态、并发、租约、
  恢复或取消时才扩大到 `go test -race -count=1 ./...`；跨服务协议改动再检查两端，静态检查或
  发布边界需要时补 `go vet ./...`、`go build ./...`。已有 CI 的全量检查不因本地风险分级而删除。
- 优先补现有测试中的失败回归：事件幂等与顺序、断连恢复、取消、重试、权限撤销、敏感数据边界。
  只选相关契约，不为局部问题重建 E2E 框架。

## 真实链路检查

1. 用临时数据目录或明确的测试实例，记录本次地址和版本；不能覆盖个人数据。
2. 通过真实入口执行最小用户操作。跟随已有 request / wake / run 标识，核对请求、执行、终态、
   输出和 UI 是否一致。替代模型或 Runner 的 mock 不证明原生 CLI 或模型可用。
   独立模型对照优先复用 WorkCell 的公共提交入口，让宿主按新 Attempt 解析配置；历史
   Attempt 的临时 provider 文件可能已回收，不能作为后续试验的稳定配置。观察时等待权威
   终态，`starting` 仍是在途；回执不明按原身份核对，不重复创建执行。
   外部平台可以用隔离模拟服务经正式适配器接入，验证真实产品的收发、回执、权限与 Agent
   行为；独立核对模拟端收到的内容。说明模拟边界，真实平台适配另验，不因此阻塞产品链路测试。
3. 涉及 UI 时用浏览器实际交互，按改动检查桌面与移动端。检查可见结果、刷新恢复、重复消息、
   控件状态及错误提示，不只检查 HTTP 200 或截图存在。
4. 涉及个人交付时按 `apps/meowland/README.md` 验证构建产物与启动，不只跑源码 dev。
   `doctor` 成功不代表 CLI 已登录或模型能回答；CLI 能力按实际 profile 核对，不视为相同。
5. 真实 provider 调用只在已授权范围内进行。未调用就注明“真实模型未验证”，不能静默降级成 mock 后宣称通过。

遇到故障先记录可复现操作与实际错误。纯诊断请求报告原因；任务包含修复时，做最小修复并重复同一操作。
清理仅限本次创建的进程和测试数据；保留用户需要查看的预览并告知地址。

## 交付证据

简述改动、执行命令、观察到的用户结果和未验证部分。链接已有日志或测试记录即可，
不新增证据字段或状态系统。涉及模型行为质量时转用 `../agent-eval/SKILL.md`，
基础设施通过不等于 Agent 能力通过。
