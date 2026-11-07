import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// meowpress's year + weekday formatter emits different punctuation across ICU
// versions. Keep the existing published format without changing article text.
export function normalizeWeekdayLabels(html: string): string {
  return html.replace(
    /(<span class="weekday">\d{4}), (Mon|Tue|Wed|Thu|Fri|Sat|Sun)(<\/span>)/g,
    "$1 $2$3",
  );
}

export async function stabilizeHomeDates(outputDirectory: string): Promise<void> {
  const path = join(outputDirectory, "index.html");
  const html = await readFile(path, "utf8");
  const stable = normalizeWeekdayLabels(html);
  if (stable !== html) await writeFile(path, stable, "utf8");
}
