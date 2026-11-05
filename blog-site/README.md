# Lidessen's land

用 [meowpress](https://github.com/lidessen/meowland) 把仓库里的文章和短想法建成静态站点。内容仍写在仓库根的 `blog/` 和 `notes/`，构建时再放进 meowpress 要的 `posts/` 和 `thoughts/`。以 `_` 开头的文章保持草稿，不会进输出。

需要 [Bun](https://bun.sh) 1.4 或更高版本。当前锁定的包是 `meowpress@0.3.0-alpha.2`、`meowjsx@0.3.0-alpha.1`、`meowcss@0.3.0-alpha.2`。

```sh
bun install
bun run build
```

输出在 `dist/`。类型检查：`bun run typecheck`。
