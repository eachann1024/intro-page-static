import "./styles.css";
import { createLiquid } from "../components/canvasui/LiquidVanilla.ts";
import { createRipple } from "../components/canvasui/RippleVanilla.ts";
import { createClouds } from "../components/canvasui/CloudsVanilla.ts";
import { createGlitch } from "../components/canvasui/GlitchVanilla.ts";
import { createRetroDither } from "../components/canvasui/RetroDitherVanilla.ts";

const effectNames = ["liquid", "ripple", "clouds", "glitch", "dither"] as const;
type EffectName = (typeof effectNames)[number];
type EffectInstance = { destroy: () => void } | null;

type ProductScreenshot = {
  src: string;
  alt: string;
  caption: string;
};

type ShipCommit = {
  sha: string;
  time: string;
  date: string;
  message: string;
  url: string;
};

type ShipEntry = {
  id: string;
  name: string;
  en: string;
  repoUrl: string;
  summary: string;
  latestDate: string;
  commits: ShipCommit[];
};

const shipLog: ShipEntry[] = [
  {
    id: "run",
    name: "鹅的运行",
    en: "goose-run",
    repoUrl: "https://github.com/eachann1024/goose-run",
    summary: "升级为 AppKit + WKWebView 原生 macOS 应用，接入真实 PTY 与脚本工作流。",
    latestDate: "2026.07",
    commits: [
      { sha: "d7d36a9", time: "2026-07-23 14:26", date: "2026.07.23", message: "feat: 情况有变、更换 Mac 系统架构", url: "https://github.com/eachann1024/goose-run/commit/d7d36a9" },
      { sha: "786d7a2", time: "2026-07-21 17:03", date: "2026.07.21", message: "fix: stabilize terminal copy and font profile", url: "https://github.com/eachann1024/goose-run/commit/786d7a2" },
      { sha: "d2ed4c8", time: "2026-07-20 08:31", date: "2026.07.20", message: "Merge pull request #2 from eachann1024/feat/comprehensive-quality-pass", url: "https://github.com/eachann1024/goose-run/commit/d2ed4c8" },
      { sha: "c51f405", time: "2026-07-20 00:46", date: "2026.07.20", message: "完善原生终端与工作台交互", url: "https://github.com/eachann1024/goose-run/commit/c51f405" },
      { sha: "381bf84", time: "2026-07-16 19:55", date: "2026.07.16", message: "修复 => 恢复终端命令高亮", url: "https://github.com/eachann1024/goose-run/commit/381bf84" },
      { sha: "a6c3bfd", time: "2026-07-16 19:49", date: "2026.07.16", message: "修复 => 终端 Nerd Font 图标显示", url: "https://github.com/eachann1024/goose-run/commit/a6c3bfd" },
      { sha: "287defe", time: "2026-07-16 14:44", date: "2026.07.16", message: "修复 => 恢复文本选中复制", url: "https://github.com/eachann1024/goose-run/commit/287defe" },
      { sha: "eb4ffed", time: "2026-07-14 14:35", date: "2026.07.14", message: "修复 => Ctrl+C 中断后保留终端会话", url: "https://github.com/eachann1024/goose-run/commit/eb4ffed" },
      { sha: "fc5b082", time: "2026-07-13 15:28", date: "2026.07.13", message: "文档 => 清理过时项目提示词", url: "https://github.com/eachann1024/goose-run/commit/fc5b082" },
      { sha: "f3a77df", time: "2026-07-13 15:23", date: "2026.07.13", message: "修复 => 中断后显示终端输入提示", url: "https://github.com/eachann1024/goose-run/commit/f3a77df" },
    ],
  },
  {
    id: "note",
    name: "鹅的笔记",
    en: "goose-note",
    repoUrl: "https://github.com/eachann1024/goose-notes",
    summary: "连接真实磁盘文件夹，加入版本快照回滚、PDF / Word 导出和 AI 行内辅写。",
    latestDate: "2026.07",
    commits: [
      { sha: "3777c8c", time: "2026-07-22 17:59", date: "2026.07.22", message: "feat: 新增原生编辑器并增强 AI 上下文", url: "https://github.com/eachann1024/goose-notes/commit/3777c8c" },
      { sha: "eba315d", time: "2026-07-20 11:44", date: "2026.07.20", message: "Merge pull request #13 from eachann1024/feature/quicknote-image-export", url: "https://github.com/eachann1024/goose-notes/commit/eba315d" },
      { sha: "7cb4af3", time: "2026-07-20 11:11", date: "2026.07.20", message: "[优化] 快捷键展示按系统格式化并关闭拼写误标", url: "https://github.com/eachann1024/goose-notes/commit/7cb4af3" },
      { sha: "c95823e", time: "2026-07-20 10:35", date: "2026.07.20", message: "[优化] 完善速记槽位与图片导出样式", url: "https://github.com/eachann1024/goose-notes/commit/c95823e" },
      { sha: "0036008", time: "2026-07-20 08:57", date: "2026.07.20", message: "修复速记数据安全并完善主窗可靠性与无障碍体验 (#11)", url: "https://github.com/eachann1024/goose-notes/commit/0036008" },
      { sha: "187ce8b", time: "2026-07-20 08:37", date: "2026.07.20", message: "Revert \"Merge pull request #12 from codex/native-webview-rebuild\"", url: "https://github.com/eachann1024/goose-notes/commit/187ce8b" },
      { sha: "e6289ca", time: "2026-07-20 08:33", date: "2026.07.20", message: "Merge pull request #12 from codex/native-webview-rebuild", url: "https://github.com/eachann1024/goose-notes/commit/e6289ca" },
      { sha: "0cdb77b", time: "2026-07-20 02:32", date: "2026.07.20", message: "重构为原生 macOS 鹅的笔记", url: "https://github.com/eachann1024/goose-notes/commit/0cdb77b" },
      { sha: "1c450bd", time: "2026-07-19 16:38", date: "2026.07.19", message: "Release 0.0.38 (42) (#212)", url: "https://github.com/eachann1024/goose-notes/commit/1c450bd" },
      { sha: "b1116f2", time: "2026-07-19 13:44", date: "2026.07.19", message: "Merge pull request #204 from eachann1024/feature/app-language-localization", url: "https://github.com/eachann1024/goose-notes/commit/b1116f2" },
    ],
  },
  {
    id: "marks",
    name: "鹅的书签",
    en: "goose-marks",
    repoUrl: "https://github.com/eachann1024/goose-mark",
    summary: "优化书签图标回退与域名展示，强化分组浏览与 Windows uTools 稳定性。",
    latestDate: "2026.07",
    commits: [
      { sha: "134b868", time: "2026-07-22 17:48", date: "2026.07.22", message: "feat: 优化书签图标回退与域名展示", url: "https://github.com/eachann1024/goose-mark/commit/134b868" },
      { sha: "3b1165e", time: "2026-07-22 14:18", date: "2026.07.22", message: "chore: remove legacy tauri remnants", url: "https://github.com/eachann1024/goose-mark/commit/3b1165e" },
      { sha: "3143d1f", time: "2026-07-19 23:36", date: "2026.07.19", message: "feat: 书签标题描述溢出时悬停显示完整内容", url: "https://github.com/eachann1024/goose-mark/commit/3143d1f" },
      { sha: "88c35be", time: "2026-07-16 10:31", date: "2026.07.16", message: "fix: 优化 Windows uTools 稳定性", url: "https://github.com/eachann1024/goose-mark/commit/88c35be" },
      { sha: "955e778", time: "2026-07-16 10:22", date: "2026.07.16", message: "fix: 优化子分组标题与悬停交互", url: "https://github.com/eachann1024/goose-mark/commit/955e778" },
      { sha: "62f4940", time: "2026-07-10 08:39", date: "2026.07.10", message: "部署 => 增加 Sites 托管构建与发布配置", url: "https://github.com/eachann1024/goose-mark/commit/62f4940" },
      { sha: "66285f2", time: "2026-07-08 16:35", date: "2026.07.08", message: "修复 => 修复窗口高度恢复兼容与回放一致性", url: "https://github.com/eachann1024/goose-mark/commit/66285f2" },
      { sha: "02fc54b", time: "2026-07-06 10:02", date: "2026.07.06", message: "feat: improve detached window search continuity", url: "https://github.com/eachann1024/goose-mark/commit/02fc54b" },
      { sha: "fa36cbd", time: "2026-07-05 00:37", date: "2026.07.05", message: "fix: improve utools compatibility", url: "https://github.com/eachann1024/goose-mark/commit/fa36cbd" },
      { sha: "a20ce3e", time: "2026-07-03 16:08", date: "2026.07.03", message: "fix: simplify bookmark edit actions", url: "https://github.com/eachann1024/goose-mark/commit/a20ce3e" },
    ],
  },
  {
    id: "2fa",
    name: "鹅的验证",
    en: "goose-2fa",
    repoUrl: "https://github.com/eachann1024/goose-2fa",
    summary: "同步分组能力，优化一级分组与快捷入口，完善快速取码与数据可靠性。",
    latestDate: "2026.07",
    commits: [
      { sha: "4510208", time: "2026-07-22 14:16", date: "2026.07.22", message: "fix: 同步分组并移除 Tauri 架构", url: "https://github.com/eachann1024/goose-2fa/commit/4510208" },
      { sha: "eb29592", time: "2026-07-20 10:35", date: "2026.07.20", message: "feat: 优化一级分组与快捷入口体验", url: "https://github.com/eachann1024/goose-2fa/commit/eb29592" },
      { sha: "0e11fd6", time: "2026-07-20 08:41", date: "2026.07.20", message: "Merge pull request #1 from eachann1024/base-ui", url: "https://github.com/eachann1024/goose-2fa/commit/0e11fd6" },
      { sha: "8708ccc", time: "2026-07-20 00:52", date: "2026.07.20", message: "ci: 在 PR 中运行质量门禁", url: "https://github.com/eachann1024/goose-2fa/commit/8708ccc" },
      { sha: "36dee1c", time: "2026-07-20 00:51", date: "2026.07.20", message: "feat: 完善分组、快速取码与数据可靠性", url: "https://github.com/eachann1024/goose-2fa/commit/36dee1c" },
      { sha: "1321e61", time: "2026-06-09 13:41", date: "2026.06.09", message: "chore: 更新 2fa 鸭子图标为透明圆角版本", url: "https://github.com/eachann1024/goose-2fa/commit/1321e61" },
      { sha: "e523c3d", time: "2026-06-07 11:36", date: "2026.06.07", message: "feat: add drag-to-reorder and grid/list view toggle", url: "https://github.com/eachann1024/goose-2fa/commit/e523c3d" },
      { sha: "e0b4fa7", time: "2026-06-04 01:29", date: "2026.06.04", message: "feat(ui): 迁移在用组件至 HeroUI v3 并加可调试构建与 vendor 分包", url: "https://github.com/eachann1024/goose-2fa/commit/e0b4fa7" },
      { sha: "f1226bc", time: "2026-06-04 00:51", date: "2026.06.04", message: "chore: WIP baseline before goose rebuild (monitoring removal / HeroUI / deps / build)", url: "https://github.com/eachann1024/goose-2fa/commit/f1226bc" },
      { sha: "9a7e621", time: "2026-05-28 11:46", date: "2026.05.28", message: "feat: add quick-code mode for instant OTP paste from uTools search bar", url: "https://github.com/eachann1024/goose-2fa/commit/9a7e621" },
    ],
  },
  {
    id: "monitor",
    name: "鹅的监控",
    en: "goose-monitor",
    repoUrl: "https://github.com/eachann1024/goose-monitor",
    summary: "完成分平台打包、Linux 图标识别，Windows 抓图标不再闪黑窗。",
    latestDate: "2026.07",
    commits: [
      { sha: "8d728b6", time: "2026-07-20 08:42", date: "2026.07.20", message: "Merge pull request #1 from eachann1024/feat/project-quality-pass", url: "https://github.com/eachann1024/goose-monitor/commit/8d728b6" },
      { sha: "20e9809", time: "2026-07-20 01:15", date: "2026.07.20", message: "ci: align actions and checks with supported runtimes", url: "https://github.com/eachann1024/goose-monitor/commit/20e9809" },
      { sha: "d98e35a", time: "2026-07-20 01:09", date: "2026.07.20", message: "fix: satisfy pinned Rust lint rules", url: "https://github.com/eachann1024/goose-monitor/commit/d98e35a" },
      { sha: "3d99ef4", time: "2026-07-20 01:02", date: "2026.07.20", message: "fix: make clean CI builds reproducible", url: "https://github.com/eachann1024/goose-monitor/commit/3d99ef4" },
      { sha: "2c0bbc1", time: "2026-07-20 00:57", date: "2026.07.20", message: "feat: harden process management and quality gates", url: "https://github.com/eachann1024/goose-monitor/commit/2c0bbc1" },
      { sha: "87e2176", time: "2026-07-18 22:43", date: "2026.07.18", message: "fix: restore Windows app icons and refine search ranking", url: "https://github.com/eachann1024/goose-monitor/commit/87e2176" },
      { sha: "806852c", time: "2026-07-02 13:56", date: "2026.07.02", message: "feat: support fuzzy process search", url: "https://github.com/eachann1024/goose-monitor/commit/806852c" },
      { sha: "11ac564", time: "2026-06-29 13:42", date: "2026.06.29", message: "feat: per-category list columns and keyboard hints", url: "https://github.com/eachann1024/goose-monitor/commit/11ac564" },
      { sha: "c3e3a61", time: "2026-06-29 09:47", date: "2026.06.29", message: "refactor: support theme sync and auto color scheme", url: "https://github.com/eachann1024/goose-monitor/commit/c3e3a61" },
      { sha: "f5ffa2f", time: "2026-06-18 14:56", date: "2026.06.18", message: "feat: add tray cleanup-line module and uTools slash-key search focus", url: "https://github.com/eachann1024/goose-monitor/commit/f5ffa2f" },
    ],
  },
];

const products = [
  {
    id: "note",
    name: "鹅的笔记",
    en: "goose-note",
    line: "本地优先的 Notion 风格笔记，支持块编辑、本地文件夹与 AI 辅助。",
    tags: ["uTools", "BlockNote", "AI"],
    signal: "持续迭代",
    channel: "发布渠道：uTools 插件 · 同时支持浏览器运行",
    screenshots: [
      { src: "/assets/products/note/editor.webp", alt: "鹅的笔记编辑器，左侧是笔记树，右侧是块编辑正文", caption: "块编辑器与本地笔记树" },
      { src: "/assets/products/note/format-repair.webp", alt: "鹅的笔记深色界面中的本地文件格式修复提示", caption: "本地文件格式修复" },
    ] satisfies ProductScreenshot[],
  },
  {
    id: "run",
    name: "鹅的运行",
    en: "goose-run",
    line: "把本地命令变成可复用、可监控、可安全运行的桌面工作流。",
    tags: ["macOS", "AppKit", "真实 PTY"],
    signal: "原生重构",
    channel: "发布渠道：macOS 原生应用 · 早期曾提供 uTools 插件",
    screenshots: [
      { src: "/assets/products/run/control-deck.webp", alt: "鹅的运行深色控制台界面预览，包含脚本库、运行状态和终端", caption: "当前产品方向预览 · 脚本控制台" },
      { src: "/assets/products/run/editor-preview.webp", alt: "鹅的运行浅色脚本编辑与日志终端界面预览", caption: "当前产品方向预览 · 编辑与日志" },
    ] satisfies ProductScreenshot[],
  },
  {
    id: "marks",
    name: "鹅的书签",
    en: "goose-marks",
    line: "在 uTools 里分类、搜索与快速保存网页的极简书签管理工具。",
    tags: ["Vue 3", "uTools", "AI"],
    signal: "持续焕新",
    channel: "发布渠道：uTools 插件",
    screenshots: [
      { src: "/assets/products/marks/list-light.webp", alt: "鹅的书签深色网格视图，展示分组、搜索和书签卡片", caption: "深色主题与网格浏览" },
      { src: "/assets/products/marks/grid-dark.webp", alt: "鹅的书签暖白色列表视图，展示分组、搜索和书签条目", caption: "列表视图与二级分组" },
    ] satisfies ProductScreenshot[],
  },
  {
    id: "monitor",
    name: "鹅的监控",
    en: "goose-monitor",
    line: "能看懂应用分组、也能一键结束进程的跨平台活动监视器。",
    tags: ["Tauri 2", "uTools", "Rust"],
    signal: "跨平台",
    channel: "发布渠道：桌面应用 · 提供 uTools 插件版",
    screenshots: [
      { src: "/assets/products/monitor/main-dark.webp", alt: "鹅的监控深色主界面，按应用归并进程并展示资源占用", caption: "应用分组与真实资源占用" },
      { src: "/assets/products/monitor/tray-timer.webp", alt: "鹅的监控菜单栏定时退出拨盘", caption: "菜单栏定时退出" },
    ] satisfies ProductScreenshot[],
  },
  {
    id: "2fa",
    name: "鹅的验证",
    en: "goose-2fa",
    line: "在 uTools 主搜索框快速查找并粘贴 2FA / OTP 验证码。",
    tags: ["uTools", "2FA", "键盘流"],
    signal: "已经能用",
    channel: "发布渠道：uTools 插件 · 本地加密存储",
    screenshots: [
      { src: "/assets/products/2fa/main.webp", alt: "鹅的验证 uTools 窗口首页，展示验证码网格、分组筛选和搜索", caption: "uTools 窗口 · 验证码网格" },
      { src: "/assets/products/2fa/add-account.webp", alt: "鹅的验证添加账户界面，支持剪贴板导入、屏幕扫码和手动输入", caption: "uTools 窗口 · 添加账户" },
    ] satisfies ProductScreenshot[],
  },
];

const icon = (name: "arrow" | "github" | "mail" | "spark" | "moon" | "menu") => {
  const paths = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.6S18.2.2 15 2a13.4 13.4 0 0 0-7 0C4.8.2 3.7.6 3.7.6A5 5 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.3 3.5 6.5 6.8 7A4.8 4.8 0 0 0 8 18v4M8 19c-3 .9-3-1.5-4-2"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 6L2 7"/>',
    spark: '<path d="m12 3-1.9 5.1L5 10l5.1 1.9L12 17l1.9-5.1L19 10l-5.1-1.9L12 3Z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
};

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("缺少应用挂载节点");

app.innerHTML = `
  <header class="site-nav" data-scrolled="false">
    <a class="wordmark" href="#top" aria-label="鹅的系列介绍，回到顶部">
      <img src="/assets/logos/goose-note.png" alt="" draggable="false" />
      <span>鹅的系列介绍</span>
    </a>
    <nav class="nav-links" aria-label="主导航">
      <a href="#work">作品</a><a href="#method">方法</a><a href="#now">近况</a>
      <a class="nav-github" href="https://github.com/eachann1024" target="_blank" rel="noreferrer">GitHub ${icon("arrow")}</a>
    </nav>
    <button class="nav-menu" type="button" aria-label="打开导航" aria-expanded="false">${icon("menu")}</button>
  </header>

  <main>
    <section class="hero" id="top">
      <canvas class="effect-source" id="effect-source" layoutsubtree="true" aria-hidden="true"></canvas>
      <canvas class="effect-output" id="effect-output" aria-hidden="true"></canvas>
      <div class="hero-art" aria-hidden="true">
        <img src="/assets/pixel-noir/goose-lab-hero.webp" alt="" draggable="false" fetchpriority="high" />
      </div>
      <div class="hero-layout">
        <div class="hero-copy" id="effect-content">
          <p class="availability"><span></span> GOOSE LAB · 夜间构建中</p>
          <h1>把每天的麻烦，<br />做成<span>一键。</span></h1>
          <p class="hero-lede">我是 Eachann。一个人守着这间深夜工坊，把笔记、脚本、书签、进程和验证码，做成五只安静好用的鹅。</p>
          <div class="hero-actions">
            <a class="primary-action" href="#work">进入鹅厂 ${icon("arrow")}</a>
            <a class="text-action" href="https://github.com/eachann1024" target="_blank" rel="noreferrer">${icon("github")} GitHub</a>
          </div>
        </div>
        <p class="scene-caption"><i></i> 五只鹅正在排队等发版</p>
      </div>
      <a class="scroll-cue" href="#work"><span>向下</span><i></i></a>
    </section>

    <section class="work-section" id="work">
      <div class="section-intro reveal">
        <p>每只鹅都守着一台机器，只处理一种麻烦。</p>
        <h2>五位夜班员工，<br />五件真正能用的工具。</h2>
      </div>
      <div class="work-list">
        ${products.map((product, index) => `
          <details class="work-item reveal" data-product="${product.id}">
            <summary class="work-summary">
              <div class="work-index">0${index + 1}</div>
              <img src="/assets/logos/goose-${product.id}.png" alt="${product.name}图标" draggable="false" />
              <div class="work-name"><h3>${product.name}</h3><p>${product.en}</p></div>
              <p class="work-desc">${product.line}</p>
              <div class="work-tags">${product.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
              <div class="work-toggle"><span>查看截图</span><i aria-hidden="true"></i></div>
            </summary>
            <div class="work-detail">
              <div class="work-detail__meta">
                <p class="work-channel"><span></span>${product.channel}</p>
                <p><i></i>${product.signal}</p>
              </div>
              <div class="work-gallery">
                ${product.screenshots.map((shot) => `
                  <figure>
                    <img src="${shot.src}" alt="${shot.alt}" draggable="false" loading="lazy" decoding="async" />
                    <figcaption>${shot.caption}</figcaption>
                  </figure>
                `).join("")}
              </div>
            </div>
          </details>
        `).join("")}
      </div>
    </section>

    <section class="method-section" id="method">
      <div class="method-grid">
        <div class="method-statement reveal">
          <p>WORKBENCH / 我的深夜工作台</p>
          <h2>一份核心，多种壳。<br /><span>少一点重复，多一点交付。</span></h2>
        </div>
        <figure class="method-scene reveal">
          <img src="/assets/pixel-noir/goose-lab-workbench.webp" alt="深夜的鹅工具实验室里，一只鹅正在工作台前发布软件" draggable="false" loading="lazy" />
          <figcaption><span>LIVE FEED</span> 深夜 02:17 · 新版本正在打包</figcaption>
        </figure>
      </div>
      <div class="method-notes">
        <article class="reveal"><b>键盘优先</b><p>高频操作先有快捷键，鼠标是补充。工具应该跟得上想法，而不是打断它。</p></article>
        <article class="reveal"><b>Core + Adapter</b><p>平台无关逻辑收进核心，uTools、Tauri 和浏览器只保留必要差异。</p></article>
        <article class="reveal"><b>AI 不是贴纸</b><p>它要么帮你更快完成任务，要么就不该出现在按钮上。</p></article>
      </div>
      <div class="method-ticker" aria-hidden="true"><div>DESIGN → BUILD → SHIP → LISTEN → DESIGN → BUILD → SHIP → LISTEN →&nbsp;</div></div>
    </section>

    <section class="now-section" id="now">
      <div class="now-heading reveal"><span>SHIP LOG / 最近在 ship</span><h2>发版像呼吸。</h2></div>
      <div class="now-feed">
        ${shipLog.map((entry) => `
          <details class="ship-item reveal" data-ship="${entry.id}">
            <summary class="ship-summary">
              <time>${entry.latestDate}</time>
              <img src="/assets/logos/goose-${entry.id}.png" alt="" draggable="false" />
              <div class="ship-copy">
                <p><b>${entry.name}</b>${entry.summary}</p>
                <span class="ship-meta">最近 ${entry.commits[0].time} · ${entry.commits[0].sha}</span>
              </div>
              <div class="ship-toggle"><span>最近 10 条提交</span><i aria-hidden="true"></i></div>
            </summary>
            <div class="ship-detail">
              <div class="ship-detail__head">
                <p>来自 <a href="${entry.repoUrl}" target="_blank" rel="noreferrer">${entry.en}</a> 的 GitHub 提交记录</p>
                <a class="ship-repo" href="${entry.repoUrl}/commits" target="_blank" rel="noreferrer">打开仓库 ${icon("arrow")}</a>
              </div>
              <ol class="ship-commits">
                ${entry.commits.map((commit) => `
                  <li>
                    <a href="${commit.url}" target="_blank" rel="noreferrer">
                      <time datetime="${commit.time.replace(" ", "T")}:00+08:00">${commit.time}</time>
                      <code>${commit.sha}</code>
                      <span>${commit.message}</span>
                    </a>
                  </li>
                `).join("")}
              </ol>
            </div>
          </details>
        `).join("")}
      </div>
    </section>

    <section class="contact-section" id="contact">
      <canvas class="contact-ripple" id="contact-ripple" aria-hidden="true"></canvas>
      <canvas class="contact-source" id="contact-source" layoutsubtree="true" aria-hidden="true"></canvas>
      <img class="contact-art" src="/assets/pixel-noir/goose-lab-portal.webp" alt="一只提着工具箱的鹅走向星光门廊" draggable="false" loading="lazy" />
      <div class="contact-copy" id="contact-content">
        <p>NEXT BUILD / 下一次构建</p>
        <h2>来交换一个<br />还没做完的想法。</h2>
        <a href="https://github.com/eachann1024" target="_blank" rel="noreferrer">在 GitHub 找我 ${icon("arrow")}</a>
      </div>
    </section>
  </main>

  <footer>
    <p>Eachann · 鹅工具箱</p><p>独立设计与开发 · 2026</p>
    <a href="#top">回到顶部 ↑</a>
  </footer>
`;

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeEffect: EffectInstance = null;
let activeEffectName: EffectName = effectNames[Math.floor(Math.random() * effectNames.length)];

const createOutputCanvas = () => {
  const oldCanvas = document.querySelector<HTMLCanvasElement>("#effect-output");
  const nextCanvas = document.createElement("canvas");
  nextCanvas.id = "effect-output";
  nextCanvas.className = "effect-output";
  nextCanvas.setAttribute("aria-hidden", "true");
  oldCanvas?.replaceWith(nextCanvas);
  return nextCanvas;
};

const startEffect = (name: EffectName) => {
  activeEffectName = name;
  activeEffect?.destroy();
  activeEffect = null;
  document.documentElement.dataset.effect = name;

  if (motionQuery.matches) return;

  const source = document.querySelector<HTMLCanvasElement>("#effect-source");
  const content = document.querySelector<HTMLElement>("#effect-content");
  const output = createOutputCanvas();
  if (!source || !content) return;
  const elements = { source, content, output };

  if (name === "liquid") {
    activeEffect = createLiquid(elements, { color: [0.933, 0.78, 0.91], radius: 0.42, force: 1.35, intensity: 2.8, curl: 2.4, blend: 9, distortion: 0.65 });
  } else if (name === "ripple") {
    activeEffect = createRipple(elements, { trigger: "hover", amplitude: 0.85, wavelength: 94, rings: 3, refraction: 72, dispersion: 0.45, shine: 0.9 });
  } else if (name === "clouds") {
    activeEffect = createClouds(elements, { color: [0.2, 0.23, 0.29], opacity: 0.72, cover: 0.14, density: 2.1, wind: 0.8, windRadius: 280, quality: 0.82 });
  } else if (name === "glitch") {
    activeEffect = createGlitch(elements, { intensity: 0.8, interval: 2.8, duration: 0.32, slices: 22, shift: 22, rgbShift: 3, blocks: 0.32, noise: 0.18 });
    output.parentElement?.addEventListener("pointerdown", () => (activeEffect as { burst?: () => void } | null)?.burst?.(), { once: true });
  } else {
    activeEffect = createRetroDither(elements, { radius: 0.42, softness: 0.55, pixelSize: 3, levels: 4, darkColor: [0.04, 0.045, 0.06], lightColor: [0.95, 0.35, 0.2], colorize: 0.8, strength: 0.9, scanlines: 0.15, followSpeed: 4 });
  }
};

const contactOutput = document.querySelector<HTMLCanvasElement>("#contact-ripple");
const contactSource = document.querySelector<HTMLCanvasElement>("#contact-source");
const contactContent = document.querySelector<HTMLElement>("#contact-content");
let contactEffect: EffectInstance = null;
if (contactOutput && contactSource && contactContent && !motionQuery.matches) {
  contactEffect = createRipple(
    { source: contactSource, content: contactContent, output: contactOutput },
    { trigger: "click", interval: 3.8, amplitude: 0.55, wavelength: 110, rings: 2, decay: 0.85, refraction: 58, dispersion: 0.25, shine: 0.8 },
  );
}

motionQuery.addEventListener("change", () => {
  activeEffect?.destroy();
  contactEffect?.destroy();
  activeEffect = contactEffect = null;
  startEffect(activeEffectName);
});

startEffect(activeEffectName);

document.addEventListener("dragstart", (event) => {
  if (event.target instanceof Element && event.target.closest("img, svg")) event.preventDefault();
});

const bindExclusiveDetails = (selector: string) => {
  const items = document.querySelectorAll<HTMLDetailsElement>(selector);
  items.forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open) return;
      items.forEach((other) => {
        if (other !== details) other.open = false;
      });
    });
  });
};

bindExclusiveDetails(".work-item");
bindExclusiveDetails(".ship-item");

const nav = document.querySelector<HTMLElement>(".site-nav");
const onScroll = () => nav?.setAttribute("data-scrolled", String(window.scrollY > 24));
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const menuButton = document.querySelector<HTMLButtonElement>(".nav-menu");
menuButton?.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
});
document.querySelectorAll(".nav-links a").forEach((link) => link.addEventListener("click", () => {
  document.body.classList.remove("menu-open");
  menuButton?.setAttribute("aria-expanded", "false");
}));

const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.12, rootMargin: "0px 0px -5%" });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

window.addEventListener("pagehide", () => {
  activeEffect?.destroy();
  contactEffect?.destroy();
}, { once: true });
