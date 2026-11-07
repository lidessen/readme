import { writeFile } from "node:fs/promises";
import { join } from "node:path";

export const notFoundPage = '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>404 · 页面未找到</title><body><main><h1>404</h1><p>页面未找到。</p><a href="/">返回首页</a></main></body></html>\n';

export async function writeNotFoundPage(outputDirectory: string): Promise<void> {
  await writeFile(join(outputDirectory, "404.html"), notFoundPage, "utf8");
}
