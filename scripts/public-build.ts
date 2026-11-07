import { lstat } from "node:fs/promises";
import { resolve } from "node:path";

export function assertBuildRuntime(actualVersion: string, packageManager: string): void {
  if (`bun@${actualVersion}` !== packageManager) {
    throw new Error(`Build requires ${packageManager}; current runtime is bun@${actualVersion}.`);
  }
}

/** meowpress discovers both skills/ and .agents/skills/ by default. */
export async function assertPublicSkillsOnly(repositoryRoot: string): Promise<void> {
  const privateSkills = resolve(repositoryRoot, ".agents/skills");
  try {
    await lstat(privateSkills);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw error;
  }
  throw new Error(
    "Refusing to build: .agents/skills exists and meowpress would publish it. " +
      "Build from a clean checkout containing only the reviewed public skills/ tree.",
  );
}
