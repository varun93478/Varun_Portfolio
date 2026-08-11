"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import styles from "./concepts.module.css";
import { StudioConcept } from "./StudioExperience";

export type ConceptName = "editorial" | "console" | "atlas" | "studio";
type SystemNode = "Roles" | "Rules" | "Data" | "Decisions";

const nodes: Array<{ name: SystemNode; icon: string; note: string }> = [
  { name: "Roles", icon: "◎", note: "People, permissions and handoffs" },
  { name: "Rules", icon: "▤", note: "Logic, validation and constraints" },
  { name: "Data", icon: "◫", note: "Records, states and relationships" },
  { name: "Decisions", icon: "⌘", note: "Actions, outcomes and trade-offs" },
];

const conceptLinks: Array<{ name: ConceptName; label: string; number: string }> = [
  { name: "editorial", label: "Editorial", number: "01" },
  { name: "console", label: "Console", number: "02" },
  { name: "atlas", label: "Atlas", number: "03" },
  { name: "studio", label: "Workspace", number: "04" },
];

function PreviewNav({ light = false }: { light?: boolean }) {
  return (
    <header className={`${styles.previewNav} ${light ? styles.previewNavLight : ""}`}>
      <Link className={styles.previewBrand} href="/">Varun J</Link>
      <nav aria-label="Portfolio preview navigation">
        <Link href="/work/harbinger">Work</Link>
        <Link href="/#about">About</Link>
        <Link href="/#notes">Notes</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
    </header>
  );
}

function PreviewActions({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`${styles.previewActions} ${inverse ? styles.previewActionsInverse : ""}`}>
      <Link href="/work/harbinger">View selected work <span>→</span></Link>
      <Link href="/#notes">How I work <span>→</span></Link>
    </div>
  );
}

export function PreviewSwitcher({ active }: { active: ConceptName }) {
  return (
    <aside className={styles.previewSwitcher} aria-label="Switch portfolio concept">
      <Link className={styles.backCurrent} href="/">Current site</Link>
      <span>Compare</span>
      {conceptLinks.map((concept) => (
        <Link
          key={concept.name}
          className={active === concept.name ? styles.activeConcept : ""}
          href={`/concepts/${concept.name}`}
          aria-current={active === concept.name ? "page" : undefined}
        >
          <b>{concept.number}</b>
          {concept.label}
        </Link>
      ))}
    </aside>
  );
}

function ProjectLink({ variant }: { variant: ConceptName }) {
  return (
    <Link className={`${styles.projectLink} ${styles[`projectLink${variant}`]}`} href="/work/harbinger">
      {variant === "atlas" && <div className={styles.truckSilhouette}><span>H</span></div>}
      <div>
        <span>{variant === "console" ? "Featured system" : "Featured project"}</span>
        <h2>Harbinger Motors</h2>
        <p>HBR + Dealer Portal</p>
      </div>
      <b aria-hidden="true">→</b>
    </Link>
  );
}

function EditorialConcept() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className={`${styles.previewPage} ${styles.editorialPage}`}>
      <div className={styles.editorialFrame}>
        <PreviewNav light />
        <motion.section
          className={styles.editorialHero}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className={styles.editorialCopy}>
            <p>UI/UX Designer · Enterprise B2B Products</p>
            <h1>Enterprise UI/UX<br />Designer</h1>
            <div className={styles.editorialIntro}>
              <h2>I design clear, scalable experiences for complex enterprise products.</h2>
              <p>My work focuses on workflows, roles, permissions, data-heavy interfaces, and business-critical systems.</p>
              <PreviewActions />
            </div>
          </div>

          <div className={styles.blueprintPanel} aria-label="System blueprint">
            <article>
              <span>System overview</span>
              <div className={styles.blueprintFlow}>
                <i /><i /><i />
                <b>Roles</b><em>→</em><b>Rules</b><em>→</em><strong>Actions</strong>
              </div>
            </article>
            <article>
              <span>Core considerations</span>
              <ol>
                <li>Connected roles</li>
                <li>Consistent rules</li>
                <li>Reliable data</li>
                <li>Informed decisions</li>
              </ol>
            </article>
            <article>
              <span>Data flow</span>
              <div className={styles.dataFlow}><i>Data</i><b>Validate</b><b>Apply rules</b><b>Decisions</b></div>
            </article>
          </div>
          <ProjectLink variant="editorial" />
          <div className={styles.editorialFooterLine}><i /> Enterprise UX&nbsp; • &nbsp;Systems thinking&nbsp; • &nbsp;Developer collaboration</div>
        </motion.section>
      </div>
      <PreviewSwitcher active="editorial" />
    </main>
  );
}

function ConsoleConcept() {
  const [activeNode, setActiveNode] = useState<SystemNode>("Data");
  const prefersReducedMotion = useReducedMotion();
  const active = nodes.find((node) => node.name === activeNode)!;

  return (
    <main className={`${styles.previewPage} ${styles.consolePage}`}>
      <PreviewNav />
      <section className={styles.consoleHero}>
        <motion.div
          className={styles.consoleCopy}
          initial={prefersReducedMotion ? false : { opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p><i /> UI/UX Designer · Enterprise B2B Products <span /></p>
          <h1>I design clear, scalable experiences for complex enterprise products.</h1>
          <h2>My work focuses on workflows, roles, permissions, data-heavy interfaces, and business-critical systems.</h2>
          <PreviewActions inverse />
          <div className={styles.consoleCapabilities}>+ Enterprise UX&nbsp; · &nbsp;Systems thinking&nbsp; · &nbsp;Developer collaboration</div>
        </motion.div>

        <motion.div
          className={styles.consoleSystem}
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <div className={styles.consoleMap}>
            <div className={styles.consoleLineOne} />
            <div className={styles.consoleLineTwo} />
            <div className={styles.consoleCore}><i /> <span>{active.name}</span></div>
            {nodes.map((node) => (
              <button
                key={node.name}
                type="button"
                className={`${styles.consoleNode} ${styles[`console${node.name}`]} ${activeNode === node.name ? styles.consoleNodeActive : ""}`}
                onClick={() => setActiveNode(node.name)}
                aria-pressed={activeNode === node.name}
              >
                <i>{node.icon}</i>
                <b>{node.name}</b>
              </button>
            ))}
            <p>{active.note}</p>
          </div>
          <ProjectLink variant="console" />
        </motion.div>
      </section>
      <PreviewSwitcher active="console" />
    </main>
  );
}

function AtlasConcept() {
  const [activeNode, setActiveNode] = useState<SystemNode>("Roles");
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className={`${styles.previewPage} ${styles.atlasPage}`}>
      <PreviewNav />
      <section className={styles.atlasHero}>
        <motion.div
          className={styles.atlasCopy}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p>UI/UX Designer · Enterprise B2B Products</p>
          <h1>I design clear, scalable experiences for complex enterprise products.</h1>
          <h2>My work focuses on workflows, roles, permissions, data-heavy interfaces, and business-critical systems.</h2>
          <PreviewActions inverse />
          <ProjectLink variant="atlas" />
          <div className={styles.atlasCapabilities}><i>◎</i> Enterprise UX&nbsp; • &nbsp;Systems thinking&nbsp; • &nbsp;Developer collaboration</div>
        </motion.div>

        <motion.div
          className={styles.atlasBoard}
          initial={prefersReducedMotion ? false : { opacity: 0, rotateY: -3, y: 10 }}
          animate={{ opacity: 1, rotateY: 0, y: 0 }}
          transition={{ duration: 0.65 }}
          aria-label="Playable system atlas"
        >
          <div className={styles.atlasRailHorizontal} />
          <div className={styles.atlasRailVertical} />
          <div className={styles.atlasHub}><i /></div>
          {nodes.map((node, index) => (
            <motion.button
              key={node.name}
              type="button"
              className={`${styles.atlasCard} ${styles[`atlas${node.name}`]} ${activeNode === node.name ? styles.atlasCardActive : ""}`}
              onClick={() => setActiveNode(node.name)}
              aria-pressed={activeNode === node.name}
              whileHover={prefersReducedMotion ? undefined : { y: -7, rotate: index % 2 === 0 ? -0.5 : 0.5 }}
              whileTap={{ scale: 0.98 }}
            >
              <span /><span /><i>{node.icon}</i><b>{node.name}</b>
            </motion.button>
          ))}
          <p>{nodes.find((node) => node.name === activeNode)?.note}</p>
        </motion.div>
      </section>
      <PreviewSwitcher active="atlas" />
    </main>
  );
}

export function ConceptExperience({ concept }: { concept: ConceptName }) {
  if (concept === "editorial") return <EditorialConcept />;
  if (concept === "console") return <ConsoleConcept />;
  if (concept === "atlas") return <AtlasConcept />;
  return <StudioConcept />;
}
