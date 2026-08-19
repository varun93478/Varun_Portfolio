import type { ReactNode } from "react";
import Link from "next/link";
import { PortfolioLinks } from "./PortfolioLinks";
import styles from "./concepts.module.css";

export function CaseFileHeader({ fileName, children }: { fileName: string; children?: ReactNode }) {
  return (
    <header className={styles.studioToolbar}>
      <Link className={styles.studioBrand} href="/" aria-label="Return to Varun OS desktop">Varun OS</Link>
      <nav className={styles.caseFileBreadcrumb} aria-label="File location">
        <span aria-hidden="true">/</span>
        <strong>{fileName}</strong>
      </nav>
      <div className={styles.caseToolbarActions}>
        {children}
        <PortfolioLinks />
      </div>
    </header>
  );
}
