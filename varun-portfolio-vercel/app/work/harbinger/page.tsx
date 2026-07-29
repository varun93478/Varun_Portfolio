"use client";
/* eslint-disable @next/next/no-img-element -- Product evidence must keep its original screenshot pixels. */

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { PortfolioLinks } from "../../concepts/PortfolioLinks";
import { WorkspaceTabs } from "../../concepts/WorkspaceTabs";
import styles from "../../concepts/concepts.module.css";
import { useActiveSection } from "../useActiveSection";

type CaseIconName = "arrow" | "check" | "data" | "file" | "folder" | "home" | "truck";

const sections = [
  ["overview", "Overview"],
  ["configuration", "Product configuration"],
  ["operations", "Vehicle operations"],
  ["pdi", "PDI checklist"],
  ["handoff", "Handoff and UI QA"],
  ["reflection", "Outcome and reflection"],
] as const;

const sectionIds = sections.map(([id]) => id);

const constraints = [
  "Existing approved workflows could not be changed without stakeholder agreement.",
  "Requirements were often clarified through calls while screens were already being designed.",
  "The interface had to reuse existing styles and avoid affecting other modules.",
  "Direct data synchronization between the two portals was not confirmed.",
];

function CaseIcon({ name }: { name: CaseIconName }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "arrow") return <svg {...props}><path d="M5 12h14M14 7l5 5-5 5" /></svg>;
  if (name === "check") return <svg {...props}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="m8 12 2.5 2.5L16 9" /></svg>;
  if (name === "data") return <svg {...props}><path d="M5 6c0-2 14-2 14 0s-14 2-14 0Z" /><path d="M5 6v6c0 2 14 2 14 0V6M5 12v6c0 2 14 2 14 0v-6" /></svg>;
  if (name === "file") return <svg {...props}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 12h6M9 16h6" /></svg>;
  if (name === "folder") return <svg {...props}><path d="M3 6h7l2 2h9v10H3z" /></svg>;
  if (name === "home") return <svg {...props}><path d="m4 11 8-7 8 7v9h-6v-6h-4v6H4z" /></svg>;
  return <svg {...props}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>;
}

type EvidenceItem = {
  src: string;
  alt: string;
  label: string;
};

function EvidenceFrame({
  title,
  note,
  images,
}: {
  title: string;
  note: string;
  images: EvidenceItem[];
}) {
  const layoutClass =
    images.length === 1
      ? styles.caseEvidenceSingle
      : images.length === 3
        ? styles.caseEvidenceFeatured
        : styles.caseEvidenceGrid;

  return (
    <figure className={styles.caseEvidence}>
      <header>
        <span>Product evidence</span>
        <b>{title}</b>
      </header>
      <div className={layoutClass}>
        {images.map((image) => (
          <a
            href={image.src}
            target="_blank"
            rel="noreferrer"
            aria-label={`${image.label}. Open full-size image in a new tab.`}
            key={image.src}
          >
            <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
            <span>{image.label}<small>Open full screen</small></span>
          </a>
        ))}
      </div>
      <figcaption>{note}</figcaption>
    </figure>
  );
}

export default function HarbingerCaseStudy() {
  const prefersReducedMotion = useReducedMotion();
  const { activeSection, selectSection } = useActiveSection(sectionIds, "overview");

  return (
    <main className={`${styles.previewPage} ${styles.studioPage} ${styles.caseWorkspacePage}`}>
      <header className={styles.studioToolbar}>
        <Link className={styles.studioBrand} href="/">Varun J</Link>
        <WorkspaceTabs />
        <div className={styles.caseToolbarActions}>
          <span className={styles.caseViewActive}>Case study</span>
          <Link href="/work/harbinger/documentation">UX documentation</Link>
          <PortfolioLinks />
        </div>
      </header>

      <nav className={styles.caseMobileSectionNav} aria-label="Harbinger case study sections">
        <label htmlFor="harbinger-section">Section</label>
        <select id="harbinger-section" value={activeSection} onChange={(event) => selectSection(event.target.value as (typeof sectionIds)[number])}>
          {sections.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </nav>

      <div className={`${styles.studioWorkspace} ${styles.caseWorkspace}`}>
        <aside className={styles.studioLeft} aria-label="Case study navigation">
          <nav className={styles.studioPrimaryNav}>
            <Link href="/"><CaseIcon name="home" /><span>Portfolio</span></Link>
          </nav>
          <div className={styles.studioProjectTree}>
            <p>Harbinger Motors</p>
            <a className={`${styles.caseViewBranch} ${styles.caseViewBranchActive}`} href="#overview">
              <CaseIcon name="file" /><span>Case study</span><b>⌄</b>
            </a>
            <div className={styles.caseSectionLinks}>
              {sections.map(([id, label], index) => (
                <a
                  className={activeSection === id ? styles.studioTreeActive : ""}
                  key={id}
                  href={`#${id}`}
                  aria-current={activeSection === id ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    selectSection(id);
                  }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>{label}
                </a>
              ))}
            </div>
            <Link className={styles.caseViewBranch} href="/work/harbinger/documentation">
              <CaseIcon name="folder" /><span>UX documentation</span><b>›</b>
            </Link>
            <p className={styles.casePortalLabel}>Product areas</p>
            <div className={styles.casePortalList}>
              <span><CaseIcon name="data" />HBR Portal</span>
              <span><CaseIcon name="truck" />Dealer Portal</span>
            </div>
          </div>
        </aside>

        <section className={styles.caseStudyCanvas} aria-label="Harbinger Motors case study" data-case-scroll>
          <article className={styles.caseStudyDocument}>
            <section className={styles.caseStudyHero} id="overview">
              <div className={styles.caseStudyKicker}><span>Harbinger Motors</span><b>Product case study</b></div>
              <h1>Designing across vehicle configuration, operations and dealer workflows.</h1>
              <p className={styles.caseStudyLead}>Harbinger is an enterprise product with two connected portals. The HBR Portal supports product and vehicle operations. The Dealer Portal supports dealer delivery, service, warranty and PDI workflows.</p>
              <dl className={styles.caseStudyMeta}>
                <div><dt>Role</dt><dd>Senior UI/UX Designer</dd></div>
                <div><dt>Scope</dt><dd>Product UX, UI and handoff</dd></div>
                <div><dt>Platform</dt><dd>Enterprise web application</dd></div>
                <div><dt>Timeline</dt><dd>2025 to 2026</dd></div>
              </dl>
              <div className={styles.caseSystemMap}>
                <div><span>HBR Portal</span><b>Configure products<br />Track vehicles</b></div>
                <i><CaseIcon name="arrow" /></i>
                <strong>Product and<br />vehicle data</strong>
                <i><CaseIcon name="arrow" /></i>
                <div><span>Dealer Portal</span><b>Transfer vehicles<br />Complete delivery</b></div>
              </div>
              <p className={styles.caseEvidenceDisclosure}>The product screens use representative information and remove confidential customer data.</p>
              <div className={styles.caseDocumentationCallout}>
                <div>
                  <span>Deeper system evidence</span>
                  <h2>See how the roles, rules, workflows and states connect.</h2>
                  <p>The case study is designed for a quick review. The UX documentation opens the product model, permission logic, information architecture, cross-role workflows, edge cases and delivery notes behind the screens.</p>
                </div>
                <Link href="/work/harbinger/documentation">Open UX documentation <CaseIcon name="arrow" /></Link>
              </div>
            </section>

            <section className={styles.caseStudySection}>
              <div className={styles.caseSectionHeading}>
                <span>01</span>
                <div><p>Context</p><h2>The work involved connected rules, roles and data.</h2></div>
              </div>
              <div className={styles.caseTwoColumns}>
                <p>A vehicle configuration affects pricing and downstream orders. A VIN connects factory progress, yard operations, dealer transfer and final delivery. Each status also changes who needs to act next.</p>
                <p>I initially worked mainly through high-fidelity screens. As the product grew, I documented the system more clearly so design and development decisions could be reviewed in context.</p>
              </div>
              <div className={styles.caseConstraintBlock}>
                <h3>Constraints</h3>
                <ul>{constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}</ul>
              </div>
            </section>

            <motion.section
              className={styles.caseStudySection}
              id="configuration"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
            >
              <div className={styles.caseSectionHeading}>
                <span>02</span>
                <div><p>Story one</p><h2>Product configuration to quotation</h2></div>
              </div>
              <p className={styles.caseSectionIntro}>Product configuration was a dependency system. Chassis, GVWR, wheelbase and battery selections had to stay within valid combinations before the configuration could support pricing and quotation work.</p>
              <div className={styles.caseDependencyFlow}>
                <div><span>01</span><b>Chassis</b><p>Harbinger Stripped Chassis</p></div>
                <i><CaseIcon name="arrow" /></i>
                <div><span>02</span><b>GVWR</b><p>16K, 19.5K, 22K or 26K</p></div>
                <i><CaseIcon name="arrow" /></i>
                <div><span>03</span><b>Wheelbase</b><p>Only valid sizes appear</p></div>
                <i><CaseIcon name="arrow" /></i>
                <div><span>04</span><b>Battery pack</b><p>Options depend on the setup</p></div>
              </div>
              <div className={styles.caseDecision}>
                <div><span>Decision</span><p>Reveal valid downstream choices after each selection and keep the configuration summary visible.</p></div>
                <div><span>Reason</span><p>This reduces invalid combinations and makes the relationship between selections easier to follow.</p></div>
                <div><span>Trade-off</span><p>The rules remain complex. Clear empty, unavailable and validation states are still required.</p></div>
              </div>
              <EvidenceFrame
                title="Product definition and Build Your Own"
                note="The configuration flow keeps dependency rules visible and shows how package selections affect downstream options."
                images={[
                  {
                    src: "/case-study-assets/configuration-fedex.png",
                    alt: "Build Your Own options screen showing FedEx package dependencies",
                    label: "FedEx package dependencies",
                  },
                ]}
              />
            </motion.section>

            <motion.section
              className={styles.caseStudySection}
              id="operations"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
            >
              <div className={styles.caseSectionHeading}>
                <span>03</span>
                <div><p>Story two</p><h2>VIN-based vehicle operations</h2></div>
              </div>
              <p className={styles.caseSectionIntro}>The VIN becomes the common reference after a vehicle is created. It connects factory progress, vehicle tracking, yard location and the delivery request raised by a dealer.</p>
              <div className={styles.caseOperationRail}>
                {[
                  ["Factory order", "Vehicle record begins"],
                  ["VIN assigned", "Vehicle becomes traceable"],
                  ["Yard and tracking", "Location and milestones"],
                  ["Dealer transfer", "Existing VIN is requested"],
                  ["PDI and delivery", "Vehicle is prepared for the customer"],
                ].map(([title, copy], index) => (
                  <div key={title}><span>{index + 1}</span><b>{title}</b><p>{copy}</p></div>
                ))}
              </div>
              <div className={styles.caseDecision}>
                <div><span>Decision</span><p>Keep status, completed stage and next action separate, with the responsible dealer made clear.</p></div>
                <div><span>Reason</span><p>These signals answer different operational questions and should not be compressed into one unclear status.</p></div>
                <div><span>Constraint</span><p>New Delivery must use an existing vehicle or VIN. It does not create a new vehicle.</p></div>
              </div>
              <div className={styles.caseServiceExtension}>
                <span>After-sales extension</span>
                <h3>Service Center continues the same vehicle record.</h3>
                <p>After delivery, the VIN connects service history, Repair Orders, warranty coverage and claim review. Service Centers can create warranty and non-warranty Repair Orders. Covered parts can move into a claim that Harbinger Admin approves or rejects with a decision reason.</p>
              </div>
              <EvidenceFrame
                title="Vehicle transfer, delivery and warranty claims"
                note="The Requesting Dealer owns arrival, inspection, PDI, warranty registration and retail delivery after the vehicle reaches them."
                images={[
                  {
                    src: "/case-study-assets/delivery-requests.jpg",
                    alt: "New Delivery requests list with statuses and next actions",
                    label: "New Delivery requests",
                  },
                  {
                    src: "/case-study-assets/delivery-timeline.jpg",
                    alt: "Delivery request details showing progress timeline",
                    label: "Delivery status and timeline",
                  },
                  {
                    src: "/case-study-assets/warranty-claims.png",
                    alt: "Service Center warranty claim requests table",
                    label: "Warranty claim review",
                  },
                ]}
              />
            </motion.section>

            <motion.section
              className={styles.caseStudySection}
              id="pdi"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
            >
              <div className={styles.caseSectionHeading}>
                <span>04</span>
                <div><p>Story three</p><h2>JSON-driven PDI checklist</h2></div>
              </div>
              <p className={styles.caseSectionIntro}>The client frequently changed checklist fields, labels, validations, required states, options and order. Updating hardcoded forms created repeated design and development work.</p>
              <div className={styles.caseJsonPanel}>
                <div>
                  <span>Configuration can define</span>
                  <ul><li>Label and field type</li><li>Required state</li><li>Validation rules</li><li>Options and order</li><li>Conditional visibility</li></ul>
                </div>
                <i><CaseIcon name="arrow" /></i>
                <div>
                  <span>Checklist behaviour</span>
                  <ul><li>Step-based inspection groups</li><li>Pass or fail states</li><li>Comments for failed items</li><li>Draft and completion states</li><li>Final review before submission</li></ul>
                </div>
              </div>
              <div className={styles.caseDecision}>
                <div><span>Decision</span><p>Move the reusable form structure into JSON and organize the PDI checklist into clear steps.</p></div>
                <div><span>Value</span><p>Field changes became easier to manage and the same implementation pattern could support multiple forms.</p></div>
                <div><span>Current limit</span><p>The portfolio does not claim measured time savings or full production API integration.</p></div>
              </div>
              <EvidenceFrame
                title="PDI checklist steps and configured states"
                note="The checklist supports failed submission, dealer reopening and a final review. Warranty registration requires a Passed PDI."
                images={[
                  {
                    src: "/case-study-assets/pdi-failed-item.png",
                    alt: "PDI checklist failed item with comment and configured media upload",
                    label: "Failed item and evidence",
                  },
                  {
                    src: "/case-study-assets/pdi-final-review.png",
                    alt: "PDI checklist final review and dealer sign-off",
                    label: "Final review and sign-off",
                  },
                  {
                    src: "/case-study-assets/pdi-passed.png",
                    alt: "Completed PDI details showing a Passed result",
                    label: "Completed PDI details",
                  },
                ]}
              />
            </motion.section>

            <section className={styles.caseStudySection} id="handoff">
              <div className={styles.caseSectionHeading}>
                <span>05</span>
                <div><p>Handoff and UI QA</p><h2>I built the interface with representative JSON, then handed it to the core team for integration.</h2></div>
              </div>
              <p className={styles.caseSectionIntro}>My implementation scope covered the UI. I reviewed the deployed screens, checked layout and interaction states, and shared corrections with developers without claiming ownership of backend integration.</p>
              <div className={styles.caseHandoffFlow}>
                <article><span>01</span><h3>UI implementation</h3><p>Built the screens with representative JSON data and reused existing portal styles.</p></article>
                <article><span>02</span><h3>Developer handoff</h3><p>Shared field behaviour, validation, status, role and edge-case expectations with the core team.</p></article>
                <article><span>03</span><h3>Deployed UI review</h3><p>Reviewed the shared environment and reported UI corrections. One real fix was using the VIN available in table data instead of treating it as an unrelated manual value.</p></article>
              </div>
            </section>

            <section className={`${styles.caseStudySection} ${styles.caseReflection}`} id="reflection">
              <div className={styles.caseSectionHeading}>
                <span>06</span>
                <div><p>Outcome and reflection</p><h2>The strongest improvement was clearer product thinking.</h2></div>
              </div>
              <div className={styles.caseOutcomeGrid}>
                <article><span>Shipped work</span><p>Vehicle Transfer and Service Center UI reached the shared test environment.</p></article>
                <article><span>System decision</span><p>JSON-driven forms made changing labels, validations, required states, options and ordering easier to manage.</p></article>
                <article><span>My growth</span><p>I moved from treating requirements as screens to documenting roles, rules, data and handoffs.</p></article>
              </div>
              <p className={styles.caseOutcomeNote}>Formal usability testing and measured business impact were not available. The case study separates shipped UI evidence from expected product benefits.</p>
              <blockquote>I would document the product model, states and ownership earlier. That would make design reviews and developer handoff clearer before high-fidelity work begins.</blockquote>
              <Link className={styles.caseBackAction} href="/">Return to portfolio <CaseIcon name="arrow" /></Link>
            </section>
          </article>
        </section>

      </div>

      <footer className={styles.studioStatusbar}>
        <span><i /> Case study document</span>
        <span>Harbinger Motors</span>
        <span>6 sections + documentation</span>
        <Link href="/">Return to portfolio</Link>
      </footer>
    </main>
  );
}
