---
name: docker-bun
description: Install dependencies and run Bun projects through Docker when host Bun is absent, incompatible, or intentionally unused. Covers Bun commands and development servers; not general container deployment or permission repair.
---

# Docker Bun

为已经选择 Docker 的 Bun 任务建立可重复运行环境。先读项目的 package.json、锁文件、
workspace 与运行约定，选择完整的挂载根目录、Bun 镜像版本和实际命令。不为了方便改装宿主
Bun、删除锁文件或换包管理器；环境选择仍服从用户与项目要求。

使用 [scripts/bun.sh](scripts/bun.sh)，将脚本与项目路径替换为当前环境的绝对路径。
`--image` 必须显式传入；把 `BUN_IMAGE` 设为符合项目要求的官方 `oven/bun` 固定标签或摘要，
先核对镜像来源、版本与平台，不把某次历史可用版本当作所有项目的默认版本。

```bash
bash /path/to/docker-bun/scripts/bun.sh --project /path/to/project --image "$BUN_IMAGE" -- install --frozen-lockfile
bash /path/to/docker-bun/scripts/bun.sh --project /path/to/project --image "$BUN_IMAGE" -- run build
bash /path/to/docker-bun/scripts/bun.sh --project /path/to/project --image "$BUN_IMAGE" -- test
```

有锁文件且任务不改依赖时优先 frozen 安装；初始化或已授权的依赖变更按项目约定更新锁文件。
脚本将项目可写挂载到 `/workspace`，以当前 UID/GID 执行，只传递明确的 Bun 参数而不拼接
shell。容器退出后删除容器，写入项目的依赖与产物仍保留。镜像可能需要联网拉取；依赖脚本
也会在容器中执行，挂载目录并非只读或隔离备份，只运行当前已授权的可信项目。

脚本不挂载宿主 home、Docker socket，也不自动转发凭据。私有源认证按项目既有方式配置，
不改公共源来绕过失败。安装得到的是容器平台依赖，不能据此宣称宿主可直接使用；后续
测试、构建与运行保持兼容的平台。挂载范围必须覆盖 workspace 依赖，容器外绝对路径和
symlink 目标不会自动可达。

## 开发服务与生命周期

服务支持配置时在容器内监听 `0.0.0.0`，通过 `--port` 只向宿主 loopback 发布：

```bash
bash /path/to/docker-bun/scripts/bun.sh --project /path/to/project --image "$BUN_IMAGE" --port 5173 --name project-ui --detach -- run dev --host 0.0.0.0
```

参数须由实际项目脚本支持。容器内仅监听 `127.0.0.1` 的服务通常不能经普通端口映射访问。
`--host-network` 是显式替代方案，不能与 `--port` 混用；它扩大网络共享边界，使用前核对
[Docker 平台支持](https://docs.docker.com/engine/network/drivers/host/)及任务允许范围，
不要自动调整 Docker 配置、关闭保护或改源码监听地址。平台支持不等于服务已经可达。

先检查对应服务，避免重复启动或停止无关容器。后台命令返回容器 ID 只说明容器启动，
还应查具体容器日志并从宿主请求实际地址；交付 URL、容器名或 ID、停止方式和已验证范围。
HTTP 成功不代替浏览器交互验收。前台用 Ctrl-C，后台按准确名称或 ID 停止，不按通用镜像名
批量清理。

将 Docker 客户端缺失、daemon 不可达、权限拒绝、镜像拉取失败和项目执行失败分开报告。
按环境提供的权限流程继续，不修改网络或安全配置，也不偷偷回退到宿主 Bun。

脚本参数与挂载语义参考 [docker run](https://docs.docker.com/reference/cli/docker/container/run/)；
真实镜像、安装和服务是否有效仍需在接收项目验证，参数检查不证明这些运行结果。
