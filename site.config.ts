import { resolve } from "node:path";
import { meowSite } from "meowpress/build";

const repositoryRoot = import.meta.dir;

export default meowSite({
  content: resolve(repositoryRoot, "content"),
  skillsDirectory: repositoryRoot,
  includeProjectSkills: false,
  // Chinese is what the site and its content are written in; English is published under /en/.
  locales: {
    source: "zh",
    targets: { en: { label: "English" } },
  },
  notFound: {
    title: "页面未找到",
    message: "页面未找到。",
    homeLabel: "返回首页",
  },
  outputDirectory: resolve(repositoryRoot, "dist"),
  site: {
    name: "Lidessen's land",
    id: "lidessen",
    description: "一个混排长文和碎片想法的站点，主题多半是 Agent、软件设计和这些方法。",
    url: "https://lidessen.com",
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
      linksHeading: "找到我",
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
