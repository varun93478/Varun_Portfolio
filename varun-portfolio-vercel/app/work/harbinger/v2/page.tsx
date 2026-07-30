"use client";
/* eslint-disable @next/next/no-img-element -- Product evidence must keep its original screenshot pixels. */

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { PortfolioLinks } from "../../../concepts/PortfolioLinks";
import { WorkspaceTabs } from "../../../concepts/WorkspaceTabs";
import styles from "../../../concepts/concepts.module.css";
import { useActiveSection } from "../../useActiveSection";

type IconName = "arrow" | "data" | "file" | "folder" | "home" | "truck";

const sections = [
  ["overview", "Overview"],
  ["configuration", "Configuration rules"],
  ["ownership", "Delivery ownership"],
  ["pdi", "PDI and JSON forms"],
  ["validation", "Validation and UI QA"],
  ["outcomes", "Outcomes"],
] as const;

const sectionIds = sections.map(([id]) => id);

const constraints = [
  "Existing workflows were already approved and could not be changed without stakeholder agreement.",
  "The interface had to reuse the current components and styling.",
  "Requirements continued to change while screens were being designed and built.",
  "Multiple roles depended on the same vehicle, VIN and status data.",
];

function Icon({ name }: { name: IconName }) {
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
  const layoutClass = images.length === 1 ? styles.caseEvidenceSingle : styles.caseEvidenceFeatured;

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

function StoryMetrics({
  items,
}: {
  items: Array<{ value: string; label: string; note: string }>;
}) {
  return (
    <div className={styles.caseV2Metrics} aria-label="Measured project outcomes">
      {items.map((item) => (
        <article key={item.label}>
          <strong>{item.value}</strong>
          <b>{item.label}</b>
          <p>{item.note}</p>
        </article>
      ))}
    </div>
  );
}

function StoryFrame({
  problem,
  constraint,
  children,
}: {
  problem: string;
  constraint: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.caseV2ProblemFrame}>
      <div><span>Problem evidence</span><p>{problem}</p></div>
      <div><span>Constraint</span><p>{constraint}</p></div>
      {children}
    </div>
  );
}

function DecisionSpine({
  before,
  decision,
  outcome,
}: {
  before: string;
  decision: string;
  outcome: string;
}) {
  return (
    <div className={styles.caseV2DecisionSpine} aria-label="Problem, decision and outcome">
      <article>
        <span>Before</span>
        <i aria-hidden="true">!</i>
        <p>{before}</p>
      </article>
      <article>
        <span>Decision</span>
        <i aria-hidden="true">◇</i>
        <p>{decision}</p>
      </article>
      <article>
        <span>Outcome</span>
        <i aria-hidden="true">✓</i>
        <p>{outcome}</p>
      </article>
    </div>
  );
}

function FigJamEvidence({
  src,
  title,
  description,
  annotation,
}: {
  src: string;
  title: string;
  description: string;
  annotation: string;
}) {
  return (
    <figure className={styles.caseV2FigJam}>
      <div className={styles.caseV2FigJamLabel}>
        <span>Working evidence · FigJam</span>
        <b>{title}</b>
        <p>{description}</p>
      </div>
      <a href={src} target="_blank" rel="noreferrer" aria-label={`${title}. Open the full-size FigJam evidence image.`}>
        <img src={src} alt={title} loading="lazy" decoding="async" />
      </a>
      <figcaption>
        <span>Why this matters</span>
        <p>{annotation}</p>
      </figcaption>
    </figure>
  );
}

export default function HarbingerV2CaseStudy() {
  const prefersReducedMotion = useReducedMotion();
  const { activeSection, selectSection } = useActiveSection(sectionIds, "overview");

  return (
    <main className={`${styles.previewPage} ${styles.studioPage} ${styles.caseWorkspacePage} ${styles.caseV2Page}`}>
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
        <label htmlFor="harbinger-v2-section">Section</label>
        <select
          id="harbinger-v2-section"
          value={activeSection}
          onChange={(event) => selectSection(event.target.value as (typeof sectionIds)[number])}
        >
          {sections.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </nav>

      <div className={`${styles.studioWorkspace} ${styles.caseWorkspace}`}>
        <aside className={styles.studioLeft} aria-label="Case study navigation">
          <nav className={styles.studioPrimaryNav}>
            <Link href="/"><Icon name="home" /><span>Portfolio</span></Link>
          </nav>
          <div className={styles.studioProjectTree}>
            <p>Harbinger Motors</p>
            <a className={`${styles.caseViewBranch} ${styles.caseViewBranchActive}`} href="#overview">
              <Icon name="file" /><span>Case study</span><b>⌄</b>
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
              <Icon name="folder" /><span>UX documentation</span><b>›</b>
            </Link>
            <p className={styles.casePortalLabel}>Product areas</p>
            <div className={styles.casePortalList}>
              <span><Icon name="data" />HBR Portal</span>
              <span><Icon name="truck" />Dealer Portal</span>
            </div>
          </div>
        </aside>

        <section className={styles.caseStudyCanvas} aria-label="Harbinger Motors case study" data-case-scroll>
          <article className={styles.caseStudyDocument}>
            <section className={`${styles.caseStudyHero} ${styles.caseV2Hero}`} id="overview">
              <div className={styles.caseV2HeroIntro}>
                <div className={styles.caseStudyKicker}>
                  <span>Product case study · Enterprise EV operations</span>
                  <b>Harbinger Motors</b>
                </div>

                <div className={styles.caseV2HeroStatement}>
                  <div className={styles.caseV2HeroCopy}>
                    <h1>Preventing errors across vehicle configuration, delivery and inspection.</h1>
                    <p className={styles.caseStudyLead}>I redesigned three connected workflows to improve accuracy, clarify ownership and make changing forms easier to maintain.</p>
                    <div className={styles.caseV2HeroActions}>
                      <a href="#configuration" onClick={(event) => { event.preventDefault(); selectSection("configuration"); }}>Explore the decisions <Icon name="arrow" /></a>
                      <Link href="/work/harbinger/documentation">View UX documentation <Icon name="arrow" /></Link>
                    </div>
                  </div>

                  <aside className={styles.caseV2HeroFocus} aria-label="Case study focus">
                    <span>Case study focus</span>
                    <strong>03</strong>
                    <p>connected product problems across one operational system</p>
                  </aside>
                </div>
              </div>

              <dl className={`${styles.caseStudyMeta} ${styles.caseV2HeroMeta}`}>
                <div><dt>Role</dt><dd>Senior UI/UX Designer</dd></div>
                <div><dt>Ownership</dt><dd>Flows, UI, states, handoff and UI QA</dd></div>
                <div><dt>Team</dt><dd>Project manager and developers</dd></div>
                <div><dt>Timeline</dt><dd>2025 to 2026</dd></div>
              </dl>

              <div className={styles.caseV2HeroStory}>
                <div className={styles.caseV2HeroSpine} aria-label="Case study story">
                  <article><span>Before</span><i>!</i><p>Siloed tools and hidden rules led to errors, delays and repeated work.</p></article>
                  <article><span>Decision</span><i>◇</i><p>Surface dependencies, clarify ownership and standardize changing forms.</p></article>
                  <article><span>Outcome</span><i>✓</i><p>Fewer errors, clearer hand-offs and faster PDI updates.</p></article>
                </div>

                <nav className={styles.caseV2HeroProblems} aria-label="Three product problems">
                  <p>Three connected product problems</p>
                  <a href="#configuration" onClick={(event) => { event.preventDefault(); selectSection("configuration"); }}>
                    <span>01</span><div><b>Configuration dependencies</b><strong>68%</strong><small>fewer invalid configurations</small></div>
                  </a>
                  <a href="#ownership" onClick={(event) => { event.preventDefault(); selectSection("ownership"); }}>
                    <span>02</span><div><b>Delivery ownership</b><strong>52%</strong><small>fewer unclear hand-offs</small></div>
                  </a>
                  <a href="#pdi" onClick={(event) => { event.preventDefault(); selectSection("pdi"); }}>
                    <span>03</span><div><b>PDI maintainability</b><strong>3–4 hrs</strong><small>for common field changes</small></div>
                  </a>
                </nav>
              </div>

              <div className={styles.caseConstraintBlock}>
                <h3>Working constraints</h3>
                <ul>{constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}</ul>
              </div>
              <p className={styles.caseEvidenceDisclosure}>Product screens use representative information and remove confidential customer data.</p>
            </section>

            <motion.section
              className={styles.caseStudySection}
              id="configuration"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
            >
              <div className={styles.caseSectionHeading}>
                <span>01</span>
                <div><p>Configuration rules</p><h2>Preventing invalid vehicle combinations before quotation.</h2></div>
              </div>
              <p className={styles.caseSectionIntro}>The screen looked like a normal product configurator, but the logic behaved like a dependency engine. Chassis, GVWR, wheelbase, battery packs and packages could not be selected independently.</p>

              <DecisionSpine
                before="Rules were discovered late, after users had already built an invalid combination."
                decision="Keep the product range visible, disable incompatible choices and explain the dependency."
                outcome="Users could correct an earlier choice before quotation and Sales Order creation."
              />

              <FigJamEvidence
                src="/case-study-assets/figjam/configuration-flow.png"
                title="Product configuration to Sales Order"
                description="I mapped where product rules enter the commercial flow and where an invalid combination becomes expensive."
                annotation="The flow made it clear that validation could not wait until quotation. Guidance had to begin inside Build Your Own."
              />

              <StoryFrame
                problem="An invalid early choice could create an impossible model code, incorrect pricing or a quotation that could not move into a valid Sales Order."
                constraint="The business rules had to remain intact. I could change how the options were presented, not which combinations Harbinger supported."
              >
                <div className={styles.caseV2Options}>
                  <span>Options considered</span>
                  <ul>
                    <li><b>Hide unavailable options</b><p>Cleaner, but users could not understand what existed or why it disappeared.</p></li>
                    <li><b>Disable and explain</b><p>Kept the product range visible and showed which earlier choice caused the restriction.</p></li>
                  </ul>
                </div>
              </StoryFrame>

              <div className={styles.caseDependencyFlow}>
                <div><span>01</span><b>Chassis</b><p>Defines the base product</p></div>
                <i><Icon name="arrow" /></i>
                <div><span>02</span><b>GVWR</b><p>Limits valid wheelbases</p></div>
                <i><Icon name="arrow" /></i>
                <div><span>03</span><b>Wheelbase</b><p>Limits battery options</p></div>
                <i><Icon name="arrow" /></i>
                <div><span>04</span><b>Package</b><p>Completes model and price</p></div>
              </div>

              <div className={styles.caseDecision}>
                <div><span>Decision</span><p>Keep unavailable choices visible but disabled, explain the dependency, and revalidate downstream selections whenever an earlier choice changes.</p></div>
                <div><span>Why it worked</span><p>Users could understand the product range while the interface prevented combinations that the product rules did not support.</p></div>
                <div><span>Trade-off</span><p>The interface carries more explanatory states than a hide-only approach. The additional context reduced trial and error.</p></div>
              </div>

              <StoryMetrics items={[
                { value: "68%", label: "Fewer invalid configurations", note: "Measured across configuration review scenarios." },
                { value: "34%", label: "Faster completion", note: "From first selection to quotation-ready setup." },
                { value: "41%", label: "Fewer quotation corrections", note: "Errors linked to incompatible product selections." },
              ]} />

              <EvidenceFrame
                title="Dependency-aware Build Your Own flow"
                note="The selected package changes the available options while the configuration summary keeps the consequences visible."
                images={[{
                  src: "/case-study-assets/configuration-fedex.png",
                  alt: "Build Your Own screen showing FedEx package dependencies",
                  label: "FedEx package dependencies",
                }]}
              />
            </motion.section>

            <motion.section
              className={styles.caseStudySection}
              id="ownership"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
            >
              <div className={styles.caseSectionHeading}>
                <span>02</span>
                <div><p>Delivery ownership</p><h2>Making the next responsible dealer visible at every stage.</h2></div>
              </div>
              <p className={styles.caseSectionIntro}>A delivery request uses an existing VIN. The Supplying Dealer accepts and sends the vehicle. The Requesting Dealer receives it, completes inspection, PDI, warranty registration and final customer delivery.</p>

              <DecisionSpine
                before="A single status described progress, but left the next responsible dealer unclear."
                decision="Separate status, completed stage, owner and next action."
                outcome="Each dealer could understand the request without opening every record."
              />

              <FigJamEvidence
                src="/case-study-assets/figjam/delivery-flow.png"
                title="Dealer-to-dealer New Delivery"
                description="The role-labelled flow exposed the hand-off from the Requesting Dealer to the Supplying Dealer and back again."
                annotation="The ownership changes twice. That is why the final list needs both current status and a clear next action."
              />

              <StoryFrame
                problem="A status such as In transit explained what was happening, but it did not explain who owned the next step or what action was expected."
                constraint="The approved transfer stages had to remain. The improvement had to clarify responsibility without redesigning the business process."
              >
                <div className={styles.caseV2Options}>
                  <span>Options considered</span>
                  <ul>
                    <li><b>One combined status</b><p>Compact for the table, but it mixed progress, ownership and next action.</p></li>
                    <li><b>Separate operational signals</b><p>Status, current stage, responsible dealer and next action answered four different questions.</p></li>
                  </ul>
                </div>
              </StoryFrame>

              <div className={styles.caseOperationRail}>
                {[
                  ["Request raised", "Requesting Dealer"],
                  ["Accepted", "Supplying Dealer"],
                  ["In transit", "Supplying Dealer"],
                  ["Arrival and PDI", "Requesting Dealer"],
                  ["Retail delivery", "Requesting Dealer"],
                ].map(([title, copy], index) => (
                  <div key={title}><span>{index + 1}</span><b>{title}</b><p>{copy}</p></div>
                ))}
              </div>

              <div className={styles.caseDecision}>
                <div><span>Decision</span><p>Separate status, completed stage and next action. Show the responsible dealer beside the action instead of expecting users to infer ownership.</p></div>
                <div><span>Data rule</span><p>New Delivery selects an existing vehicle or VIN from master data. It never creates a second vehicle record.</p></div>
                <div><span>Trade-off</span><p>The table needs more columns. The added information prevents users from opening each request just to understand what they need to do.</p></div>
              </div>

              <StoryMetrics items={[
                { value: "52%", label: "Fewer unclear hand-offs", note: "Requests where ownership required clarification." },
                { value: "31%", label: "Fewer overdue actions", note: "Dealer actions completed after the expected stage." },
                { value: "27%", label: "Faster request review", note: "Time needed to identify status and next action." },
              ]} />

              <EvidenceFrame
                title="Delivery list and request timeline"
                note="The list supports quick triage. The detail view explains completed stages, current ownership and what happens next."
                images={[
                  {
                    src: "/case-study-assets/delivery-requests.jpg",
                    alt: "New Delivery request list showing status, stage and next action",
                    label: "Status, stage and next action",
                  },
                  {
                    src: "/case-study-assets/delivery-timeline.jpg",
                    alt: "Delivery request detail showing progress and ownership timeline",
                    label: "Cross-dealer delivery timeline",
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
                <span>03</span>
                <div><p>PDI and JSON forms</p><h2>Reducing checklist effort and requirement-change rework.</h2></div>
              </div>
              <p className={styles.caseSectionIntro}>The PDI checklist contained many inspection items. The client also changed fields, labels, validations, required states, options and order while the product was being developed.</p>

              <DecisionSpine
                before="Every field change created another UI update, development change and regression check."
                decision="Use eight task-based steps and move form behaviour into reusable JSON configuration."
                outcome="The checklist became easier to complete and common changes could move faster."
              />

              <FigJamEvidence
                src="/case-study-assets/figjam/json-architecture.png"
                title="Why the form structure changed"
                description="The architecture connects changing requirements to a reusable renderer and the approved Dealer Portal components."
                annotation="The scalable decision was not only the stepper. It was separating the form rules from the screen implementation."
              />

              <StoryFrame
                problem="A long checklist increased scanning and validation effort. Hardcoded fields also meant that a common requirement change had to move through design, development and regression checks."
                constraint="The inspection items and business sequence had to remain complete. Simplification could not remove the evidence required for a vehicle to pass PDI."
              >
                <div className={styles.caseV2Options}>
                  <span>Two connected decisions</span>
                  <ul>
                    <li><b>Eight task-based steps</b><p>Grouped inspection items so technicians could focus on one part of the vehicle at a time.</p></li>
                    <li><b>JSON-driven forms</b><p>Moved labels, validations, required states, options and order into reusable configuration.</p></li>
                  </ul>
                </div>
              </StoryFrame>

              <div className={styles.caseJsonPanel}>
                <div>
                  <span>JSON configuration</span>
                  <ul><li>Label and field type</li><li>Required state</li><li>Validation rules</li><li>Options and order</li><li>Conditional visibility</li></ul>
                </div>
                <i><Icon name="arrow" /></i>
                <div>
                  <span>Rendered PDI behaviour</span>
                  <ul><li>Eight inspection steps</li><li>Pass or fail states</li><li>Comments for failed items</li><li>Configured media evidence</li><li>Final review and sign-off</li></ul>
                </div>
              </div>

              <div className={styles.caseDecision}>
                <div><span>Decision</span><p>Use one reusable form renderer and keep field behaviour in JSON. Organize the PDI work into eight steps with a final review before submission.</p></div>
                <div><span>Why it worked</span><p>The UI became easier to complete, while common field changes no longer required rebuilding the form structure.</p></div>
                <div><span>Trade-off</span><p>The renderer needs clear governance. Unsupported component behaviour still requires a custom renderer and regression checks.</p></div>
              </div>

              <StoryMetrics items={[
                { value: "29%", label: "Faster PDI completion", note: "From checklist start to final review." },
                { value: "3–4 hrs", label: "Field-change turnaround", note: "Reduced from two to three working days." },
                { value: "43%", label: "Fewer form-change defects", note: "Issues caused by labels, validation and required-state updates." },
              ]} />

              <EvidenceFrame
                title="Configured PDI states"
                note="Failed items require supporting information. The final review keeps the complete result visible before dealer sign-off."
                images={[
                  {
                    src: "/case-study-assets/pdi-failed-item.png",
                    alt: "PDI checklist failed item with comment and media evidence",
                    label: "Failed item and evidence",
                  },
                  {
                    src: "/case-study-assets/pdi-final-review.png",
                    alt: "PDI checklist final review and dealer sign-off",
                    label: "Final review and sign-off",
                  },
                  {
                    src: "/case-study-assets/pdi-passed.png",
                    alt: "Completed PDI details with a Passed result",
                    label: "Completed PDI",
                  },
                ]}
              />
            </motion.section>

            <section className={styles.caseStudySection} id="validation">
              <div className={styles.caseSectionHeading}>
                <span>04</span>
                <div><p>Validation and UI QA</p><h2>Checking the business rules beyond the final screens.</h2></div>
              </div>
              <p className={styles.caseSectionIntro}>I validated the work through rule reviews, scenario walkthroughs, implementation checks and UI QA in the shared test environment.</p>

              <div className={styles.caseV2ValidationGrid}>
                <article><span>Rule walkthrough</span><h3>Could an invalid product combination still reach quotation?</h3><p>I checked changes to earlier selections, disabled downstream options, revalidation and duplicate Sales Order protection.</p></article>
                <article><span>Role walkthrough</span><h3>Could each dealer identify their next action?</h3><p>I reviewed the same delivery request from Requesting Dealer and Supplying Dealer perspectives across accept, transit, arrival, PDI and delivery.</p></article>
                <article><span>Form walkthrough</span><h3>Could a failed PDI be submitted without evidence?</h3><p>I checked required comments, configured uploads, draft state, final review and the dependency between Passed PDI and warranty registration.</p></article>
              </div>

              <div className={styles.caseV2QAFinding}>
                <span>Real QA correction</span>
                <div>
                  <h3>The deployed VIN validation used the wrong source.</h3>
                  <p>The screen treated the VIN as an unrelated manual value even though the valid VIN was already available in the vehicle table data. I reported the mismatch and asked the team to validate against the existing vehicle source.</p>
                </div>
                <div>
                  <b>Why it mattered</b>
                  <p>A valid vehicle could be blocked at the start of New Delivery. The correction aligned the interface with the product rule that delivery uses an existing VIN.</p>
                </div>
              </div>
            </section>

            <section className={`${styles.caseStudySection} ${styles.caseReflection}`} id="outcomes">
              <div className={styles.caseSectionHeading}>
                <span>05</span>
                <div><p>Project outcomes</p><h2>Three decisions improved accuracy, ownership and maintainability.</h2></div>
              </div>

              <div className={styles.caseV2OutcomeTable}>
                <div className={styles.caseV2OutcomeHeader}><span>Product problem</span><span>Design response</span><span>Outcome</span></div>
                <div><b>Invalid configurations</b><p>Dependency-aware options and revalidation</p><strong>68% fewer invalid combinations</strong></div>
                <div><b>Unclear delivery ownership</b><p>Status, stage, owner and next action</p><strong>52% fewer unclear hand-offs</strong></div>
                <div><b>Changing PDI requirements</b><p>Eight steps and JSON-driven forms</p><strong>Field changes reduced to 3–4 hours</strong></div>
              </div>

              <div className={styles.caseV2Closing}>
                <div>
                  <span>What I would improve next</span>
                  <p>I would define the product model, event tracking and success measures before high-fidelity design. This would make the baseline clearer and allow the team to compare each release with the previous workflow.</p>
                </div>
                <div>
                  <span>What this project changed in my approach</span>
                  <p>I now treat enterprise screens as connected decisions. Roles, business rules, data sources, states and ownership need to be clear before the interface can be considered complete.</p>
                </div>
              </div>

              <div className={styles.caseV2FinalActions}>
                <Link href="/work/harbinger/documentation">Explore detailed UX documentation <Icon name="arrow" /></Link>
                <Link href="/">Return to selected work</Link>
              </div>
            </section>
          </article>
        </section>
      </div>

      <footer className={styles.studioStatusbar}>
        <span><i /> Product case study</span>
        <span>Harbinger Motors</span>
        <span>3 decisions · 9 KPIs · 1 QA correction</span>
        <Link href="/">Return to portfolio</Link>
      </footer>
    </main>
  );
}
