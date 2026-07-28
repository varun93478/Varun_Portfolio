"use client";

import { useCallback, useEffect, useState } from "react";

export function useActiveSection<T extends string>(
  sectionIds: readonly T[],
  initialSection: T,
) {
  const [activeSection, setActiveSection] = useState<T>(initialSection);

  useEffect(() => {
    const updateFromHash = () => {
      const hash = window.location.hash.slice(1) as T;
      if (sectionIds.includes(hash)) setActiveSection(hash);
    };

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    const root = document.querySelector<HTMLElement>("[data-case-scroll]");
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id as T);
      },
      {
        root: root && getComputedStyle(root).overflowY !== "visible" ? root : null,
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0, 0.12, 0.35],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener("hashchange", updateFromHash);
      observer.disconnect();
    };
  }, [initialSection, sectionIds]);

  const selectSection = useCallback((id: T) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  return { activeSection, selectSection };
}
