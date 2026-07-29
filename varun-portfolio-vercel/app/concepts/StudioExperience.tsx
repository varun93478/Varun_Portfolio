"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PreviewSwitcher } from "./ConceptExperience";
import { PortfolioLinks } from "./PortfolioLinks";
import { WorkspaceTabs } from "./WorkspaceTabs";
import styles from "./concepts.module.css";

type ProjectKey = "harbinger" | "aadivara" | "inventfunds" | "propertycare" | "hcmcafe";
type WorkspacePage = "work" | "process" | "about" | "contact";
type IconName =
  | "grid"
  | "process"
  | "user"
  | "mail"
  | "folder"
  | "layers"
  | "file"
  | "truck"
  | "access"
  | "finance"
  | "property"
  | "workplace"
  | "check"
  | "sliders"
  | "zoomOut"
  | "zoomIn"
  | "play"
  | "comment"
  | "reset";

const projects: Record<ProjectKey, {
  title: string;
  subtitle: string;
  scope: string;
  status: string;
  accent: string;
  icon: IconName;
  href: string;
  sections: readonly {
    id: string;
    label: string;
    icon: IconName;
    href?: string;
  }[];
}> = {
  harbinger: {
    title: "Harbinger Motors",
    subtitle: "Enterprise vehicle operations",
    scope: "HBR Portal + Dealer Portal",
    status: "Featured case study",
    accent: "#3155e7",
    icon: "truck",
    href: "/work/harbinger",
    sections: [
      { id: "overview", label: "Overview", icon: "file" },
      { id: "configuration", label: "Product configuration", icon: "sliders" },
      { id: "operations", label: "Vehicle operations", icon: "truck" },
      { id: "pdi", label: "PDI checklist", icon: "check" },
      { id: "handoff", label: "Handoff and UI QA", icon: "layers" },
      { id: "reflection", label: "Outcome and reflection", icon: "process" },
      { id: "documentation", label: "UX documentation", icon: "folder", href: "/work/harbinger/documentation" },
    ],
  },
  aadivara: {
    title: "Aadivara",
    subtitle: "Accessible employment workflows",
    scope: "Candidates + Employers + Operations",
    status: "Case study",
    accent: "#7dbfa7",
    icon: "access",
    href: "/work/aadivara",
    sections: [
      { id: "overview", label: "Overview", icon: "file" },
      { id: "candidate", label: "Candidate access", icon: "access" },
      { id: "operations", label: "Event operations", icon: "sliders" },
      { id: "employer", label: "Employer workflow", icon: "workplace" },
      { id: "offline", label: "Offline check-in", icon: "check" },
      { id: "reflection", label: "Outcome and reflection", icon: "process" },
    ],
  },
  inventfunds: {
    title: "InventFunds",
    subtitle: "Finance product workflows",
    scope: "Founders + Funders + Fixers",
    status: "Case study",
    accent: "#e87965",
    icon: "finance",
    href: "/work/inventfunds",
    sections: [
      { id: "overview", label: "Overview", icon: "file" },
      { id: "roles", label: "Product model", icon: "user" },
      { id: "founder", label: "Founder workflow", icon: "layers" },
      { id: "funder", label: "Funder workflow", icon: "finance" },
      { id: "fixer", label: "Fixer workflow", icon: "access" },
      { id: "nda", label: "Trust and NDA", icon: "check" },
      { id: "reflection", label: "Handoff and reflection", icon: "process" },
    ],
  },
  propertycare: {
    title: "Property Care",
    subtitle: "Property workflows across web and mobile",
    scope: "Discovery + Posting + Operations",
    status: "Case study",
    accent: "#d6b31f",
    icon: "property",
    href: "/work/property-care",
    sections: [
      { id: "overview", label: "Overview", icon: "file" },
      { id: "roles", label: "Product model", icon: "user" },
      { id: "onboarding", label: "Franchise onboarding", icon: "check" },
      { id: "property", label: "Post a property", icon: "property" },
      { id: "requirements", label: "Property requirements", icon: "sliders" },
      { id: "discovery", label: "Discovery and enquiry", icon: "zoomIn" },
      { id: "continuity", label: "Web and mobile", icon: "layers" },
      { id: "reflection", label: "Reflection", icon: "process" },
    ],
  },
  hcmcafe: {
    title: "HCM Café",
    subtitle: "HR and visitor operations",
    scope: "HR Management + Visitor Management",
    status: "Case study",
    accent: "#7b35d3",
    icon: "workplace",
    href: "/work/hcm-cafe",
    sections: [
      { id: "overview", label: "Overview", icon: "file" },
      { id: "model", label: "Product model", icon: "user" },
      { id: "configuration", label: "HR configuration", icon: "sliders" },
      { id: "attendance", label: "Attendance and leave", icon: "check" },
      { id: "visitors", label: "Visitor lifecycle", icon: "access" },
      { id: "flow-architecture", label: "VMS flow architecture", icon: "process" },
      { id: "front-desk", label: "Front desk operations", icon: "workplace" },
      { id: "patterns", label: "Shared patterns", icon: "layers" },
      { id: "reflection", label: "Reflection", icon: "process" },
    ],
  },
};

const projectKeys = Object.keys(projects) as ProjectKey[];

const workspacePages: Record<WorkspacePage, {
  title: string;
  description: string;
  scope: string;
  status: string;
}> = {
  work: {
    title: "Selected work",
    description: "Enterprise products shaped around workflows, roles, data and operational decisions.",
    scope: "5 product systems",
    status: "Portfolio overview",
  },
  process: {
    title: "How I work",
    description: "A practical process for understanding the system before deciding how the interface should behave.",
    scope: "Product understanding to QA",
    status: "Working method",
  },
  about: {
    title: "About Varun",
    description: "Senior UI/UX Designer growing into a product designer focused on complex enterprise systems.",
    scope: "Enterprise UX + Product UI",
    status: "Bengaluru, India",
  },
  contact: {
    title: "Contact",
    description: "Open to product design roles and conversations about complex enterprise products.",
    scope: "Product design opportunities",
    status: "Available on LinkedIn",
  },
};

const processSteps = [
  ["01", "Understand the product", "Clarify the business goal, users, roles and why the workflow exists."],
  ["02", "Map the system", "Trace rules, data dependencies, states, handoffs and edge cases."],
  ["03", "Design for clarity", "Structure the flow and interface around the next decision users need to make."],
  ["04", "Support the build", "Document intent, work with developers, review the implementation and run QA."],
];

function WorkspaceIcon({ name, size = 18 }: { name: IconName; size?: number }) {
  const shared = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "grid") return <svg {...shared}><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></svg>;
  if (name === "process") return <svg {...shared}><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="5" r="2.5" /><circle cx="17" cy="18" r="2.5" /><path d="M8.5 6h7M6.8 8.5l7.8 7.2M18 7.5l-.7 8" /></svg>;
  if (name === "user" || name === "access") return <svg {...shared}><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20c.7-4 2.9-6 6.5-6s5.8 2 6.5 6" /></svg>;
  if (name === "mail") return <svg {...shared}><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m4 7 8 6 8-6" /></svg>;
  if (name === "folder") return <svg {...shared}><path d="M3 7.5h7l2-2h9v13H3z" /></svg>;
  if (name === "layers") return <svg {...shared}><path d="m12 3 9 5-9 5-9-5z" /><path d="m4 12 8 4.5 8-4.5M4 16l8 4.5 8-4.5" /></svg>;
  if (name === "file") return <svg {...shared}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 12h6M9 16h6" /></svg>;
  if (name === "truck") return <svg {...shared}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>;
  if (name === "finance") return <svg {...shared}><path d="m4 9 8-5 8 5M5 10h14M6 10v7M10 10v7M14 10v7M18 10v7M4 20h16" /></svg>;
  if (name === "property") return <svg {...shared}><path d="m3 11 9-7 9 7" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></svg>;
  if (name === "workplace") return <svg {...shared}><path d="M4 21V7h10v14M14 11h6v10M7 10h2M7 14h2M7 18h2M16 14h2M16 18h2M2 21h20" /></svg>;
  if (name === "check") return <svg {...shared}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="m8 12 2.5 2.5L16 9" /></svg>;
  if (name === "sliders") return <svg {...shared}><path d="M4 7h10M18 7h2M4 17h3M11 17h9" /><circle cx="16" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></svg>;
  if (name === "zoomOut") return <svg {...shared}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5M7.5 10.5h6" /></svg>;
  if (name === "zoomIn") return <svg {...shared}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5M7.5 10.5h6M10.5 7.5v6" /></svg>;
  if (name === "play") return <svg {...shared}><path d="m8 5 11 7-11 7z" /></svg>;
  if (name === "comment") return <svg {...shared}><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></svg>;
  return <svg {...shared}><path d="M5 8a8 8 0 1 1-1 7" /><path d="M5 3v5h5" /></svg>;
}

function SelectionHandles() {
  return (
    <span className={styles.studioHandles} aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
    </span>
  );
}

function SystemLens() {
  return (
    <div className={styles.studioLens} aria-label="System lens">
      <span className={styles.lensRoles}><WorkspaceIcon name="user" /><b>Roles</b></span>
      <span className={styles.lensRules}><WorkspaceIcon name="sliders" /><b>Rules</b></span>
      <span className={styles.lensData}><WorkspaceIcon name="layers" /><b>Data</b></span>
      <span className={styles.lensDecisions}><WorkspaceIcon name="process" /><b>Decisions</b></span>
      <i className={styles.lensLineHorizontal} />
      <i className={styles.lensLineVertical} />
    </div>
  );
}

export function StudioConcept({ comparisonMode = true }: { comparisonMode?: boolean }) {
  const [splashVisible, setSplashVisible] = useState(true);
  const [activePage, setActivePage] = useState<WorkspacePage>("work");
  const [selectedProject, setSelectedProject] = useState<ProjectKey>("harbinger");
  const [expandedProjects, setExpandedProjects] = useState<Set<ProjectKey>>(() => new Set(["harbinger"]));
  const [zoom, setZoom] = useState(92);
  const [isPanning, setIsPanning] = useState(false);
  const [presentation, setPresentation] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const panOrigin = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const canvasX = useMotionValue(0);
  const canvasY = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const selected = projects[selectedProject];
  const activePageData = workspacePages[activePage];

  const closeSplash = useCallback(() => {
    window.sessionStorage.setItem("varun-workspace-opened", "true");
    setSplashVisible(false);
  }, []);

  useEffect(() => {
    if (window.sessionStorage.getItem("varun-workspace-opened") === "true") {
      const storedSessionTimer = window.setTimeout(() => setSplashVisible(false), 0);
      return () => window.clearTimeout(storedSessionTimer);
    }

    const timer = window.setTimeout(closeSplash, prefersReducedMotion ? 450 : 1800);
    return () => window.clearTimeout(timer);
  }, [closeSplash, prefersReducedMotion]);

  useEffect(() => {
    const selectHashPage = () => {
      const page = window.location.hash.slice(1);
      if (page === "work" || page === "process" || page === "about" || page === "contact") {
        setActivePage(page);
        setNoteOpen(false);
        canvasX.set(0);
        canvasY.set(0);
        setZoom(92);
      }
    };

    selectHashPage();
    window.addEventListener("hashchange", selectHashPage);
    return () => window.removeEventListener("hashchange", selectHashPage);
  }, [canvasX, canvasY]);

  const selectPage = useCallback((page: WorkspacePage) => {
    setActivePage(page);
    setNoteOpen(false);
    canvasX.set(0);
    canvasY.set(0);
    setZoom(92);
  }, [canvasX, canvasY]);

  const resetCanvas = useCallback(() => {
    canvasX.set(0);
    canvasY.set(0);
    setZoom(92);
  }, [canvasX, canvasY]);

  const toggleProject = useCallback((project: ProjectKey) => {
    setSelectedProject(project);
    setExpandedProjects((current) => {
      const next = new Set(current);
      if (next.has(project)) next.delete(project);
      else next.add(project);
      return next;
    });
  }, []);

  const selectProject = useCallback((project: ProjectKey) => {
    setSelectedProject(project);
    setExpandedProjects((current) => {
      if (current.has(project)) return current;
      const next = new Set(current);
      next.add(project);
      return next;
    });
  }, []);

  const openSelectedProject = useCallback(() => {
    window.location.assign(selected.href);
  }, [selected.href]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        target?.closest("a, button, input, textarea, select, [contenteditable='true']")
      ) return;
      const key = event.key.toLowerCase();
      if (key === "1" || key === "2" || key === "3" || key === "4" || key === "5") selectProject(projectKeys[Number(key) - 1]);
      if (key === "p") setPresentation((current) => !current);
      if (key === "w") selectPage("work");
      if (key === "a") selectPage("about");
      if (key === "c") selectPage("contact");
      if (key === "0") resetCanvas();
      if (key === "+" || key === "=") setZoom((current) => Math.min(115, current + 8));
      if (key === "-" || key === "_") setZoom((current) => Math.max(70, current - 8));
      if (event.key === "Enter") openSelectedProject();
      if (event.key === "Escape") setPresentation(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openSelectedProject, resetCanvas, selectPage, selectProject]);

  const startPan = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button, a")) return;
    panOrigin.current = { x: event.clientX, y: event.clientY, offsetX: canvasX.get(), offsetY: canvasY.get() };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPanning(true);
  };

  const movePan = (event: React.PointerEvent<HTMLElement>) => {
    if (!isPanning) return;
    canvasX.set(panOrigin.current.offsetX + event.clientX - panOrigin.current.x);
    canvasY.set(panOrigin.current.offsetY + event.clientY - panOrigin.current.y);
  };

  const stopPan = (event: React.PointerEvent<HTMLElement>) => {
    if (!isPanning) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setIsPanning(false);
  };

  return (
    <main className={`${styles.previewPage} ${styles.studioPage} ${presentation ? styles.studioPresentation : ""}`}>
      <AnimatePresence>
        {splashVisible && (
          <motion.section
            className={styles.workspaceSplash}
            role="dialog"
            aria-modal="true"
            aria-label="Opening Varun's design workspace"
            initial={prefersReducedMotion ? false : { opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.015 }}
            transition={{ duration: prefersReducedMotion ? 0.12 : 0.35, ease: "easeOut" }}
          >
            <div className={styles.workspaceSplashGrid} aria-hidden="true" />
            <div className={styles.workspaceSplashContent}>
              <div className={styles.workspaceSplashBrand}>
                <span>V</span>
                <b>Varun J</b>
              </div>
              <div className={styles.workspaceSplashMap} aria-hidden="true">
                <span className={styles.splashProjectHarbinger}>H</span>
                <span className={styles.splashProjectAadivara}>A</span>
                <span className={styles.splashProjectInventfunds}>I</span>
                <i />
                <b />
              </div>
              <p>Opening design workspace</p>
              <h1>Complex Systems<br />Product Designer</h1>
              <div className={styles.workspaceSplashProgress} aria-hidden="true"><span /></div>
            </div>
            <button type="button" onClick={closeSplash}>Skip</button>
          </motion.section>
        )}
      </AnimatePresence>

      <header className={styles.studioToolbar}>
        <Link className={styles.studioBrand} href="/">Varun J</Link>
        <WorkspaceTabs onPortfolioSelect={() => selectPage("work")} />
        <div className={styles.studioTools}>
          <button type="button" disabled={zoom <= 70} onClick={() => setZoom((current) => Math.max(70, current - 8))} aria-label="Zoom out"><WorkspaceIcon name="zoomOut" /></button>
          <button type="button" disabled={zoom >= 115} onClick={() => setZoom((current) => Math.min(115, current + 8))} aria-label="Zoom in"><WorkspaceIcon name="zoomIn" /></button>
          <button className={styles.studioZoomValue} type="button" onClick={resetCanvas} aria-label="Reset canvas">{zoom}%</button>
          <i />
          <button type="button" onClick={() => setPresentation(true)} aria-label="Open presentation mode"><WorkspaceIcon name="play" /></button>
          <button type="button" onClick={() => setNoteOpen((current) => !current)} aria-expanded={noteOpen} aria-pressed={noteOpen} aria-label="View design note"><WorkspaceIcon name="comment" /></button>
          <div className={styles.studioUtilityLinks}>
            <PortfolioLinks />
          </div>
          <button className={styles.studioPresentButton} type="button" onClick={() => setPresentation(true)}>Present</button>
        </div>
        {noteOpen && (
          <aside className={styles.studioNotePopover} role="status">
            <b>Design note</b>
            <p>This workspace keeps the portfolio exploratory while the Present view removes the tool chrome for a faster recruiter scan.</p>
            <button type="button" onClick={() => setNoteOpen(false)} aria-label="Close design note">×</button>
          </aside>
        )}
      </header>

      <div className={styles.studioWorkspace}>
        <aside className={styles.studioLeft} aria-label="Portfolio pages and projects">
          <nav className={styles.studioPrimaryNav}>
            <button className={activePage === "work" ? styles.studioPrimaryActive : ""} type="button" aria-pressed={activePage === "work"} onClick={() => selectPage("work")}><WorkspaceIcon name="grid" /><span>Work</span></button>
            <button className={activePage === "process" ? styles.studioPrimaryActive : ""} type="button" aria-pressed={activePage === "process"} onClick={() => selectPage("process")}><WorkspaceIcon name="process" /><span>Process</span></button>
            <button className={activePage === "about" ? styles.studioPrimaryActive : ""} type="button" aria-pressed={activePage === "about"} onClick={() => selectPage("about")}><WorkspaceIcon name="user" /><span>About</span></button>
            <button className={activePage === "contact" ? styles.studioPrimaryActive : ""} type="button" aria-pressed={activePage === "contact"} onClick={() => selectPage("contact")}><WorkspaceIcon name="mail" /><span>Contact</span></button>
          </nav>

          <div className={styles.studioProjectTree}>
            <p>Projects</p>
            {projectKeys.map((key) => {
              const project = projects[key];
              const expanded = expandedProjects.has(key);
              const controlsId = `${key}-project-pages`;

              return (
                <div className={styles.studioTreeGroup} key={key}>
                  <button
                    className={`${styles.studioTreeProject} ${selectedProject === key ? styles.studioTreeProjectSelected : ""}`}
                    type="button"
                    onClick={() => toggleProject(key)}
                    aria-expanded={expanded}
                    aria-pressed={selectedProject === key}
                    aria-controls={controlsId}
                  >
                    <span>{expanded ? "⌄" : "›"}</span>
                    <WorkspaceIcon name={project.icon} />
                    <b>{project.title}</b>
                  </button>
                  {expanded && (
                    <div className={styles.studioTreeChildren} id={controlsId}>
                      {project.sections.map((section) => (
                        <Link
                          className={selectedProject === key && section.id === "overview" ? styles.studioTreeActive : ""}
                          href={section.href ?? `${project.href}#${section.id}`}
                          key={section.id}
                        >
                          <WorkspaceIcon name={section.icon} />
                          {section.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.studioLeftTools}>
            <button type="button" onClick={() => selectPage("contact")} aria-label="Open contact page"><WorkspaceIcon name="mail" /></button>
            <button type="button" onClick={() => selectPage("work")} aria-label="Open work"><WorkspaceIcon name="folder" /></button>
            <button type="button" onClick={() => selectPage("process")} aria-label="Open process"><WorkspaceIcon name="layers" /></button>
          </div>
        </aside>

        <nav className={styles.studioMobileNav} aria-label="Portfolio pages">
          {(Object.keys(workspacePages) as WorkspacePage[]).map((page) => (
            <button
              key={page}
              className={activePage === page ? styles.studioMobileActive : ""}
              type="button"
              aria-pressed={activePage === page}
              onClick={() => selectPage(page)}
            >
              {workspacePages[page].title.replace("Selected ", "")}
            </button>
          ))}
        </nav>

        <section
          className={`${styles.studioCanvas} ${activePage !== "work" ? styles.studioDocumentCanvas : ""} ${isPanning ? styles.studioCanvasPanning : ""}`}
          id="studio-work"
          aria-label="Interactive portfolio canvas. Drag empty space to pan."
          onPointerDown={startPan}
          onPointerMove={movePan}
          onPointerUp={stopPan}
          onPointerCancel={stopPan}
          onWheel={(event) => {
            if (!event.ctrlKey && !event.metaKey) return;
            event.preventDefault();
            setZoom((current) => Math.max(70, Math.min(115, current - Math.sign(event.deltaY) * 5)));
          }}
        >
          <span id="contact" aria-hidden="true" />
          <motion.div
            className={styles.studioCanvasInner}
            style={{
              x: canvasX,
              y: canvasY,
              scale: zoom / 100,
            }}
          >
            {activePage === "work" && (
              <>
                <article
                  className={styles.studioHeroFrame}
                  onDoubleClick={openSelectedProject}
                >
                  <div className={styles.studioFrameNav}>
                    <b>Varun J</b>
                    <nav>
                      <button type="button" onClick={() => selectPage("work")}>Work</button>
                      <button type="button" onClick={() => selectPage("process")}>Process</button>
                      <button type="button" onClick={() => selectPage("about")}>About</button>
                      <button type="button" onClick={() => selectPage("contact")}>Contact</button>
                    </nav>
                  </div>
                  <div className={styles.studioHeroContent}>
                    <div>
                      <h1>I design clear, scalable experiences for complex enterprise products.</h1>
                      <p>My work focuses on workflows, roles, permissions, data-heavy interfaces and business-critical systems.</p>
                      <div className={styles.studioHeroActions}>
                        <Link href="/work/harbinger">Open Harbinger case study</Link>
                        <button type="button" onClick={() => setPresentation(true)}>Quick scan</button>
                      </div>
                      <span className={styles.studioRole}><WorkspaceIcon name="user" />Complex Systems Product Designer</span>
                    </div>
                    <SystemLens />
                  </div>
                </article>

                <button className={styles.studioCommentPin} type="button" onClick={() => setNoteOpen(true)} aria-label="Open design note"><b>1</b></button>
                <span className={styles.studioMeasure} aria-hidden="true"><i /><b>32</b><i /></span>
                <span className={styles.studioConnector} aria-hidden="true" />

                {projectKeys.map((key, index) => {
                  const project = projects[key];
                  const isSelected = selectedProject === key;
                  return (
                    <motion.button
                      key={key}
                      type="button"
                      className={`${styles.studioProjectFrame} ${styles[`studioProject${index + 1}`]} ${isSelected ? styles.studioProjectSelected : ""}`}
                      style={{ "--project-accent": project.accent } as React.CSSProperties}
                      onClick={() => selectProject(key)}
                      onDoubleClick={() => window.location.assign(project.href)}
                      aria-pressed={selectedProject === key}
                      whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    >
                      {isSelected && <SelectionHandles />}
                      <span className={styles.studioProjectIcon}><WorkspaceIcon name={project.icon} /></span>
                      <b>{project.title}</b>
                      <p>{project.subtitle}</p>
                      <i />
                      <span className={styles.studioProjectArrow}>→</span>
                    </motion.button>
                  );
                })}
              </>
            )}

            {activePage === "process" && (
              <motion.article
                className={`${styles.studioDocumentFrame} ${styles.studioProcessFrame} ${styles.studioFrameSelected}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SelectionHandles />
                <div className={styles.studioDocumentHeader}><b>Process</b><span>Varun J · Product design practice</span></div>
                <p className={styles.studioDocumentLabel}>How I work</p>
                <h1>Understand the system before deciding how the screen should behave.</h1>
                <p className={styles.studioDocumentIntro}>My process is practical. I clarify the product, map the workflow, define the important states and stay involved through implementation.</p>
                <div className={styles.studioProcessGrid}>
                  {processSteps.map(([number, title, copy]) => (
                    <section key={number}>
                      <span>{number}</span>
                      <h2>{title}</h2>
                      <p>{copy}</p>
                    </section>
                  ))}
                </div>
                <div className={styles.studioProcessFooter}>
                  <span>Roles</span><i /> <span>Rules</span><i /> <span>Data</span><i /> <span>Decisions</span>
                </div>
              </motion.article>
            )}

            {activePage === "about" && (
              <motion.article
                className={`${styles.studioDocumentFrame} ${styles.studioAboutFrame} ${styles.studioFrameSelected}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SelectionHandles />
                <div className={styles.studioDocumentHeader}><b>About</b><span>Varun J · Bengaluru, India</span></div>
                <div className={styles.studioAboutGrid}>
                  <div className={styles.studioPortraitGallery}>
                    <figure className={styles.studioPortraitMain}>
                      <Image
                        src="/varun-office.webp"
                        alt="Varun in a product design workspace"
                        fill
                        priority
                        unoptimized
                        sizes="(max-width: 900px) 100vw, 280px"
                      />
                      <figcaption>Senior UI/UX Designer · Bengaluru</figcaption>
                    </figure>
                    <figure>
                      <Image
                        src="/varun-riverside.webp"
                        alt="Varun outdoors beside a river"
                        fill
                        unoptimized
                        sizes="(max-width: 900px) 50vw, 136px"
                      />
                    </figure>
                    <figure>
                      <Image
                        src="/varun-manali.webp"
                        alt="Varun travelling in Manali"
                        fill
                        unoptimized
                        sizes="(max-width: 900px) 50vw, 136px"
                      />
                    </figure>
                  </div>
                  <div>
                    <p className={styles.studioDocumentLabel}>Senior UI/UX Designer</p>
                    <h1>I enjoy making complex enterprise products easier to understand and use.</h1>
                    <p>I started with a strong focus on interface design. My work now goes deeper into workflows, business rules, roles, permissions, data structures and technical constraints.</p>
                    <p>I work closely with stakeholders and developers, document design decisions and review the product after implementation.</p>
                    <div className={styles.studioSkillList}><span>Enterprise UX</span><span>Complex workflows</span><span>Design systems</span><span>Frontend thinking</span></div>
                  </div>
                </div>
              </motion.article>
            )}

            {activePage === "contact" && (
              <motion.article
                className={`${styles.studioDocumentFrame} ${styles.studioContactFrame} ${styles.studioFrameSelected}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SelectionHandles />
                <div className={styles.studioDocumentHeader}><b>Contact</b><span>Open to product design opportunities</span></div>
                <div className={styles.studioContactContent}>
                  <p className={styles.studioDocumentLabel}>Start a conversation</p>
                  <h1>Working on a complex product?</h1>
                  <p>I am interested in product design roles and conversations around enterprise workflows, data-heavy products and business-critical systems.</p>
                  <div className={styles.studioContactActions}>
                    <a href="mailto:varunj93478@gmail.com">
                      <span className={styles.studioContactIcon} aria-hidden="true">✉</span>
                      <span className={styles.studioContactCopy}><b>Email</b><small>Roles and project enquiries</small></span>
                      <span className={styles.studioContactArrow} aria-hidden="true">↗</span>
                    </a>
                    <a href="https://wa.me/917760560455" target="_blank" rel="noreferrer">
                      <span className={styles.studioContactIcon} aria-hidden="true">W</span>
                      <span className={styles.studioContactCopy}><b>WhatsApp</b><small>Start a quick conversation</small></span>
                      <span className={styles.studioContactArrow} aria-hidden="true">↗</span>
                    </a>
                    <a href="https://www.linkedin.com/in/varunj96/" target="_blank" rel="noreferrer">
                      <span className={styles.studioContactIcon} aria-hidden="true">in</span>
                      <span className={styles.studioContactCopy}><b>LinkedIn</b><small>View profile and connect</small></span>
                      <span className={styles.studioContactArrow} aria-hidden="true">↗</span>
                    </a>
                    <a href="/VarunJ_Resume.pdf" download="Varun-J-Resume.pdf">
                      <span className={styles.studioContactIcon} aria-hidden="true">CV</span>
                      <span className={styles.studioContactCopy}><b>Résumé</b><small>Download the latest PDF</small></span>
                      <span className={styles.studioContactArrow} aria-hidden="true">↓</span>
                    </a>
                  </div>
                </div>
              </motion.article>
            )}
          </motion.div>
          <p className={styles.studioCanvasHelp}>Drag empty space to pan · Ctrl/Cmd + scroll to zoom · Press P to present</p>
        </section>

        <aside className={styles.studioInspector} aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${activePage}-${selectedProject}`}
              initial={prefersReducedMotion ? false : { opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, x: -4 }}
              transition={{ duration: 0.16 }}
            >
              <header><h2>{activePage === "work" ? selected.title : activePageData.title}</h2><WorkspaceIcon name="sliders" /></header>
              {activePage === "work" ? (
                <>
                  <dl>
                    <div><dt>Role</dt><dd>Senior UI/UX Designer</dd></div>
                    <div><dt>Scope</dt><dd>{selected.scope}</dd></div>
                    <div><dt>System lens</dt><dd>Roles · Rules · Data · Decisions</dd></div>
                    <div><dt>Status</dt><dd>{selected.status}</dd></div>
                  </dl>
                  <Link className={styles.studioInspectorAction} href={selected.href}>Open {selected.title} case study</Link>
                  <button className={styles.studioInspectorSecondary} type="button" onClick={() => setPresentation(true)}>Present portfolio</button>
                </>
              ) : (
                <>
                  <dl>
                    <div><dt>Page</dt><dd>{activePageData.title}</dd></div>
                    <div><dt>Focus</dt><dd>{activePageData.description}</dd></div>
                    <div><dt>Scope</dt><dd>{activePageData.scope}</dd></div>
                    <div><dt>Status</dt><dd>{activePageData.status}</dd></div>
                  </dl>
                  {activePage === "contact" ? (
                    <div className={styles.studioInspectorGuidance}>
                      <b>No preferred channel</b>
                      <p>Choose email, WhatsApp or LinkedIn based on how you would like to connect.</p>
                    </div>
                  ) : (
                    <button className={styles.studioInspectorAction} type="button" onClick={() => selectPage("work")}>View selected work</button>
                  )}
                  <button className={styles.studioInspectorSecondary} type="button" onClick={() => setPresentation(true)}>Present this page</button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>

      <footer className={styles.studioStatusbar}>
        <span><i /> Portfolio canvas</span>
        <span>{activePageData.title}</span>
        <span>5 projects</span>
        <button type="button" onClick={resetCanvas}><WorkspaceIcon name="reset" size={14} />Reset view</button>
        <span>Press P to present</span>
      </footer>

      {presentation && (
        <button className={styles.studioExitPresentation} type="button" onClick={() => setPresentation(false)}>
          Exit presentation <kbd>Esc</kbd>
        </button>
      )}

      {!presentation && comparisonMode && <PreviewSwitcher active="studio" />}
    </main>
  );
}
