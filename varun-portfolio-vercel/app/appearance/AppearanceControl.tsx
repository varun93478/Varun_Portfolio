"use client";

import { useEffect, useState } from "react";
import styles from "./appearance.module.css";

type ThemeMode = "system" | "light" | "dark" | "custom";

const modes: { id: ThemeMode; label: string }[] = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "custom", label: "Custom" },
];

const accents = ["#3155e7", "#6f4ad8", "#087d71", "#a44f2f", "#a23d68"];

function applyAppearance(mode: ThemeMode, accent: string, systemDark: boolean) {
  const resolved = mode === "system" ? (systemDark ? "dark" : "light") : mode === "custom" ? "dark" : mode;
  document.documentElement.dataset.portfolioTheme = resolved;
  document.documentElement.dataset.portfolioThemeMode = mode;
  document.documentElement.style.setProperty("--portfolio-accent", accent);
  document.documentElement.style.colorScheme = resolved;
}

export function AppearanceControl({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [accent, setAccent] = useState(accents[0]);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const storedMode = window.localStorage.getItem("varun-portfolio-theme") as ThemeMode | null;
    const storedAccent = window.localStorage.getItem("varun-portfolio-accent");
    const nextMode = modes.some((item) => item.id === storedMode) ? storedMode! : "system";
    const nextAccent = storedAccent && accents.includes(storedAccent) ? storedAccent : accents[0];
    const updateSystem = () => setSystemDark(query.matches);
    const frame = window.requestAnimationFrame(() => {
      setMode(nextMode);
      setAccent(nextAccent);
      setSystemDark(query.matches);
      applyAppearance(nextMode, nextAccent, query.matches);
    });
    query.addEventListener("change", updateSystem);
    return () => {
      window.cancelAnimationFrame(frame);
      query.removeEventListener("change", updateSystem);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("varun-portfolio-theme", mode);
    window.localStorage.setItem("varun-portfolio-accent", accent);
    applyAppearance(mode, accent, systemDark);
  }, [accent, mode, systemDark]);

  return (
    <details className={`${styles.appearance} ${compact ? styles.compact : ""}`}>
      <summary aria-label="Open appearance settings" title="Appearance">
        <span aria-hidden="true" className={styles.appearanceIcon}><i /><i /></span>
        <span className={styles.appearanceLabel}>Appearance</span>
      </summary>
      <div className={styles.panel} role="dialog" aria-label="Portfolio appearance">
        <header><div><strong>Appearance</strong><span>Readable in every mode</span></div></header>
        <div className={styles.modes} aria-label="Theme mode">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={mode === item.id}
              onClick={() => setMode(item.id)}
            >
              <i data-mode={item.id} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </div>
        {mode === "custom" ? (
          <div className={styles.accents}>
            <span>Accent</span>
            <div>
              {accents.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Use ${color} accent`}
                  aria-pressed={accent === color}
                  style={{ "--swatch": color } as React.CSSProperties}
                  onClick={() => setAccent(color)}
                />
              ))}
            </div>
          </div>
        ) : null}
        <p>Theme and accent choices are saved on this device.</p>
      </div>
    </details>
  );
}
