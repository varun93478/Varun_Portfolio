/* eslint-disable @next/next/no-img-element -- Case-study evidence must preserve the original screenshot pixels. */

import type { ReactNode } from "react";
import styles from "../concepts/concepts.module.css";

export const reconstructionLabel = "Portfolio reconstruction based on delivered design.";

export type NarrativeStage = {
  label: "Problem" | "Evidence" | "Decision" | "Solution" | "Outcome";
  description: string;
};

export type StateCoverageItem = {
  state: string;
  cue: string;
  purpose: string;
  tone?: "neutral" | "progress" | "positive" | "warning" | "restricted";
};

export function CaseStorySpine({ stages }: { stages: NarrativeStage[] }) {
  return (
    <ol className={styles.caseStorySpine} aria-label="Case study narrative">
      {stages.map((stage, index) => (
        <li key={stage.label}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div><b>{stage.label}</b><small>{stage.description}</small></div>
        </li>
      ))}
    </ol>
  );
}

export function ArtifactDisclosure({
  kind,
  title,
  summary,
  children,
  reconstructed = true,
  defaultOpen = false,
}: {
  kind: string;
  title: string;
  summary: string;
  children: ReactNode;
  reconstructed?: boolean;
  defaultOpen?: boolean;
}) {
  return (
    <details className={styles.caseArtifactDisclosure} open={defaultOpen}>
      <summary>
        <span>{kind}</span>
        <div><b>{title}</b><small>{summary}</small></div>
        <i aria-hidden="true">+</i>
      </summary>
      <div className={styles.caseArtifactBody}>
        {reconstructed ? <p className={styles.caseReconstructionLabel}>{reconstructionLabel}</p> : null}
        {children}
      </div>
    </details>
  );
}

export function FlowComparison({
  before,
  after,
}: {
  before: string[];
  after: string[];
}) {
  return (
    <div className={styles.caseFlowComparison}>
      <section>
        <header><span>Current-state flow</span><b>Where understanding breaks</b></header>
        <ol>{before.map((step, index) => <li key={step}><i>{index + 1}</i><span>{step}</span></li>)}</ol>
      </section>
      <div className={styles.caseFlowPivot} aria-hidden="true">→</div>
      <section>
        <header><span>Improved flow</span><b>Where the interface intervenes</b></header>
        <ol>{after.map((step, index) => <li key={step}><i>{index + 1}</i><span>{step}</span></li>)}</ol>
      </section>
    </div>
  );
}

export function WireframeStrip({
  frames,
}: {
  frames: Array<{ title: string; note: string; blocks: Array<"heading" | "copy" | "field" | "action" | "status"> }>;
}) {
  return (
    <div className={styles.caseWireframeStrip} aria-label="Low-fidelity wireframe exploration">
      {frames.map((frame, index) => (
        <figure key={frame.title}>
          <figcaption><span>0{index + 1}</span><b>{frame.title}</b></figcaption>
          <div className={styles.caseWireframeCanvas} aria-hidden="true">
            {frame.blocks.map((block, blockIndex) => <i className={styles[`caseWireframe${block[0].toUpperCase()}${block.slice(1)}`]} key={`${block}-${blockIndex}`} />)}
          </div>
          <p>{frame.note}</p>
        </figure>
      ))}
    </div>
  );
}

export function InformationArchitecture({
  title,
  groups,
}: {
  title: string;
  groups: Array<{ role: string; owns: string; access: string[] }>;
}) {
  return (
    <div className={styles.caseInformationArchitecture}>
      <header><span>Information architecture</span><b>{title}</b></header>
      <div>
        {groups.map((group) => (
          <section key={group.role}>
            <span>{group.role}</span>
            <b>{group.owns}</b>
            <ul>{group.access.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export function StateCoverageMatrix({ items }: { items: StateCoverageItem[] }) {
  return (
    <div className={styles.caseStateMatrix} aria-label="Interface state coverage">
      <header><span>Component variants</span><b>State coverage</b><small>Visible cue</small><small>User purpose</small></header>
      {items.map((item) => (
        <div key={item.state}>
          <span data-tone={item.tone ?? "neutral"}>{item.state}</span>
          <b>{item.cue}</b>
          <p>{item.purpose}</p>
        </div>
      ))}
    </div>
  );
}

export function AnnotatedScreen({
  src,
  alt,
  title,
  annotations,
}: {
  src: string;
  alt: string;
  title: string;
  annotations: Array<{ number: string; title: string; detail: string; x: string; y: string }>;
}) {
  return (
    <figure className={styles.caseAnnotatedScreen}>
      <header><span>Visual hierarchy + affordance review</span><b>{title}</b></header>
      <div>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
        {annotations.map((annotation) => (
          <i
            aria-hidden="true"
            key={annotation.number}
            style={{ left: annotation.x, top: annotation.y }}
          >
            {annotation.number}
          </i>
        ))}
      </div>
      <figcaption>
        {annotations.map((annotation) => (
          <div key={annotation.number}><span>{annotation.number}</span><p><b>{annotation.title}</b>{annotation.detail}</p></div>
        ))}
      </figcaption>
    </figure>
  );
}

export function ChapterResolution({
  decision,
  tradeoff,
  behavior,
  validation,
}: {
  decision: string;
  tradeoff: string;
  behavior: string;
  validation: string;
}) {
  const items = [
    ["Decision", decision],
    ["Trade-off", tradeoff],
    ["Resulting behavior", behavior],
    ["Validation boundary", validation],
  ];

  return (
    <section className={styles.caseChapterResolution} aria-label="Chapter resolution">
      <header><span>Chapter resolution</span><b>What changed—and what still needs proof</b></header>
      <div>{items.map(([label, copy]) => <article key={label}><span>{label}</span><p>{copy}</p></article>)}</div>
    </section>
  );
}
