import Link from "next/link";
import { CaseFileHeader } from "../concepts/CaseFileHeader";
import { SystemIcon, type SystemIconName } from "../components/SystemIcon";
import conceptStyles from "../concepts/concepts.module.css";
import styles from "./work-with-me.module.css";

const freelanceSubject = encodeURIComponent("Freelance project enquiry");
const freelanceBody = encodeURIComponent(`Project / business:

What I need help with:

Existing design or website:

Expected deliverable:

Target date:`);
const projectEmail = `mailto:varunj93478@gmail.com?subject=${freelanceSubject}&body=${freelanceBody}`;

const servicePaths: { title: string; description: string; items: string[]; note?: string; cta: string; icon: SystemIconName }[] = [
  { title: "Quick Design Help", description: "For small, focused problems that need a clear design fix.", items: ["UX review", "Form or workflow fix", "Dashboard and table cleanup", "UI QA", "Figma cleanup", "Responsive and missing states"], cta: "Discuss a quick task", icon: "figma" },
  { title: "Websites & Digital Presence", description: "For stores, small businesses, professionals, consultants, and early-stage teams that need a clear website.", items: ["One-page business website", "3 to 5 page website", "Landing page", "Portfolio website", "Website redesign", "Mobile responsiveness fix"], note: "WordPress and simple contact or WhatsApp integrations can be included when they fit the project.", cta: "Discuss a website", icon: "monitor" },
  { title: "Product & UX Design", description: "For apps, SaaS products, dashboards, portals, and workflow-heavy products.", items: ["UX / product audit", "SaaS feature design", "Dashboard or admin portal", "Complex workflow design", "Role and permission flows", "Design system work"], note: "Larger MVP, redesign, and ongoing product design engagements can be scoped from here.", cta: "Discuss a product", icon: "work" },
];

const quickWork = [
  ["Quick UX Review", "Review one screen or a small flow and identify the main UX issues and recommended fixes."],
  ["Form / Workflow Fix", "Review field order, labels, validations, steps, errors, states, and edge cases."],
  ["Dashboard & Table Cleanup", "Review hierarchy, filters, actions, density, states, and responsive behaviour."],
  ["UI QA / Design-to-Dev Review", "Compare the implemented interface with the approved design and document visual or interaction gaps."],
  ["Figma / Design System Cleanup", "Improve component usage, spacing, typography, naming, states, and consistency."],
  ["Responsive & States Fix", "Define responsive behaviour and missing loading, empty, error, success, permission, and validation states."],
  ["Prototype Polish", "Clean up interactions and the clickable flow in an existing prototype."],
  ["Feature UX Second Opinion", "Review an existing feature idea or design before more development work begins."],
  ["UX Copy Cleanup", "Improve labels, helper text, validation messages, button names, and system messages."],
  ["Figma Handoff Cleanup", "Organize frames, components, annotations, states, and developer notes before handoff."],
] as const;

const relevantWork = [
  ["Harbinger", "Enterprise workflows, forms, dashboards, permissions, and role-based product design.", "/work/harbinger", "HBR"],
  ["InventFunds", "Website and platform work across responsive layouts and product flows.", "/work/inventfunds", "INV"],
  ["Aadivara", "Multi-role workflows, operational flows, and admin/product design.", "/work/aadivara", "AAD"],
] as const;

const projectSteps = [
  ["Send the problem", "Share the current screen, website, flow, requirement, or Figma link."],
  ["I review the scope", "I check what is needed, what already exists, and what should stay unchanged."],
  ["We agree on the work", "Scope, deliverables, timeline, and price are confirmed before starting."],
  ["Design and handoff", "I complete the agreed work and share the final design, review notes, or implementation-ready output."],
] as const;

export default function WorkWithMePage() {
  return (
    <main className={`${conceptStyles.previewPage} ${conceptStyles.studioPage} ${conceptStyles.caseWorkspacePage} ${styles.page}`}>
      <CaseFileHeader fileName="Work With Me"><span className={conceptStyles.caseViewActive}>Services</span></CaseFileHeader>
      <article className={styles.document}>
        <section className={styles.hero}>
          <div>
            <p>WORK WITH ME / UI/UX DESIGN</p>
            <h1>Work With Me</h1>
            <p className={styles.intro}>I take on focused design work as well as larger product projects. If you need help with a screen, workflow, website, dashboard, or SaaS product, send me the problem and I can help define the right scope.</p>
            <div className={styles.actions}><a href={projectEmail}>Start a project <SystemIcon name="arrow-right" size={15} /></a><Link href="#relevant-work">View my work <SystemIcon name="arrow-down" size={15} /></Link></div>
          </div>
          <aside aria-label="Service overview"><span>AVAILABLE PATHS</span><b>Quick design help</b><b>Websites & digital presence</b><b>Product & UX design</b><small>Scope, deliverables, timeline, and price are agreed before work starts.</small></aside>
        </section>

        <section className={styles.section} aria-labelledby="services-title">
          <header className={styles.sectionHeader}><div><h2 id="services-title">Choose the kind of help you need.</h2><p>Start with the closest path. The exact scope can be defined after I review the problem.</p></div></header>
          <div className={styles.services}>{servicePaths.map((service, index) => <article key={service.title}><header><SystemIcon name={service.icon} size={19} /><span>0{index + 1}</span></header><h3>{service.title}</h3><p>{service.description}</p><ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul>{service.note ? <small>{service.note}</small> : null}<a href={projectEmail}>{service.cta} <SystemIcon name="arrow-right" size={14} /></a></article>)}</div>
        </section>

        <section className={`${styles.section} ${styles.quickSection}`}><details><summary>More quick design help <SystemIcon name="chevron-down" size={17} /></summary><div>{quickWork.map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></details></section>

        <section className={styles.section} id="relevant-work" aria-labelledby="work-title">
          <header className={styles.sectionHeader}><div><h2 id="work-title">Relevant work</h2><p>Existing product case studies show how I approach different kinds of systems and design problems.</p></div></header>
          <div className={styles.projects}>{relevantWork.map(([title, description, href, code]) => <Link href={href} key={title}><header><span>{code}</span><SystemIcon name="file" size={17} /></header><h3>{title}</h3><p>{description}</p><b>View case study <SystemIcon name="arrow-right" size={14} /></b></Link>)}</div>
          <Link className={styles.allProjects} href="/">View all projects <SystemIcon name="arrow-right" size={14} /></Link>
        </section>

        <section className={`${styles.section} ${styles.processSection}`} aria-labelledby="process-title">
          <header className={styles.sectionHeader}><div><h2 id="process-title">How a project starts</h2><p>A short, practical path from the initial problem to an agreed design deliverable.</p></div></header>
          <ol className={styles.process}>{projectSteps.map(([title, description], index) => <li key={title}><span>{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}</ol>
        </section>

        <section className={styles.contact} aria-labelledby="contact-title">
          <div><span>START A PROJECT</span><h2 id="contact-title">Have something you need help with?</h2><p>Send me a short description of the work. A screenshot, Figma link, current website, or requirement is enough to start the conversation.</p></div>
          <ul><li>What do you need help with?</li><li>Is there an existing design or website?</li><li>What is the expected deliverable?</li><li>Is there a target date?</li></ul>
          <div className={styles.contactActions}><a href={projectEmail}>Start a project <SystemIcon name="arrow-right" size={15} /></a><a href="mailto:varunj93478@gmail.com">Hiring or full-time roles <SystemIcon name="external" size={15} /></a></div>
        </section>
      </article>
    </main>
  );
}
