"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./concepts.module.css";

type ProjectTabId = "harbinger" | "aadivara" | "inventfunds" | "property-care" | "hcm-cafe";

type StoredTabs = {
  open: ProjectTabId[];
  recent: ProjectTabId[];
};

const storageKey = "varun-portfolio-tabs-v1";

const projectTabs: Record<ProjectTabId, { title: string; href: string; paths: string[] }> = {
  harbinger: {
    title: "Harbinger Motors",
    href: "/work/harbinger",
    paths: ["/work/harbinger", "/work/harbinger/v2", "/work/harbinger/documentation"],
  },
  aadivara: {
    title: "Aadivara",
    href: "/work/aadivara",
    paths: ["/work/aadivara"],
  },
  inventfunds: {
    title: "InventFunds",
    href: "/work/inventfunds",
    paths: ["/work/inventfunds"],
  },
  "property-care": {
    title: "Property Care",
    href: "/work/property-care",
    paths: ["/work/property-care"],
  },
  "hcm-cafe": {
    title: "HCM Café",
    href: "/work/hcm-cafe",
    paths: ["/work/hcm-cafe"],
  },
};

const projectTabIds = Object.keys(projectTabs) as ProjectTabId[];

function isProjectTabId(value: unknown): value is ProjectTabId {
  return typeof value === "string" && projectTabIds.includes(value as ProjectTabId);
}

function readStoredTabs(): StoredTabs {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "{}") as Partial<StoredTabs>;
    return {
      open: Array.isArray(parsed.open) ? parsed.open.filter(isProjectTabId) : [],
      recent: Array.isArray(parsed.recent) ? parsed.recent.filter(isProjectTabId) : [],
    };
  } catch {
    return { open: [], recent: [] };
  }
}

function writeStoredTabs(value: StoredTabs) {
  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

function projectFromPath(pathname: string): ProjectTabId | null {
  return projectTabIds.find((id) => projectTabs[id].paths.includes(pathname)) ?? null;
}

export function WorkspaceTabs({ onPortfolioSelect }: { onPortfolioSelect?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentProject = useMemo(() => projectFromPath(pathname), [pathname]);
  const [openTabs, setOpenTabs] = useState<ProjectTabId[]>(currentProject ? [currentProject] : []);

  useEffect(() => {
    const stored = readStoredTabs();
    const open = currentProject && !stored.open.includes(currentProject)
      ? [...stored.open, currentProject]
      : stored.open;
    const recent = currentProject
      ? [...stored.recent.filter((id) => id !== currentProject), currentProject]
      : stored.recent;

    writeStoredTabs({ open, recent });
    const frame = window.requestAnimationFrame(() => setOpenTabs(open));
    return () => window.cancelAnimationFrame(frame);
  }, [currentProject]);

  const rememberTab = (id: ProjectTabId) => {
    const stored = readStoredTabs();
    writeStoredTabs({
      open: stored.open.includes(id) ? stored.open : [...stored.open, id],
      recent: [...stored.recent.filter((tabId) => tabId !== id), id],
    });
  };

  const closeTab = (id: ProjectTabId) => {
    const stored = readStoredTabs();
    const open = stored.open.filter((tabId) => tabId !== id);
    const recent = stored.recent.filter((tabId) => tabId !== id);
    writeStoredTabs({ open, recent });
    setOpenTabs(open);

    if (currentProject === id) {
      const previous = [...recent].reverse().find((tabId) => open.includes(tabId));
      router.push(previous ? projectTabs[previous].href : "/");
    }
  };

  return (
    <nav className={styles.studioTabs} aria-label="Open portfolio tabs" role="tablist">
      <span className={`${styles.studioTabItem} ${pathname === "/" ? styles.studioTabActive : ""}`}>
        <Link
          href="/"
          role="tab"
          aria-selected={pathname === "/"}
          onClick={onPortfolioSelect}
        >
          Portfolio
        </Link>
      </span>

      {openTabs.map((id) => {
        const tab = projectTabs[id];
        const active = currentProject === id;
        return (
          <span className={`${styles.studioTabItem} ${active ? styles.studioTabActive : ""}`} key={id}>
            <Link
              href={tab.href}
              role="tab"
              aria-selected={active}
              onClick={() => rememberTab(id)}
            >
              {tab.title}
            </Link>
            <button type="button" onClick={() => closeTab(id)} aria-label={`Close ${tab.title} tab`}>×</button>
          </span>
        );
      })}
    </nav>
  );
}
