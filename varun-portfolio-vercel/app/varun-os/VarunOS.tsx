"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { IconName, StudioConcept, WorkspaceIcon } from "../concepts/StudioExperience";
import styles from "./varun-os.module.css";

type OsApp = "start" | "cases" | "process" | "about" | "resume" | "contact";
type OsView = "boot" | "desktop" | "work";

const apps: { id: OsApp | "work"; label: string; icon: IconName; key: string }[] = [
  { id: "start", label: "Start Here", icon: "grid", key: "01" },
  { id: "work", label: "Work", icon: "folder", key: "02" },
  { id: "cases", label: "Case Studies", icon: "file", key: "03" },
  { id: "process", label: "UX Process", icon: "process", key: "04" },
  { id: "about", label: "About Varun", icon: "user", key: "05" },
  { id: "resume", label: "Résumé", icon: "check", key: "06" },
  { id: "contact", label: "Contact", icon: "mail", key: "07" },
];

const projects = [
  { title: "Harbinger Motors", capability: "Enterprise rules, ownership and operational states", href: "/work/harbinger", accent: "#3155e7" },
  { title: "Aadivara", capability: "Accessibility, offline check-in and service hand-offs", href: "/work/aadivara", accent: "#63a88e" },
  { title: "InventFunds", capability: "Multi-role IA, collaboration and permissions", href: "/work/inventfunds", accent: "#df745f" },
  { title: "Property Care", capability: "Onboarding, posting hierarchy and continuity", href: "/work/property-care", accent: "#c3a51a" },
  { title: "HCM Café", capability: "Visitor lifecycle and operational exceptions", href: "/work/hcm-cafe", accent: "#7847c8" },
];

const processSteps = [
  ["01", "Understand the system", "Business goal, users, roles and constraints."],
  ["02", "Map the complexity", "Rules, data, dependencies, hand-offs and states."],
  ["03", "Design the decision", "Hierarchy, flow, affordance and next action."],
  ["04", "Validate the behavior", "Prototype, developer hand-off, UI QA and learning."],
];

function useCompactViewport() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return compact;
}

function LiveTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(new Date()));
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return <span>{time}</span>;
}

function BootScreen({ onComplete }: { onComplete: () => void }) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const phases = ["Mapping roles", "Resolving dependencies", "Loading evidence", "System ready"];

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }
    const progressTimer = window.setInterval(() => setPhase((current) => Math.min(current + 1, 3)), 460);
    const completeTimer = window.setTimeout(onComplete, 2200);
    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, reducedMotion]);

  return (
    <motion.section className={styles.boot} aria-label="Varun OS is starting" exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
      <div className={styles.bootGrid} aria-hidden="true" />
      <motion.div
        className={styles.bootMark}
        initial={{ opacity: 0, scale: 0.86 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <span>VJ</span>
        <i aria-hidden="true" />
      </motion.div>
      <div className={styles.bootCopy}>
        <p>VARUN OS / PRODUCT DESIGN SYSTEM</p>
        <h1>Turning complex systems<br />into clear decisions.</h1>
        <div className={styles.bootStatus}>
          <span>{phases[phase]}</span>
          <b>{String((phase + 1) * 25).padStart(2, "0")}%</b>
        </div>
        <div className={styles.bootProgress} aria-hidden="true"><motion.i animate={{ width: `${(phase + 1) * 25}%` }} /></div>
      </div>
      <button className={styles.skipBoot} type="button" onClick={onComplete}>Skip intro <span aria-hidden="true">→</span></button>
    </motion.section>
  );
}

function StartContent({ openWork }: { openWork: () => void }) {
  return (
    <div className={styles.startContent}>
      <p className={styles.eyebrow}><i /> Complex systems product designer</p>
      <h1>I design clarity into complex systems.</h1>
      <p className={styles.lead}>I map the roles, rules, data and decisions behind enterprise products—then turn that complexity into workflows teams can trust.</p>
      <div className={styles.primaryActions}>
        <Link className={styles.primaryButton} href="/work/harbinger">Start the 90-sec tour <span aria-hidden="true">→</span></Link>
        <button className={styles.secondaryButton} type="button" onClick={openWork}>Open design workspace <span aria-hidden="true">↗</span></button>
      </div>
      <dl className={styles.systemLens}>
        <div><dt>01</dt><dd>Role logic</dd></div>
        <div><dt>02</dt><dd>Workflow clarity</dd></div>
        <div><dt>03</dt><dd>Operational states</dd></div>
      </dl>
    </div>
  );
}

function CasesContent() {
  return (
    <div className={styles.listContent}>
      <div className={styles.windowIntro}><p>SELECTED WORK / 05 SYSTEMS</p><h2>Case studies by UX capability</h2></div>
      <div className={styles.projectList}>
        {projects.map((project, index) => (
          <Link href={project.href} key={project.title} style={{ "--project": project.accent } as React.CSSProperties}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><b>{project.title}</b><p>{project.capability}</p></div>
            <i aria-hidden="true">↗</i>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProcessContent() {
  return (
    <div className={styles.listContent}>
      <div className={styles.windowIntro}><p>UX PROCESS / STRONG ENOUGH FOR REAL SYSTEMS</p><h2>Understand before decorating.</h2></div>
      <div className={styles.processList}>
        {processSteps.map(([no, title, body]) => <article key={no}><span>{no}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}
      </div>
      <Link className={styles.inlineLink} href="/work/harbinger/documentation">Open the full UX documentation <span>→</span></Link>
    </div>
  );
}

function AboutContent() {
  return (
    <div className={styles.textContent}>
      <p className={styles.eyebrow}><i /> About Varun</p>
      <h2>A designer who enjoys the messy middle.</h2>
      <p>I’m a Bengaluru-based product designer focused on enterprise platforms, role-heavy workflows and operational tools. My best work happens where business rules, user needs and implementation constraints meet.</p>
      <div className={styles.capabilityTags}><span>Enterprise UX</span><span>Product UI</span><span>Systems thinking</span><span>UI QA</span></div>
    </div>
  );
}

function ResumeContent() {
  return (
    <div className={styles.textContent}>
      <p className={styles.eyebrow}><i /> Résumé / PDF</p>
      <h2>The short version of the work.</h2>
      <p>Experience across enterprise products, UX process, interaction design, visual systems and implementation collaboration.</p>
      <a className={styles.primaryButton} href="/VarunJ_Resume.pdf" download="Varun-J-Resume.pdf">Download résumé <span>↓</span></a>
    </div>
  );
}

function ContactContent() {
  return (
    <div className={styles.textContent}>
      <p className={styles.eyebrow}><i /> Contact / Available for product design</p>
      <h2>Let’s make a difficult product feel obvious.</h2>
      <p>Open to product design roles and conversations about complex enterprise systems.</p>
      <div className={styles.contactLinks}>
        <a href="mailto:varunj93478@gmail.com"><span>Email</span><b>varunj93478@gmail.com</b><i>↗</i></a>
        <a href="https://www.linkedin.com/in/varunj96/" target="_blank" rel="noreferrer"><span>LinkedIn</span><b>Connect with Varun</b><i>↗</i></a>
        <a href="https://wa.me/917760560455" target="_blank" rel="noreferrer"><span>WhatsApp</span><b>Start a conversation</b><i>↗</i></a>
      </div>
    </div>
  );
}

function WindowContent({ app, openWork }: { app: OsApp; openWork: () => void }) {
  if (app === "start") return <StartContent openWork={openWork} />;
  if (app === "cases") return <CasesContent />;
  if (app === "process") return <ProcessContent />;
  if (app === "about") return <AboutContent />;
  if (app === "resume") return <ResumeContent />;
  return <ContactContent />;
}

export function VarunOS() {
  const reducedMotion = useReducedMotion();
  const compact = useCompactViewport();
  const [view, setView] = useState<OsView>("boot");
  const [activeApp, setActiveApp] = useState<OsApp>("start");
  const [windowOpen, setWindowOpen] = useState(true);
  const [maximized, setMaximized] = useState(false);
  const [bootChecked, setBootChecked] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const seen = window.sessionStorage.getItem("varun-os-booted") === "true";
      if (seen || reducedMotion) setView("desktop");
      setBootChecked(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  const finishBoot = () => {
    window.sessionStorage.setItem("varun-os-booted", "true");
    setView("desktop");
  };

  const openApp = (id: OsApp | "work") => {
    if (id === "work") {
      setView("work");
      return;
    }
    setActiveApp(id);
    setWindowOpen(true);
    setMaximized(false);
  };

  const title = useMemo(() => apps.find((app) => app.id === activeApp)?.label ?? "Start Here", [activeApp]);

  if (!bootChecked) return <main className={styles.os} />;
  if (view === "work") return <div className={styles.workApp}><StudioConcept comparisonMode={false} showSplash={false} onExit={() => setView("desktop")} /></div>;

  return (
    <main className={styles.os}>
      <AnimatePresence mode="wait">
        {view === "boot" ? <BootScreen key="boot" onComplete={finishBoot} /> : (
          <motion.section
            key="desktop"
            className={styles.desktop}
            initial={reducedMotion ? false : { opacity: 0, scale: 1.018 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.mapField} aria-hidden="true"><i /><i /><i /><i /><b /><b /><b /></div>
            <header className={styles.osBar}>
              <div className={styles.osBrand}><span>VJ</span><b>Varun OS</b></div>
              <div className={styles.osReady}><i /> System ready <span>Portfolio environment</span></div>
              <div className={styles.osMeta}><span className={styles.signal}>UX</span><LiveTime /></div>
            </header>

            <nav className={styles.appRail} aria-label="Varun OS applications">
              {apps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  className={activeApp === app.id && view === "desktop" ? styles.activeApp : ""}
                  onClick={() => openApp(app.id)}
                  aria-label={`Open ${app.label}`}
                >
                  <span><WorkspaceIcon name={app.icon} size={20} /></span>
                  <b>{app.label}</b>
                  <i>{app.key}</i>
                </button>
              ))}
              <div className={styles.railStatus}><i /> Available for product design roles</div>
            </nav>

            <aside className={styles.evidencePanel} aria-label="Portfolio orientation">
              <div><span>LIVE CONTEXT</span><i /></div>
              <h2>Complexity,<br />made operable.</h2>
              <dl>
                <div><dt>Focus</dt><dd>Enterprise products</dd></div>
                <div><dt>Lens</dt><dd>Roles · Rules · Data · Decisions</dd></div>
                <div><dt>Flagship</dt><dd>Harbinger Motors</dd></div>
              </dl>
              <Link href="/work/harbinger">Open flagship case study <span>→</span></Link>
            </aside>

            <AnimatePresence>
              {windowOpen && (
                <motion.article
                  className={`${styles.osWindow} ${maximized ? styles.maximized : ""}`}
                  drag={!compact && !maximized}
                  dragMomentum={false}
                  dragElastic={0.08}
                  initial={reducedMotion ? false : { opacity: 0, y: 26, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  aria-label={`${title} window`}
                >
                  <header className={styles.windowBar}>
                    <div><span>VJ</span><b>{title}</b><i>{activeApp.toUpperCase()}.APP</i></div>
                    <p>{compact ? "VARUN OS" : "Drag to move"}</p>
                    <div className={styles.windowControls}>
                      <button type="button" onClick={() => setWindowOpen(false)} aria-label={`Minimize ${title}`}><span /></button>
                      <button type="button" onClick={() => setMaximized((value) => !value)} aria-label={maximized ? "Restore window" : "Maximize window"}><i /></button>
                      <button type="button" onClick={() => setWindowOpen(false)} aria-label={`Close ${title}`}>×</button>
                    </div>
                  </header>
                  <WindowContent app={activeApp} openWork={() => setView("work")} />
                </motion.article>
              )}
            </AnimatePresence>

            <nav className={styles.dock} aria-label="Quick applications">
              {(["start", "work", "cases", "contact"] as const).map((id) => {
                const app = apps.find((item) => item.id === id)!;
                return (
                  <button key={id} type="button" onClick={() => openApp(id)} className={activeApp === id ? styles.dockActive : ""}>
                    <WorkspaceIcon name={app.icon} size={22} />
                    <span>{app.label}</span>
                  </button>
                );
              })}
            </nav>

            {!windowOpen && (
              <button className={styles.restoreWindow} type="button" onClick={() => setWindowOpen(true)}>
                Restore {title} <span>↑</span>
              </button>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
