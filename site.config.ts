import { resolve } from "node:path";
import { meowSite } from "meowpress/build";

const repositoryRoot = import.meta.dir;

export default meowSite({
  content: resolve(repositoryRoot, "content"),
  skillsDirectory: repositoryRoot,
  outputDirectory: resolve(repositoryRoot, "dist"),
  site: {
    name: "Lidessen's land",
    id: "lidessen",
    description:
      "A mixed timeline of long-form posts and fragmentary thoughts about agents and software design.",
    skillsPackage: "lidessen/readme",
    repositorySourceUrl: "https://github.com/lidessen/readme/tree/main",
    contentDirectory: "content",
    images: {
      hero: "images/hero-black-cat.png",
      feed: "images/feed-black-cat.png",
    },
    about: {
      heading: "Lidessen",
      paragraphs: [
        "这里放长一点的文章和短一点的想法，主题多半是 Agent、软件设计和旁边那些方法。",
        "技能按任务选来用就行，和这个仓库公开的方法是同一套。",
      ],
      linksHeading: "Find me",
      links: [
        {
          label: "GitHub",
          handle: "@lidessen",
          href: "https://github.com/lidessen",
        },
      ],
    },
  },
});
