"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PreviewSwitcher } from "./ConceptExperience";
import { PortfolioLinks } from "./PortfolioLinks";
import { SystemOrbit3D } from "./SystemOrbit3D";
import { WorkspaceTabs } from "./WorkspaceTabs";
import styles from "./concepts.module.css";

type ProjectKey = "harbinger" | "aadivara" | "inventfunds" | "propertycare" | "hcmcafe";
type WorkspacePage = "work" | "process" | "about" | "contact";
type ThemeMode = "system" | "light" | "dark" | "custom";
export type IconName =
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
  | "pointer"
  | "puzzle"
  | "panelLeft"
  | "panelRight"
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
      { id: "configuration", label: "Configuration rules", icon: "sliders" },
      { id: "ownership", label: "Delivery ownership", icon: "truck" },
      { id: "pdi", label: "PDI and JSON forms", icon: "check" },
      { id: "validation", label: "Validation and UI QA", icon: "layers" },
      { id: "outcomes", label: "Outcomes", icon: "process" },
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
const projectConnectorX = [92, 272, 452, 632, 812] as const;
const customThemeColors = ["#3155e7", "#6f4ad8", "#0f8374", "#b15b31", "#a23d68"] as const;
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
    description: "UI/UX Designer focused on complex enterprise systems and implementation-aware product work.",
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

export function WorkspaceIcon({ name, size = 18 }: { name: IconName; size?: number }) {
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
  if (name === "pointer") return <svg {...shared}><path d="m5 3 13 9-6 1.5-3 6z" /></svg>;
  if (name === "puzzle") return <svg {...shared}><path d="M9 4h3a2.5 2.5 0 1 1 5 0h3v5a2.5 2.5 0 1 0 0 5v6h-6a2.5 2.5 0 1 0-5 0H4v-5a2.5 2.5 0 1 1 0-5V4h5z" /></svg>;
  if (name === "panelLeft") return <svg {...shared}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></svg>;
  if (name === "panelRight") return <svg {...shared}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M15 4v16" /></svg>;
  return <svg {...shared}><path d="M5 8a8 8 0 1 1-1 7" /><path d="M5 3v5h5" /></svg>;
}

function SelectionHandles() {
  return (
    <span className={styles.studioHandles} aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => <i key={index} />)}
    </span>
  );
}

function EditorialSystemHero({ accent, onQuickScan }: { accent: string; onQuickScan: () => void }) {
  return (
    <div className={styles.studioEditorialHero}>
      <div className={styles.studioEditorialTop}>
        <div className={styles.studioEditorialCopy}>
          <span className={styles.studioEditorialRole}>UI/UX Designer · Enterprise B2B Products</span>
          <h1>
            <span>I make complex enterprise</span>
            <span>products easier to understand</span>
            <span>and operate.</span>
          </h1>
        </div>

        <SystemOrbit3D accent={accent} />
      </div>

      <div className={styles.studioEditorialLower}>
        <div className={styles.studioEditorialIntro}>
          <p>
            I map the roles, rules, data and decisions behind enterprise products—then turn that complexity into workflows teams can trust.
          </p>
        </div>

        <div className={styles.studioEditorialActions}>
          <Link href="/work/harbinger">Explore Harbinger <span aria-hidden="true">→</span></Link>
          <button type="button" onClick={onQuickScan}>Quick scan</button>
        </div>
      </div>

      <div className={styles.studioEditorialFocus} aria-label="Product design focus">
        <span><b>01</b> Role logic</span>
        <span><b>02</b> Workflow clarity</span>
        <span><b>03</b> Operational states</span>
      </div>
    </div>
  );
}

export function StudioConcept({
  comparisonMode = true,
  showSplash = true,
  onExit,
}: {
  comparisonMode?: boolean;
  showSplash?: boolean;
  onExit?: () => void;
}) {
  const [splashVisible, setSplashVisible] = useState(showSplash);
  const [activePage, setActivePage] = useState<WorkspacePage>("work");
  const [selectedProject, setSelectedProject] = useState<ProjectKey>("harbinger");
  const [expandedProjects, setExpandedProjects] = useState<Set<ProjectKey>>(() => new Set(["harbinger"]));
  const [zoom, setZoom] = useState(92);
  const [isPanning, setIsPanning] = useState(false);
  const [presentation, setPresentation] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [pluginsOpen, setPluginsOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [systemDark, setSystemDark] = useState(false);
  const [customAccent, setCustomAccent] = useState("#3155e7");
  const panOrigin = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const themePanelRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const canvasX = useMotionValue(0);
  const canvasY = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const selected = projects[selectedProject];
  const activePageData = workspacePages[activePage];
  const selectedProjectIndex = projectKeys.indexOf(selectedProject);
  const darkTheme = themeMode === "dark" || (themeMode === "system" && systemDark);
  const activeAccent = themeMode === "custom" ? customAccent : "#3155e7";
  const accentInk = (() => {
    const hex = activeAccent.replace("#", "");
    const [red, green, blue] = [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
    return (red * 299 + green * 587 + blue * 114) / 1000 > 150 ? "#151619" : "#ffffff";
  })();

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => setSystemDark(media.matches);
    const storedMode = window.localStorage.getItem("varun-portfolio-theme");
    const storedAccent = window.localStorage.getItem("varun-portfolio-accent");
    const initialThemeFrame = window.requestAnimationFrame(() => {
      updateSystemTheme();
      if (storedMode === "system" || storedMode === "light" || storedMode === "dark" || storedMode === "custom") {
        setThemeMode(storedMode);
      }
      if (/^#[0-9a-f]{6}$/i.test(storedAccent ?? "")) setCustomAccent(storedAccent!);
    });
    media.addEventListener("change", updateSystemTheme);
    return () => {
      window.cancelAnimationFrame(initialThemeFrame);
      media.removeEventListener("change", updateSystemTheme);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("varun-portfolio-theme", themeMode);
    window.localStorage.setItem("varun-portfolio-accent", customAccent);
  }, [customAccent, themeMode]);

  useEffect(() => {
    if (!themeOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!themePanelRef.current?.contains(event.target as Node)) setThemeOpen(false);
    };
    window.addEventListener("pointerdown", closeOnOutsideClick);
    return () => window.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [themeOpen]);

  useEffect(() => {
    if (!noteOpen && !pluginsOpen) return;
    const closeDockPanels = (event: PointerEvent) => {
      if (dockRef.current?.contains(event.target as Node)) return;
      setNoteOpen(false);
      setPluginsOpen(false);
    };
    window.addEventListener("pointerdown", closeDockPanels);
    return () => window.removeEventListener("pointerdown", closeDockPanels);
  }, [noteOpen, pluginsOpen]);

  const closeSplash = useCallback(() => {
    window.sessionStorage.setItem("varun-workspace-opened", "true");
    setSplashVisible(false);
  }, []);

  useEffect(() => {
    if (!showSplash) return;
    if (window.sessionStorage.getItem("varun-workspace-opened") === "true") {
      const storedSessionTimer = window.setTimeout(() => setSplashVisible(false), 0);
      return () => window.clearTimeout(storedSessionTimer);
    }

    const timer = window.setTimeout(closeSplash, prefersReducedMotion ? 0 : 720);
    return () => window.clearTimeout(timer);
  }, [closeSplash, prefersReducedMotion, showSplash]);

  useEffect(() => {
    const selectHashPage = () => {
      const page = window.location.hash.slice(1);
      if (page === "work" || page === "process" || page === "about" || page === "contact") {
        setActivePage(page);
        setNoteOpen(false);
        setPluginsOpen(false);
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
    setPluginsOpen(false);
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
      if (key === "v") {
        setNoteOpen(false);
        setPluginsOpen(false);
      }
      if (key === "n") {
        setNoteOpen((current) => !current);
        setPluginsOpen(false);
      }
      if (key === "w") selectPage("work");
      if (key === "a") selectPage("about");
      if (key === "c") selectPage("contact");
      if (key === "0") resetCanvas();
      if (key === "+" || key === "=") setZoom((current) => Math.min(115, current + 8));
      if (key === "-" || key === "_") setZoom((current) => Math.max(70, current - 8));
      if (event.key === "Enter") openSelectedProject();
      if (event.key === "Escape") {
        setPresentation(false);
        setThemeOpen(false);
        setNoteOpen(false);
        setPluginsOpen(false);
      }
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
    <main
      className={`${styles.previewPage} ${styles.studioPage} ${darkTheme ? styles.studioDark : ""} ${themeMode === "custom" ? styles.studioCustom : ""} ${presentation ? styles.studioPresentation : ""}`}
      style={{
        "--studio-blue": activeAccent,
        "--studio-accent-ink": accentInk,
      } as React.CSSProperties}
    >
      <AnimatePresence>
        {splashVisible && (
          <motion.section
            className={styles.workspaceSplash}
            aria-hidden="true"
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
          </motion.section>
        )}
      </AnimatePresence>

      <header className={styles.studioToolbar}>
        <Link className={styles.studioBrand} href="/">Varun J</Link>
        {onExit && <button className={styles.studioOsHome} type="button" onClick={onExit}>Varun OS</button>}
        <WorkspaceTabs onPortfolioSelect={() => selectPage("work")} />
        <div className={styles.studioTools}>
          <button type="button" disabled={zoom <= 70} onClick={() => setZoom((current) => Math.max(70, current - 8))} aria-label="Zoom out"><WorkspaceIcon name="zoomOut" /></button>
          <button type="button" disabled={zoom >= 115} onClick={() => setZoom((current) => Math.min(115, current + 8))} aria-label="Zoom in"><WorkspaceIcon name="zoomIn" /></button>
          <button className={styles.studioZoomValue} type="button" onClick={resetCanvas} aria-label="Reset canvas">{zoom}%</button>
          <i />
          <button type="button" onClick={() => setPresentation(true)} aria-label="Open presentation mode"><WorkspaceIcon name="play" /></button>
          <button type="button" onClick={() => {
            setNoteOpen((current) => !current);
            setPluginsOpen(false);
          }} aria-expanded={noteOpen} aria-pressed={noteOpen} aria-label="View design note"><WorkspaceIcon name="comment" /></button>
          <div className={styles.studioThemeControl} ref={themePanelRef}>
            <button
              type="button"
              onClick={() => {
                setThemeOpen((current) => !current);
                setNoteOpen(false);
                setPluginsOpen(false);
              }}
              aria-expanded={themeOpen}
              aria-haspopup="dialog"
              aria-label="Change portfolio appearance"
            >
              <span style={{ background: activeAccent }} />
              <WorkspaceIcon name="sliders" />
            </button>
            {themeOpen && (
              <aside className={styles.studioThemePanel} role="dialog" aria-label="Portfolio appearance">
                <header>
                  <div><b>Appearance</b><span>Saved on this device</span></div>
                  <button type="button" onClick={() => setThemeOpen(false)} aria-label="Close appearance settings">×</button>
                </header>
                <div className={styles.studioThemeModes} aria-label="Theme mode">
                  {(["system", "light", "dark", "custom"] as ThemeMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className={themeMode === mode ? styles.studioThemeActive : ""}
                      aria-pressed={themeMode === mode}
                      onClick={() => setThemeMode(mode)}
                    >
                      <i aria-hidden="true" />
                      {mode[0].toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
                {themeMode === "custom" && (
                  <div className={styles.studioThemeCustom}>
                    <span>Accent colour</span>
                    <div>
                      {customThemeColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={customAccent === color ? styles.studioColorActive : ""}
                          style={{ "--swatch": color } as React.CSSProperties}
                          onClick={() => setCustomAccent(color)}
                          aria-label={`Use ${color} as the accent colour`}
                          aria-pressed={customAccent === color}
                        />
                      ))}
                      <label title="Choose a custom accent colour">
                        <input
                          type="color"
                          value={customAccent}
                          onChange={(event) => setCustomAccent(event.target.value)}
                          aria-label="Choose a custom accent colour"
                        />
                        +
                      </label>
                    </div>
                    <small>The accent updates selections, buttons and focus states. Text contrast adjusts automatically.</small>
                  </div>
                )}
              </aside>
            )}
          </div>
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

      <div className={`${styles.studioWorkspace} ${!leftPanelOpen ? styles.studioWorkspaceLeftClosed : ""} ${!rightPanelOpen ? styles.studioWorkspaceRightClosed : ""}`}>
        <aside className={styles.studioLeft} id="portfolio-layers-panel" aria-label="Portfolio pages and projects" aria-hidden={!leftPanelOpen}>
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
                  <EditorialSystemHero
                    accent={activeAccent}
                    onQuickScan={() => {
                      selectProject("harbinger");
                      document.getElementById("project-overview")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
                    }}
                  />
                </article>

                <svg className={styles.studioSelectionMap} viewBox="0 0 900 690" aria-hidden="true">
                  <motion.path
                    key={selectedProject}
                    d={`M 450 468 V 485 H ${projectConnectorX[selectedProjectIndex]} V 502`}
                    initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.42, ease: "easeOut" }}
                  />
                  <motion.circle
                    cx={projectConnectorX[selectedProjectIndex]}
                    cy="502"
                    r="3.5"
                    initial={prefersReducedMotion ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.25 }}
                  />
                </svg>

                {projectKeys.map((key, index) => {
                  const project = projects[key];
                  const isSelected = selectedProject === key;
                  return (
                    <motion.button
                      key={key}
                      id={index === 0 ? "project-overview" : undefined}
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
                      <small>{String(index + 1).padStart(2, "0")}</small>
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
                      <figcaption>UI/UX Designer · Bengaluru</figcaption>
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
                    <p className={styles.studioDocumentLabel}>UI/UX Designer</p>
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
                      <span className={styles.studioContactCopy}><b>Resume</b><small>Download the latest PDF</small></span>
                      <span className={styles.studioContactArrow} aria-hidden="true">↓</span>
                    </a>
                  </div>
                </div>
              </motion.article>
            )}
          </motion.div>
          <p className={styles.studioCanvasHelp}>Drag empty space to pan · Ctrl/Cmd + scroll to zoom · Press P to present</p>
        </section>

        <aside className={styles.studioInspector} id="portfolio-inspector-panel" aria-live="polite" aria-hidden={!rightPanelOpen}>
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
                    <div><dt>Role</dt><dd>UI/UX Designer</dd></div>
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

      {!presentation && (
        <div className={styles.studioDockArea} ref={dockRef}>
          {pluginsOpen && (
            <aside className={styles.studioPluginPopover} role="dialog" aria-label="Workspace plugins">
              <header>
                <div><b>Workspace plugins</b><span>Useful portfolio actions</span></div>
                <button type="button" onClick={() => setPluginsOpen(false)} aria-label="Close plugins">×</button>
              </header>
              <button type="button" onClick={() => {
                selectProject("harbinger");
                selectPage("work");
                setZoom(100);
                setPluginsOpen(false);
              }}><WorkspaceIcon name="zoomIn" /><span><b>Recruiter quick scan</b><small>Focus the flagship case study</small></span></button>
              <button type="button" onClick={() => {
                setPluginsOpen(false);
                setThemeOpen(true);
              }}><WorkspaceIcon name="sliders" /><span><b>Appearance</b><small>Theme and accent controls</small></span></button>
              <button type="button" onClick={() => {
                setPluginsOpen(false);
                setPresentation(true);
              }}><WorkspaceIcon name="play" /><span><b>Presentation</b><small>Hide the workspace chrome</small></span></button>
            </aside>
          )}
          <nav className={styles.studioToolDock} aria-label="Canvas tools">
            <button className={styles.studioToolDockActive} type="button" aria-pressed="true" onClick={() => {
              setNoteOpen(false);
              setPluginsOpen(false);
            }} title="Move canvas (V)"><WorkspaceIcon name="pointer" /><span>Move</span></button>
            <button type="button" aria-pressed={noteOpen} aria-expanded={noteOpen} onClick={() => {
              setNoteOpen((current) => !current);
              setPluginsOpen(false);
            }} title="Design note (N)"><WorkspaceIcon name="comment" /><span>Comment</span></button>
            <button type="button" aria-pressed={pluginsOpen} aria-expanded={pluginsOpen} onClick={() => {
              setPluginsOpen((current) => !current);
              setNoteOpen(false);
              setThemeOpen(false);
            }} title="Workspace plugins"><WorkspaceIcon name="puzzle" /><span>Plugins</span></button>
            <i aria-hidden="true" />
            <button type="button" aria-pressed={leftPanelOpen} aria-expanded={leftPanelOpen} aria-controls="portfolio-layers-panel" onClick={() => setLeftPanelOpen((current) => !current)} title="Toggle layers panel"><WorkspaceIcon name="panelLeft" /><span>Layers</span></button>
            <button className={styles.studioDockInspector} type="button" aria-pressed={rightPanelOpen} aria-expanded={rightPanelOpen} aria-controls="portfolio-inspector-panel" onClick={() => setRightPanelOpen((current) => !current)} title="Toggle inspector panel"><WorkspaceIcon name="panelRight" /><span>Inspect</span></button>
          </nav>
        </div>
      )}

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
