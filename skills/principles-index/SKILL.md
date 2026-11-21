---
name: principles-index
description: 生成、刷新或校验本仓库（lidessen/readme）的原则与方法索引 PRINCIPLES-INDEX.md：按真实来源核对条目与状态，用脚本验证相对链接与标题锚点。用于维护本仓库的哲学/方法/原则检索入口；不用于其他项目的内容索引、博客分类或代码引用关系图。
metadata:
  short-description: 维护本仓库原则与方法索引
  lang: zh
---

# Principles Index · 原则与方法索引

维护仓库根目录的 [PRINCIPLES-INDEX.md](../../PRINCIPLES-INDEX.md)。索引是检索工具（finding
aid）：每条 = 主题、鉴别性搜索关键词、来源位置（文件 + 标题锚点）、状态。不概述论点、不改写
原文、不做第二权威源；判断与表述一律以来源原文为准，索引只负责让人找到它。

## 何时使用

- 新建、刷新或检查 PRINCIPLES-INDEX.md。
- 用户问“这个项目的哲学/方法论/原则写在哪里”“某个概念出自哪份材料”。
- `skills/`、`theory/`、`notes/`、`blog/` 的来源发生变化，需要判断索引是否要跟着改。

不适用：其他项目或跨仓库的内容索引、博客主题分类、代码引用关系图——说明边界即可，不套用本方法。

## 状态口径

| 状态 | 覆盖 | 阅读方式 |
| --- | --- | --- |
| 当前技能 | `skills/*/SKILL.md` 及被点名的方法 references | 当前维护的指导，可直接使用 |
| 方法摘编 | `theory/skill-development.md`、`theory/architecture-and-defrag.md` | 从形成资料整理的公开摘编，不是原始记录，不替代原文 |
| 演进想法 | `theory/thoughts/agile-development.md`、相关短想法 | 方法形成中的材料，不是已验证结论 |
| 历史原文 | `theory/theory.md`、`theory/skills.md`、`theory/thoughts/information.md` | 旧仓固定提交迁入，保留原始字节，按历史地位阅读 |
| 项目材料归档 | `theory/archive/**` | 有保留价值的 Rossovia 项目材料，不是本仓库当前方法 |
| 草稿 | `blog/_*.md` | `_` 前缀草稿，不进公开构建 |
| 短想法 | `notes/` 独立短文 | 个人观察，不构成方法 |
| 治理文档 | `AGENTS.md`、`README.md`、`MIGRATION.md`、`PROJECT-MAP.md`、`skills.sh.json` | 仓库级规则与来源记录 |

译文 `notes/*.en.md` 是派生副本（frontmatter `translation.source` 记录原文哈希），不作为独立来源收录。

## 收录标准

收录表达可复用判断、方法或原则的材料：全部 `skills/*/SKILL.md`；`theory/` 一级材料；与这些主题
直接相关的代表性 references、短想法与草稿；治理文档中作为原则陈述的章节。不收录：构建产物与站点
配置、语言文件、图片资产、与原则无关的个人观察。

## 刷新流程

1. 确认变化：来源新增、改名、移动、删除，或标题、状态变化（草稿转正、想法沉淀进技能）。
2. 更新 PRINCIPLES-INDEX.md 对应条目：链接指向真实文件与存在的标题锚点，状态按上表。不改写来源
   文件；删除条目前先确认来源确实已不在或明确不收录。
3. 运行校验，修到通过：

   ```sh
   python3 skills/principles-index/scripts/check_index.py
   ```

4. 更新索引头部的“最后核对”，报告：改了哪些条目、脚本输出、范围段仍欠的核对。

脚本只做确定性检查：相对链接的文件存在、`.md` 锚点能在目标文件的标题中找到。它不生成、不理解
条目语义——语义收录由维护者读来源完成；外链只计数不访问。不建自动提交钩子，提交按任务授权执行。

## 边界

- 覆盖面以索引“最后核对”为准；references 与短想法不逐条穷尽，需要时直接查对应目录。
- 历史原文与归档不改写；引用必须带状态，避免被当成当前方法。
- 脚本通过只证明链接成立，不证明条目选得准、关键词恰当、状态未漂移。