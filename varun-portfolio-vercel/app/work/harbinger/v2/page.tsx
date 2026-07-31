"use client";
/* eslint-disable @next/next/no-img-element -- Product evidence must keep its original screenshot pixels. */

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PortfolioLinks } from "../../../concepts/PortfolioLinks";
import styles from "../../../concepts/concepts.module.css";
import {
  AnnotatedScreen,
  ArtifactDisclosure,
  CaseStorySpine,
  ChapterResolution,
  FlowComparison,
  InformationArchitecture,
  StateCoverageMatrix,
  WireframeStrip,
} from "../../case-study-story";
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
  const [zoom, setZoom] = useState(100);
  const [leftMode, setLeftMode] = useState<"chapters" | "layers">("chapters");
  const [presenting, setPresenting] = useState(false);
  const canvasRef = useRef<HTMLElement>(null);
  const documentRef = useRef<HTMLElement>(null);

  const changeZoom = (value: number) => setZoom(Math.max(50, Math.min(150, value)));
  const fitArtboard = () => {
    const canvas = canvasRef.current;
    const document = documentRef.current;
    if (!canvas || !document) return;
    changeZoom(Math.floor(((canvas.clientWidth - 48) / document.offsetWidth) * 100));
  };

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setZoom((value) => Math.min(150, value + 10));
      } else if (event.key === "-") {
        event.preventDefault();
        setZoom((value) => Math.max(50, value - 10));
      } else if (event.key === "0") {
        event.preventDefault();
        setZoom(100);
      } else if (event.key.toLowerCase() === "p" && !presenting) {
        event.preventDefault();
        setPresenting(true);
      } else if (event.key === "Escape" && presenting) {
        setPresenting(false);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [presenting]);

  return (
    <main className={`${styles.previewPage} ${styles.studioPage} ${styles.caseWorkspacePage} ${styles.caseV2Page} ${presenting ? styles.studioPresentation : ""}`}>
      <a className={styles.caseSkipLink} href="#case-canvas">Skip to case study</a>
      <header className={styles.studioToolbar}>
        <Link className={styles.studioBrand} href="/">Varun J</Link>
        <nav className={styles.caseFileBreadcrumb} aria-label="File location">
          <Link href="/">Desktop</Link>
          <span aria-hidden="true">/</span>
          <strong>Harbinger.fig</strong>
        </nav>
        <div className={styles.caseToolbarActions}>
          <div className={styles.caseZoomControls} aria-label="Canvas zoom controls">
            <button type="button" onClick={() => changeZoom(zoom - 10)} disabled={zoom === 50} aria-label="Zoom out">−</button>
            <button type="button" className={styles.caseZoomValue} onClick={fitArtboard} aria-label={`Canvas zoom ${zoom} percent. Fit artboard`}>{zoom}%</button>
            <button type="button" onClick={() => changeZoom(zoom + 10)} disabled={zoom === 150} aria-label="Zoom in">+</button>
          </div>
          <button className={styles.caseToolbarPresent} type="button" onClick={() => setPresenting(true)}>Present <kbd>P</kbd></button>
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
          <div className={styles.casePanelTabs} role="tablist" aria-label="Navigation panel">
            <button type="button" role="tab" aria-selected={leftMode === "chapters"} onClick={() => setLeftMode("chapters")}>Chapters</button>
            <button type="button" role="tab" aria-selected={leftMode === "layers"} onClick={() => setLeftMode("layers")}>Layers</button>
          </div>
          <nav className={styles.studioPrimaryNav}>
            <Link href="/"><Icon name="home" /><span>Desktop</span></Link>
          </nav>
          <div className={styles.studioProjectTree}>
            <p>Harbinger Motors</p>
            <a className={`${styles.caseViewBranch} ${styles.caseViewBranchActive}`} href="#overview">
              <Icon name="file" /><span>Case study</span><b>⌄</b>
            </a>
            <div className={`${styles.caseSectionLinks} ${leftMode === "layers" ? styles.casePanelHidden : ""}`}>
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
            <div className={`${styles.caseLayerTree} ${leftMode === "chapters" ? styles.casePanelHidden : ""}`} aria-label="Case study layers">
              <span><i />Hero investigation</span>
              <span><i />Story spine</span>
              <span><i />Configuration flow</span>
              <span><i />Delivery ownership</span>
              <span><i />PDI state system</span>
              <span><i />Validation boundary</span>
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

        <section className={styles.caseStudyCanvas} id="case-canvas" ref={canvasRef} tabIndex={-1} aria-label="Harbinger Motors case study canvas" data-case-scroll>
          <article className={styles.caseStudyDocument} ref={documentRef} style={{ zoom: zoom / 100 }}>
            <section className={`${styles.caseStudyHero} ${styles.caseV2Hero}`} id="overview">
              <div className={styles.caseV2HeroIntro}>
                <div className={styles.caseStudyKicker}>
                  <span>Product case study · Enterprise EV operations</span>
                  <b>Harbinger Motors</b>
                </div>

                <div className={styles.caseV2HeroStatement}>
                  <div className={styles.caseV2HeroCopy}>
                    <p className={styles.caseV2Hook}>One vehicle · Three connected workflows · Hidden operational risk</p>
                    <h1>The interface looked simple. The system underneath was not.</h1>
                    <p className={styles.caseStudyLead}>A configuration choice could invalidate a quotation. A delivery status could hide who acted next. A field change could trigger another UI rebuild. I redesigned the system so those dependencies became visible before they became operational problems.</p>
                    <div className={styles.caseV2HeroActions}>
                      <a href="#configuration" onClick={(event) => { event.preventDefault(); selectSection("configuration"); }}>Explore the decisions <Icon name="arrow" /></a>
                      <Link href="/work/harbinger/documentation">View UX documentation <Icon name="arrow" /></Link>
                    </div>
                  </div>

                  <aside className={styles.caseV2HeroFocus} aria-label="Case study focus">
                    <span>Investigation structure</span>
                    <strong>05</strong>
                    <p>stages from problem evidence to an honest validation boundary</p>
                  </aside>
                </div>
              </div>

              <dl className={`${styles.caseStudyMeta} ${styles.caseV2HeroMeta}`}>
                <div><dt>Role</dt><dd>Senior UI/UX Designer</dd></div>
                <div><dt>Ownership</dt><dd>Flows, UI, states, handoff and UI QA</dd></div>
                <div><dt>Team</dt><dd>Project manager and developers</dd></div>
                <div><dt>Timeline</dt><dd>2025 to 2026</dd></div>
              </dl>

              <CaseStorySpine stages={[
                { label: "Problem", description: "Find where operational understanding breaks." },
                { label: "Evidence", description: "Map roles, rules, data and failure states." },
                { label: "Decision", description: "Compare options and choose the clearest model." },
                { label: "Solution", description: "Turn the model into visible interface behavior." },
                { label: "Outcome", description: "Document what improved and what still needs proof." },
              ]} />

              <div className={styles.caseV2HeroStory}>
                <div className={styles.caseV2HeroSpine} aria-label="Case study story">
                  <article><span>What failed</span><i>!</i><p>Rules, ownership and changing requirements were hidden behind otherwise familiar screens.</p></article>
                  <article><span>What changed</span><i>◇</i><p>Dependencies became guidance, hand-offs became explicit and form rules moved into configuration.</p></article>
                  <article><span>What is defensible</span><i>✓</i><p>The delivered design covers the critical logic and states. Formal outcome measurement remains future work.</p></article>
                </div>

                <nav className={styles.caseV2HeroProblems} aria-label="Three product problems">
                  <p>Three connected product problems</p>
                  <a href="#configuration" onClick={(event) => { event.preventDefault(); selectSection("configuration"); }}>
                    <span>01</span><div><b>Configuration dependencies</b><strong>Prevent</strong><small>invalid combinations before quotation</small></div>
                  </a>
                  <a href="#ownership" onClick={(event) => { event.preventDefault(); selectSection("ownership"); }}>
                    <span>02</span><div><b>Delivery ownership</b><strong>Clarify</strong><small>the next responsible dealer and action</small></div>
                  </a>
                  <a href="#pdi" onClick={(event) => { event.preventDefault(); selectSection("pdi"); }}>
                    <span>03</span><div><b>PDI maintainability</b><strong>Separate</strong><small>form behavior from screen implementation</small></div>
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

              <ArtifactDisclosure
                kind="User flow + low-fidelity wireframes"
                title="How the dependency became visible before quotation"
                summary="Open the reconstructed process evidence behind the final configuration behavior."
              >
                <FlowComparison
                  before={["Choose chassis", "Choose GVWR", "Choose wheelbase", "Build an invalid combination", "Discover the conflict during quotation"]}
                  after={["Choose chassis", "See valid GVWR choices", "Understand disabled wheelbases", "Revalidate downstream options", "Continue with a quotation-ready setup"]}
                />
                <WireframeStrip frames={[
                  {
                    title: "Hide unavailable",
                    note: "Visually quiet, but removes product-range context.",
                    blocks: ["heading", "copy", "field", "field", "action"],
                  },
                  {
                    title: "Disable + explain",
                    note: "Keeps choices visible and explains the dependency.",
                    blocks: ["heading", "copy", "field", "status", "field", "action"],
                  },
                  {
                    title: "Selection summary",
                    note: "Makes downstream consequences reviewable before quotation.",
                    blocks: ["heading", "status", "copy", "copy", "action"],
                  },
                ]} />
              </ArtifactDisclosure>

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

              <EvidenceFrame
                title="Dependency-aware Build Your Own flow"
                note="The selected package changes the available options while the configuration summary keeps the consequences visible."
                images={[{
                  src: "/case-study-assets/configuration-fedex.png",
                  alt: "Build Your Own screen showing FedEx package dependencies",
                  label: "FedEx package dependencies",
                }]}
              />

              <AnnotatedScreen
                src="/case-study-assets/configuration-fedex.png"
                alt="Annotated Build Your Own screen showing configuration hierarchy and affordances"
                title="The final screen explains both availability and consequence"
                annotations={[
                  { number: "01", title: "Sequence", detail: "Earlier choices establish the rules for every option that follows.", x: "19%", y: "31%" },
                  { number: "02", title: "Affordance", detail: "Unavailable options remain visible but clearly disabled, preserving product context.", x: "50%", y: "47%" },
                  { number: "03", title: "Hierarchy", detail: "The configuration summary keeps model and price consequences visible before continuation.", x: "83%", y: "28%" },
                ]}
              />

              <ChapterResolution
                decision="Keep incompatible choices visible, disable them and explain which earlier selection created the restriction."
                tradeoff="The screen carries more explanatory states than a hide-only interface."
                behavior="Users can correct the dependency before creating a quotation or Sales Order."
                validation="Scenario walkthroughs covered rule changes and revalidation; production error-rate measurement was not available."
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

              <ArtifactDisclosure
                kind="Information architecture + role flow"
                title="One delivery record, two dealers and changing ownership"
                summary="Open the reconstructed role and permission model used to separate progress from responsibility."
              >
                <InformationArchitecture
                  title="Delivery information organized around ownership"
                  groups={[
                    { role: "Requesting Dealer", owns: "Request and receipt", access: ["Raise request", "Track transfer", "Confirm arrival", "Complete PDI and retail delivery"] },
                    { role: "Supplying Dealer", owns: "Acceptance and dispatch", access: ["Review request", "Accept or reject", "Prepare vehicle", "Mark vehicle in transit"] },
                    { role: "Shared vehicle data", owns: "VIN and delivery history", access: ["Existing VIN only", "One transfer record", "Stage history", "Warranty dependency"] },
                  ]}
                />
                <FlowComparison
                  before={["Read combined status", "Open request", "Inspect history", "Infer responsible dealer", "Work out the next action"]}
                  after={["Scan current status", "See completed stage", "See responsible dealer", "Read next action", "Open only when action is required"]}
                />
              </ArtifactDisclosure>

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

              <ChapterResolution
                decision="Separate status, completed stage, responsible dealer and next action instead of compressing them into one label."
                tradeoff="The list needs more columns, so density is intentionally higher."
                behavior="Each dealer can identify whether the request is waiting on them before opening the record."
                validation="Both dealer perspectives were walked through across the approved stages; task-time and hand-off metrics were not collected."
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

              <ArtifactDisclosure
                kind="Wireframes + component variants"
                title="Designing the checklist and every state around it"
                summary="Open the reconstructed exploration of task grouping, affordances and edge-state coverage."
              >
                <WireframeStrip frames={[
                  {
                    title: "Single checklist",
                    note: "Complete but difficult to scan, recover and review.",
                    blocks: ["heading", "field", "field", "field", "field", "action"],
                  },
                  {
                    title: "Task-based steps",
                    note: "Groups inspection work around recognizable vehicle areas.",
                    blocks: ["heading", "status", "field", "field", "action"],
                  },
                  {
                    title: "Final review",
                    note: "Makes failed evidence and sign-off visible before submission.",
                    blocks: ["heading", "status", "copy", "copy", "action"],
                  },
                ]} />
                <StateCoverageMatrix items={[
                  { state: "Default", cue: "Inspection item ready", purpose: "Shows the expected check and available response." },
                  { state: "Loading", cue: "Draft retrieval in progress", purpose: "Prevents duplicate input while saved answers load.", tone: "progress" },
                  { state: "Empty", cue: "No inspection started", purpose: "Explains how to begin and what evidence may be required." },
                  { state: "Error", cue: "Draft or upload failed", purpose: "Preserves entered work and offers a clear recovery action.", tone: "warning" },
                  { state: "Passed", cue: "Requirement satisfied", purpose: "Moves the item toward final review.", tone: "positive" },
                  { state: "Failed", cue: "Comment and evidence required", purpose: "Makes the consequence and required recovery explicit.", tone: "warning" },
                  { state: "Disabled", cue: "Submission unavailable", purpose: "Explains which incomplete requirement blocks sign-off.", tone: "restricted" },
                  { state: "Restricted", cue: "Role cannot approve", purpose: "Separates inspection access from final dealer sign-off.", tone: "restricted" },
                ]} />
              </ArtifactDisclosure>

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

              <ChapterResolution
                decision="Use eight task-based steps and a reusable renderer whose labels, validation, options and order come from JSON configuration."
                tradeoff="The renderer needs governance, and unsupported behavior still requires custom implementation."
                behavior="Technicians review one inspection area at a time, failed items require evidence and the complete result remains visible before sign-off."
                validation="Form, role and failed-item scenarios were reviewed; completion-time and maintenance-effort improvements were not formally measured."
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
                <div><p>Project outcomes</p><h2>The delivered design made critical system behavior visible.</h2></div>
              </div>

              <div className={styles.caseV2OutcomeTable}>
                <div className={styles.caseV2OutcomeHeader}><span>Product problem</span><span>Design response</span><span>Defensible outcome</span></div>
                <div><b>Invalid configurations</b><p>Dependency-aware options and revalidation</p><strong>Invalid paths are blocked before quotation while the reason remains visible.</strong></div>
                <div><b>Unclear delivery ownership</b><p>Status, stage, owner and next action</p><strong>Each dealer can see responsibility without inferring it from progress alone.</strong></div>
                <div><b>Changing PDI requirements</b><p>Eight steps and JSON-driven forms</p><strong>Common form behavior is separated from the screen structure and can be governed centrally.</strong></div>
              </div>

              <div className={styles.caseOutcomeBoundary}>
                <b>Validation boundary</b>
                <p>Formal usability benchmarks, production error rates and maintenance-effort measurements were not available. This case study documents delivered interaction coverage, reviewed business rules and one confirmed implementation correction without inventing business impact.</p>
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
                <Link href="/">Return to desktop</Link>
              </div>
            </section>
          </article>
        </section>

        <aside className={`${styles.studioInspector} ${styles.caseInspector}`} aria-label="Selection inspector">
          <div>
            <header><h2>Harbinger.fig</h2><span className={styles.caseInspectorStatus}><i /> Selected</span></header>
            <dl>
              <div><dt>Role</dt><dd>Senior UI/UX Designer</dd></div>
              <div><dt>Scope</dt><dd>HBR Portal + Dealer Portal</dd></div>
              <div><dt>System lens</dt><dd>Roles · Rules · Data · Decisions</dd></div>
              <div><dt>Decision</dt><dd>Expose dependencies before they become operational failures.</dd></div>
              <div><dt>Validation boundary</dt><dd>Delivered design and one confirmed UI-QA correction. Broader outcome metrics remain unverified.</dd></div>
            </dl>
            <Link className={styles.studioInspectorAction} href="/work/harbinger/documentation">Open UX evidence</Link>
          </div>
        </aside>
      </div>

      <span className={styles.caseZoomAnnouncement} aria-live="polite">Canvas zoom {zoom}%</span>
      {presenting ? <button className={styles.caseExitPresentation} type="button" onClick={() => setPresenting(false)}>Exit presentation <kbd>Esc</kbd></button> : null}
      <footer className={styles.studioStatusbar}>
        <span><i /> Product case study</span>
        <span>Harbinger Motors</span>
        <span>3 decisions · 5-stage narrative · 1 confirmed QA correction</span>
        <Link href="/">Return to desktop</Link>
      </footer>
    </main>
  );
}
