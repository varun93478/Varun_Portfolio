"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppearanceControl } from "../appearance/AppearanceControl";
import { SystemIcon, type SystemIconName } from "../components/SystemIcon";
import { DesktopSystemMap } from "./DesktopSystemMap";
import styles from "./varun-os.module.css";

const PaintApp = dynamic(() => import("./PaintApp").then((module) => module.PaintApp), { ssr: false });
const SnakeGame = dynamic(() => import("./SnakeGame").then((module) => module.SnakeGame), { ssr: false });

type UtilityId = "projects" | "report" | "notes" | "paint" | "snake" | "contact";
type GlyphName = UtilityId | "home" | "resume" | "folder" | "fig" | "work";

const projects = [
  {
    id: "harbinger",
    title: "Harbinger",
    product: "Motors",
    capability: "Configuration, ownership and operational states",
    href: "/work/harbinger",
    accent: "#3155e7",
    code: "HBR",
  },
  {
    id: "aadivara",
    title: "Aadivara",
    product: "Inclusive employment",
    capability: "Accessibility, check-in and service hand-offs",
    href: "/work/aadivara",
    accent: "#58a486",
    code: "AAD",
  },
  {
    id: "inventfunds",
    title: "InventFunds",
    product: "Investment platform",
    capability: "Multi-role IA, collaboration and permissions",
    href: "/work/inventfunds",
    accent: "#de705d",
    code: "INV",
  },
  {
    id: "property-care",
    title: "Property Care",
    product: "Property operations",
    capability: "Onboarding, posting hierarchy and continuity",
    href: "/work/property-care",
    accent: "#c5a51a",
    code: "PRP",
  },
  {
    id: "hcm-cafe",
    title: "HCM Café",
    product: "Workplace systems",
    capability: "Visitor lifecycle and exception handling",
    href: "/work/hcm-cafe",
    accent: "#7a4bc8",
    code: "HCM",
  },
] as const;

const utilities: { id: UtilityId; title: string; subtitle: string; glyph: GlyphName }[] = [
  { id: "projects", title: "Projects", subtitle: "5 case studies", glyph: "folder" },
  { id: "report", title: "About Varun", subtitle: "Designer system report", glyph: "report" },
  { id: "notes", title: "Field Notes", subtitle: "Writing space", glyph: "notes" },
  { id: "paint", title: "Paint", subtitle: "Make a mark", glyph: "paint" },
  { id: "snake", title: "Dependency Snake", subtitle: "Play the system", glyph: "snake" },
  { id: "contact", title: "Contact", subtitle: "Start a conversation", glyph: "contact" },
];

const primaryUtilityIds: UtilityId[] = ["projects", "report", "contact"];
const creativeUtilityIds: UtilityId[] = ["notes", "paint", "snake"];

function Glyph({ name }: { name: GlyphName }) {
  const icons: Record<GlyphName, SystemIconName> = {
    home: "launcher",
    projects: "folder",
    folder: "folder",
    fig: "figma",
    report: "report",
    notes: "notes",
    paint: "paint",
    snake: "game",
    contact: "contact",
    resume: "resume",
    work: "work",
  };
  return <span className={`${styles.glyph} ${styles[`glyph_${name}`]}`} aria-hidden="true"><SystemIcon name={icons[name]} size={17} /></span>;
}

function LiveTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return <time>{time}</time>;
}

function useCompactViewport() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return compact;
}

function ProjectFiles() {
  return (
    <section className={styles.projectZone} aria-labelledby="project-zone-title">
      <header>
        <p id="project-zone-title">SELECTED WORK / FIVE PRODUCT CASE STUDIES</p>
        <span>Open the evidence directly</span>
      </header>
      <div className={styles.projectFiles}>
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + index * 0.055 }}
          >
            <Link
              href={project.href}
              className={styles.projectFile}
              style={{ "--accent": project.accent } as React.CSSProperties}
              aria-label={`Open ${project.title} case study`}
            >
              <span className={styles.filePaper}>
                <i className={styles.fileFold} />
                <b>{project.code}</b>
                <em>FIG</em>
                <span className={styles.fileNodes}><i /><i /><i /><i /></span>
              </span>
              <strong>{project.title}.fig</strong>
              <small>{project.product}</small>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ProjectsApp() {
  return (
    <div className={styles.explorer}>
      <aside>
        <p>FAVORITES</p>
        <b><Glyph name="folder" /> Projects</b>
        <span><Glyph name="notes" /> UX artifacts</span>
        <span><Glyph name="resume" /> Resume</span>
      </aside>
      <section>
        <header><div><Glyph name="home" /><span>Varun OS</span><i>/</i><b>Projects</b></div><small>5 files</small></header>
        <div className={styles.explorerGrid}>
          {projects.map((project) => (
            <Link href={project.href} key={project.id} style={{ "--accent": project.accent } as React.CSSProperties}>
              <span className={styles.miniFile}><b>{project.code}</b><i>FIG</i></span>
              <strong>{project.title}.fig</strong>
              <small>{project.capability}</small>
              <em>Open case study <SystemIcon name="arrow-right" size={13} /></em>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function ReportApp() {
  const coverage = [
    ["Role and permission mapping", "5 / 5"],
    ["Workflow and hand-off evidence", "5 / 5"],
    ["Operational state coverage", "4 / 5"],
    ["Cross-device behavior", "3 / 5"],
  ];
  return (
    <div className={styles.report}>
      <header>
        <div><p>ABOUT VARUN / DESIGNER SYSTEM REPORT</p><h2>Complex systems designer.<br /><span>Human-first operator.</span></h2></div>
        <dl><div><dt>Base</dt><dd>Bengaluru, India</dd></div><div><dt>Focus</dt><dd>Enterprise product UX</dd></div><div><dt>Availability</dt><dd><i /> Open to roles</dd></div></dl>
      </header>
      <section className={styles.reportGrid}>
        <article className={styles.reportStatement}>
          <span>01 / OPERATING PRINCIPLE</span>
          <blockquote>“Make the system understandable before making it beautiful.”</blockquote>
          <p>I’m Varun J, a Bengaluru-based UI/UX designer focused on enterprise products. I work where roles, rules, data and decisions collide—then shape that complexity into workflows people can operate with confidence.</p>
        </article>
        <article className={styles.reportCoverage}>
          <span>02 / PORTFOLIO EVIDENCE COVERAGE</span>
          <p className={styles.honestyNote}>Counts describe the five published case studies—not product outcome claims.</p>
          {coverage.map(([label, value]) => <div key={label}><p>{label}</p><b>{value}</b></div>)}
        </article>
        <article className={styles.reportCapabilities}>
          <span>03 / CORE CAPABILITIES</span>
          <div><b>Systems thinking</b><b>Information architecture</b><b>Interaction design</b><b>Visual hierarchy</b><b>Design QA</b><b>Developer collaboration</b></div>
        </article>
        <article className={styles.reportAction}>
          <span>04 / NEXT ACTION</span>
          <h3>Need the concise version?</h3>
          <div><a href="/VarunJ_Resume.pdf?v=2026-08" target="_blank">Open resume <SystemIcon name="external" size={14} /></a><a href="mailto:varunj93478@gmail.com">Email Varun <SystemIcon name="external" size={14} /></a></div>
        </article>
      </section>
    </div>
  );
}

function NotesApp() {
  return (
    <div className={styles.notes}>
      <aside><p>FIELD NOTES</p><b>Published <span>0</span></b><b>In the queue <span>3</span></b><small>A future home for articles, working notes and product-design observations.</small></aside>
      <section>
        <div className={styles.emptyNotebook}><Glyph name="notes" /><span>EMPTY STATE / INTENTIONAL</span><h2>The notebook is open.<br />The first essay is still cooking.</h2><p>No published articles yet. This honest empty state leaves room for future writing without pretending unfinished work is live.</p></div>
        <div className={styles.noteQueue}>
          <p>WRITING QUEUE</p>
          <article><span>01</span><div><b>Designing permission-heavy products</b><small>Roles are not personas. They are system behavior.</small></div><em>Draft idea</em></article>
          <article><span>02</span><div><b>The invisible UX of operational states</b><small>Empty, error and restricted states are part of the product.</small></div><em>Draft idea</em></article>
          <article><span>03</span><div><b>Why UI QA belongs in design</b><small>The shipped interface is the final prototype.</small></div><em>Draft idea</em></article>
        </div>
      </section>
    </div>
  );
}

function ContactApp() {
  const freelanceSubject = encodeURIComponent("Freelance project enquiry");
  const freelanceBody = encodeURIComponent(`Project / business:

What I need help with:

Existing design or website:

Expected deliverable:

Target date:`);
  const freelanceMailto = `mailto:varunj93478@gmail.com?subject=${freelanceSubject}&body=${freelanceBody}`;
  const links = [
    ["Email", "varunj93478@gmail.com", "mailto:varunj93478@gmail.com"],
    ["LinkedIn", "Connect with Varun", "https://www.linkedin.com/in/varunj96/"],
    ["WhatsApp", "Start a conversation", "https://wa.me/917760560455"],
  ];
  return (
    <div className={styles.contact}>
      <p><i /> AVAILABLE FOR ROLES AND FOCUSED PROJECTS</p>
      <h2>Let&apos;s make a difficult<br />product feel obvious.</h2>
      <section className={styles.contactIntents}>
        <article>
          <span>Hiring / full-time roles</span>
          <h3>Looking for a UI/UX Designer?</h3>
          <p>Use the same direct recruiter contact path. No service selection is required.</p>
          <div>{links.slice(0, 2).map(([label, value, href]) => <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"><span>{label}</span><b>{value}</b><SystemIcon name="external" size={15} /></a>)}</div>
        </article>
        <article>
          <span>Freelance / project work</span>
          <h3>Have something you need help with?</h3>
          <p>Send me a short description of the work. A screenshot, Figma link, current website, or requirement is enough to start the conversation.</p>
          <div>
            <a href={freelanceMailto}><span>Email</span><b>Start a project</b><SystemIcon name="external" size={15} /></a>
            <a href={links[2][2]} target="_blank" rel="noreferrer"><span>WhatsApp</span><b>{links[2][1]}</b><SystemIcon name="external" size={15} /></a>
          </div>
        </article>
      </section>
    </div>
  );
}

function AppContent({ app }: { app: UtilityId }) {
  if (app === "projects") return <ProjectsApp />;
  if (app === "report") return <ReportApp />;
  if (app === "notes") return <NotesApp />;
  if (app === "paint") return <PaintApp />;
  if (app === "snake") return <SnakeGame />;
  return <ContactApp />;
}

function AppWindow({ app, onClose }: { app: UtilityId; onClose: () => void }) {
  const compact = useCompactViewport();
  const reducedMotion = useReducedMotion();
  const meta = utilities.find((item) => item.id === app)!;
  const [maximized, setMaximized] = useState(app === "paint" || app === "snake");

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <motion.article
      className={`${styles.appWindow} ${maximized ? styles.maximized : ""}`}
      drag={!compact && !maximized}
      dragMomentum={false}
      dragElastic={0.06}
      initial={reducedMotion ? false : { opacity: 0, y: 20, scale: 0.975 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.985 }}
      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      aria-label={`${meta.title} application`}
    >
      <header className={styles.windowBar}>
        <div><Glyph name={meta.glyph} /><b>{meta.title}</b><span>Desktop / {meta.title}</span></div>
        <p>{compact ? "VARUN OS" : "Drag window"}</p>
        <div className={styles.windowControls}>
          <button type="button" onClick={() => setMaximized((value) => !value)} aria-label={maximized ? "Restore window" : "Maximize window"}><SystemIcon name="maximize" size={15} /></button>
          <button type="button" onClick={onClose} aria-label={`Close ${meta.title}`}><SystemIcon name="close" size={17} /></button>
        </div>
      </header>
      <div className={styles.appBody}><AppContent app={app} /></div>
    </motion.article>
  );
}

export function VarunOS() {
  const reducedMotion = useReducedMotion();
  const [activeApp, setActiveApp] = useState<UtilityId | null>(null);
  const [launcherOpen, setLauncherOpen] = useState(false);

  const openApp = useCallback((app: UtilityId) => {
    setActiveApp(app);
    setLauncherOpen(false);
  }, []);

  const desktopTitle = useMemo(() => activeApp ? utilities.find((item) => item.id === activeApp)?.title : "Desktop", [activeApp]);

  return (
    <main className={styles.os}>
      <motion.section
        className={styles.desktop}
        initial={reducedMotion ? false : { opacity: 0, scale: 1.01 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.32 }}
      >
            <DesktopSystemMap />
            <header className={styles.osBar}>
              <button type="button" className={styles.osBrand} onClick={() => { setActiveApp(null); setLauncherOpen(false); }} aria-label="Show Varun OS desktop"><span>VJ</span><b>Varun OS</b></button>
              <div className={styles.breadcrumb}><span>Desktop</span>{activeApp && <><i>/</i><b>{desktopTitle}</b></>}</div>
              <div className={styles.systemReady}><i /> System ready</div>
              <AppearanceControl compact />
              <LiveTime />
            </header>

            <section className={styles.hero}>
              <p><i /> UI/UX DESIGNER · ENTERPRISE B2B PRODUCTS</p>
              <h1>I design clarity<br />into complex systems.</h1>
              <p className={styles.heroLead}>Enterprise roles, rules, data and decisions—turned into workflows teams can trust.</p>
              <div className={styles.heroActions}>
                <Link href="/work/harbinger">Open flagship case study <SystemIcon name="arrow-right" size={15} /></Link>
                <a href="/VarunJ_Resume.pdf?v=2026-08" target="_blank">Open resume <SystemIcon name="external" size={15} /></a>
                <button type="button" onClick={() => openApp("contact")}>Contact Varun <SystemIcon name="external" size={15} /></button>
              </div>
              <dl><div><dt>05</dt><dd>Case studies</dd></div><div><dt>B2B</dt><dd>Enterprise systems</dd></div><div><dt>NOW</dt><dd>Open to roles</dd></div></dl>
            </section>

            <ProjectFiles />

            <nav className={styles.utilityColumn} aria-label="Desktop applications">
              <p>DESKTOP</p>
              {primaryUtilityIds.slice(0, 1).map((id) => utilities.find((utility) => utility.id === id)!).map((utility) => (
                <button type="button" key={utility.id} onClick={() => openApp(utility.id)}>
                  <Glyph name={utility.glyph} /><span><b>{utility.title}</b><small>{utility.subtitle}</small></span>
                </button>
              ))}
              <Link href="/work-with-me"><Glyph name="work" /><span><b>Work With Me</b><small>Quick design help and product UX</small></span></Link>
              {primaryUtilityIds.slice(1).map((id) => utilities.find((utility) => utility.id === id)!).map((utility) => (
                <button type="button" key={utility.id} onClick={() => openApp(utility.id)}>
                  <Glyph name={utility.glyph} /><span><b>{utility.title}</b><small>{utility.subtitle}</small></span>
                </button>
              ))}
              <a href="/VarunJ_Resume.pdf?v=2026-08" target="_blank"><Glyph name="resume" /><span><b>Resume.pdf</b><small>Open document</small></span></a>
            </nav>

            <AnimatePresence>{activeApp && <AppWindow key={activeApp} app={activeApp} onClose={() => setActiveApp(null)} />}</AnimatePresence>

            <AnimatePresence>
              {launcherOpen && (
                <motion.aside className={styles.launcher} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
                  <header><span>VJ</span><div><b>Varun J</b><small>UI/UX Designer</small></div></header>
                  <p>PORTFOLIO</p>
                  <div>{primaryUtilityIds.slice(0, 1).map((id) => utilities.find((utility) => utility.id === id)!).map((utility) => <button type="button" key={utility.id} onClick={() => openApp(utility.id)}><Glyph name={utility.glyph} /><span>{utility.title}</span></button>)}<Link href="/work-with-me"><Glyph name="work" /><span>Work With Me</span></Link>{primaryUtilityIds.slice(1).map((id) => utilities.find((utility) => utility.id === id)!).map((utility) => <button type="button" key={utility.id} onClick={() => openApp(utility.id)}><Glyph name={utility.glyph} /><span>{utility.title}</span></button>)}</div>
                  <p>EXPLORE THE OS</p>
                  <div>{creativeUtilityIds.map((id) => utilities.find((utility) => utility.id === id)!).map((utility) => <button type="button" key={utility.id} onClick={() => openApp(utility.id)}><Glyph name={utility.glyph} /><span>{utility.title}</span></button>)}</div>
                  <footer><a href="/VarunJ_Resume.pdf?v=2026-08" target="_blank">Resume</a><a href="mailto:varunj93478@gmail.com">Email</a></footer>
                </motion.aside>
              )}
            </AnimatePresence>

            <nav className={styles.dock} aria-label="Varun OS dock">
              <button type="button" onClick={() => setLauncherOpen((value) => !value)} aria-label="Launcher" aria-pressed={launcherOpen}><Glyph name="home" /><span>Launcher</span></button>
              {(["projects", "report"] as UtilityId[]).map((id) => {
                const utility = utilities.find((item) => item.id === id)!;
                return <button type="button" key={id} aria-label={utility.title} className={activeApp === id ? styles.dockActive : ""} onClick={() => openApp(id)}><Glyph name={utility.glyph} /><span>{utility.title}</span></button>;
              })}
              <button type="button" onClick={() => openApp("contact")} aria-label="Contact" className={activeApp === "contact" ? styles.dockActive : ""}><Glyph name="contact" /><span>Contact</span></button>
            </nav>

            <p className={styles.desktopHint}>Start with Harbinger for the flagship case study · <kbd>Esc</kbd> closes an app</p>
      </motion.section>
    </main>
  );
}
