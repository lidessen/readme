import { lstat } from "node:fs/promises";
import { resolve } from "node:path";

export function assertBuildRuntime(actualVersion: string, packageManager: string): void {
  if (`bun@${actualVersion}` !== packageManager) {
    throw new Error(`Build requires ${packageManager}; current runtime is bun@${actualVersion}.`);
  }
}

/** Require a clean public-build checkout in addition to includeProjectSkills: false. */
export async function assertPublicSkillsOnly(repositoryRoot: string): Promise<void> {
  const privateSkills = resolve(repositoryRoot, ".agents/skills");
  try {
    await lstat(privateSkills);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw error;
  }
  throw new Error(
    "Refusing to build: .agents/skills is not allowed in a public-build checkout. " +
      "Build from a clean checkout containing only the reviewed public skills/ tree.",
  );
}
