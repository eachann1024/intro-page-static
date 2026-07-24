import "./styles.css";
import { createLiquid } from "../components/canvasui/LiquidVanilla.ts";
import { createRipple } from "../components/canvasui/RippleVanilla.ts";
import { createClouds } from "../components/canvasui/CloudsVanilla.ts";
import { createGlitch } from "../components/canvasui/GlitchVanilla.ts";
import { createRetroDither } from "../components/canvasui/RetroDitherVanilla.ts";

type EffectName = "liquid" | "ripple" | "clouds" | "glitch" | "dither";
type EffectInstance = { destroy: () => void } | null;

const products = [
  {
    id: "note",
    name: "鹅的笔记",
    en: "goose-note",
    line: "把本地文件夹变成一间有版本回滚、AI 辅写和多格式导出的写作室。",
    tags: ["Tauri 2", "BlockNote", "AI"],
    signal: "正在写",
  },
  {
    id: "run",
    name: "鹅的运行",
    en: "goose-run",
    line: "脚本拖进来，一键运行；参数、日志、端口占用和 AI 分析都在眼前。",
    tags: ["uTools", "Tauri 2", "AI"],
    signal: "高频迭代",
  },
  {
    id: "marks",
    name: "鹅的书签",
    en: "goose-marks",
    line: "不让收藏继续吃灰：快速保存、模板搜索、画报浏览和本地图标抓取。",
    tags: ["Vue 3", "uTools", "AI"],
    signal: "持续焕新",
  },
  {
    id: "monitor",
    name: "鹅的监控",
    en: "goose-monitor",
    line: "会把 Helper 进程收好、也真的能结束进程的跨平台活动监视器。",
    tags: ["Rust", "Tauri 2", "TypeScript"],
    signal: "跨平台",
  },
  {
    id: "2fa",
    name: "鹅的验证",
    en: "goose-2fa",
    line: "不离开键盘，在搜索框里取到验证码，再自动贴回刚才的窗口。",
    tags: ["uTools", "2FA", "键盘流"],
    signal: "已经能用",
  },
];

const effectMeta: Record<EffectName, { label: string; hint: string }> = {
  liquid: { label: "流体", hint: "移动指针，搅动一小片珊瑚色流体" },
  ripple: { label: "涟漪", hint: "点击任意位置，让页面像水面一样回应" },
  clouds: { label: "云雾", hint: "移动指针，把雾从你的阅读路径上推开" },
  glitch: { label: "故障", hint: "广播信号偶尔撕裂，点击可立即触发" },
  dither: { label: "抖动", hint: "指针变成一枚复古像素透镜" },
};

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
    <a class="wordmark" href="#top" aria-label="回到顶部">
      <img src="/assets/logos/goose-note.png" alt="" />
      <span>Eachann</span><b>／鹅</b>
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
      <div class="hero-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="hero-layout">
        <div class="hero-copy" id="effect-content">
          <p class="availability"><span></span> 独立开发者 · 中国 · 正在做东西</p>
          <h1>把每天的麻烦，<br />做成<span>一键。</span></h1>
          <p class="hero-lede">我是 Eachann。一个人设计、开发、发布一组键盘优先的本地工具；和 AI 结对，也把 AI 放进真正需要它的地方。</p>
          <div class="hero-actions">
            <a class="primary-action" href="#work">看看这群鹅 ${icon("arrow")}</a>
            <a class="text-action" href="https://github.com/eachann1024" target="_blank" rel="noreferrer">${icon("github")} GitHub</a>
          </div>
        </div>
        <div class="goose-stage">
          <canvas id="particle-goose" aria-label="由粒子组成的鹅工具箱图标"></canvas>
          <img class="goose-fallback" src="/assets/logos/goose-note.png" alt="鹅工具箱图标" />
          <p>拖动粒子，看看它会不会飞走</p>
        </div>
      </div>
      <div class="effect-console" aria-label="Canvas UI 特效控制台">
        <div class="effect-console__label">Canvas UI / 实验场</div>
        <div class="effect-switches" role="group" aria-label="选择页面特效">
          ${Object.entries(effectMeta).map(([key, value], index) => `<button type="button" data-effect="${key}" aria-pressed="${index === 0}">${value.label}</button>`).join("")}
        </div>
        <p id="effect-hint" aria-live="polite">${effectMeta.liquid.hint}</p>
      </div>
      <a class="scroll-cue" href="#work"><span>向下</span><i></i></a>
    </section>

    <section class="work-section" id="work">
      <div class="section-intro reveal">
        <p>不是概念图，是每天都在长大的工具。</p>
        <h2>五只鹅，<br />各自解决一件麻烦事。</h2>
      </div>
      <div class="work-list">
        ${products.map((product, index) => `
          <article class="work-item reveal" data-product="${product.id}">
            <div class="work-index">0${index + 1}</div>
            <img src="/assets/logos/goose-${product.id}.png" alt="${product.name}图标" />
            <div class="work-name"><h3>${product.name}</h3><p>${product.en}</p></div>
            <p class="work-desc">${product.line}</p>
            <div class="work-tags">${product.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
            <div class="work-signal"><i></i>${product.signal}</div>
          </article>
        `).join("")}
      </div>
    </section>

    <section class="method-section" id="method">
      <div class="method-statement reveal">
        <p>我的工作台</p>
        <h2>一份核心，<br />多种壳。<br /><span>少一点重复，</span><br />多一点交付。</h2>
      </div>
      <div class="method-notes">
        <article class="reveal"><b>键盘优先</b><p>高频操作先有快捷键，鼠标是补充。工具应该跟得上想法，而不是打断它。</p></article>
        <article class="reveal"><b>Core + Adapter</b><p>平台无关逻辑收进核心，uTools、Tauri 和浏览器只保留必要差异。</p></article>
        <article class="reveal"><b>AI 不是贴纸</b><p>它要么帮你更快完成任务，要么就不该出现在按钮上。</p></article>
      </div>
      <div class="method-ticker" aria-hidden="true"><div>DESIGN → BUILD → SHIP → LISTEN → DESIGN → BUILD → SHIP → LISTEN →&nbsp;</div></div>
    </section>

    <section class="now-section" id="now">
      <div class="now-heading reveal"><span>最近在 ship</span><h2>发版像呼吸。</h2></div>
      <div class="now-feed">
        <article class="reveal"><time>2026.06</time><img src="/assets/logos/goose-note.png" alt="" /><p><b>鹅的笔记</b>连接真实磁盘文件夹，加入版本快照回滚、PDF / Word 导出和 AI 行内辅写。</p><span>新增</span></article>
        <article class="reveal"><time>2026.06</time><img src="/assets/logos/goose-monitor.png" alt="" /><p><b>鹅的监控</b>完成分平台打包、Linux 图标识别，Windows 抓图标不再闪黑窗。</p><span>修复</span></article>
        <article class="reveal"><time>2026.05</time><img src="/assets/logos/goose-run.png" alt="" /><p><b>鹅的运行</b>加入脚本分析、拖拽导入、运行前参数面板和端口占用检测。</p><span>迭代</span></article>
      </div>
    </section>

    <section class="contact-section" id="contact">
      <canvas class="contact-ripple" id="contact-ripple" aria-hidden="true"></canvas>
      <canvas class="contact-source" id="contact-source" layoutsubtree="true" aria-hidden="true"></canvas>
      <div class="contact-copy" id="contact-content">
        <img src="/assets/logos/goose-marks.png" alt="鹅的书签图标" />
        <p>如果你也在做有用的小东西——</p>
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
let activeEffectName: EffectName = "liquid";

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

  const hint = document.querySelector<HTMLElement>("#effect-hint");
  if (hint) hint.textContent = motionQuery.matches ? "已按系统设置减少动态效果" : effectMeta[name].hint;
  document.querySelectorAll<HTMLButtonElement>("button[data-effect]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.effect === name));
  });
  if (motionQuery.matches) return;

  const source = document.querySelector<HTMLCanvasElement>("#effect-source");
  const content = document.querySelector<HTMLElement>("#effect-content");
  const output = createOutputCanvas();
  if (!source || !content) return;
  const elements = { source, content, output };

  if (name === "liquid") {
    activeEffect = createLiquid(elements, { color: [0.82, 0.22, 0.12], radius: 0.42, force: 1.35, intensity: 2.8, curl: 2.4, blend: 9, distortion: 0.65 });
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

document.querySelectorAll<HTMLButtonElement>("button[data-effect]").forEach((button) => {
  button.addEventListener("click", () => startEffect(button.dataset.effect as EffectName));
});

const particleCanvas = document.querySelector<HTMLCanvasElement>("#particle-goose");
let particleInstance: EffectInstance = null;
if (particleCanvas && !motionQuery.matches) {
  const particleObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    particleObserver.disconnect();
    void import("../components/canvasui/ParticleObjectVanilla.ts").then(({ createParticleObject }) => {
      if (motionQuery.matches) return;
      particleInstance = createParticleObject(
        { canvas: particleCanvas },
        { src: "/assets/logos/goose-note.png", count: 9000, size: 2.25, sizeVariance: 0.65, radius: 105, strength: 0.9, swirl: 0.75, spring: 1.05, damping: 0.38, drift: 0.45, scale: 3.1, floatIntensity: 0.8, rotationIntensity: 0.35, orbit: true, zoom: false, autoRotate: false, onLoad: () => document.querySelector(".goose-stage")?.classList.add("has-particles") },
      );
    });
  }, { rootMargin: "180px" });
  particleObserver.observe(particleCanvas);
}

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
  particleInstance?.destroy();
  contactEffect?.destroy();
  activeEffect = particleInstance = contactEffect = null;
  startEffect(activeEffectName);
});

startEffect("liquid");

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
  particleInstance?.destroy();
  contactEffect?.destroy();
}, { once: true });
