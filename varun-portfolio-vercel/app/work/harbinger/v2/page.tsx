"use client";
/* eslint-disable @next/next/no-img-element -- Product evidence must keep its original screenshot pixels. */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaseFileHeader } from "../../../concepts/CaseFileHeader";
import { SystemIcon, type SystemIconName } from "../../../components/SystemIcon";
import styles from "../../../concepts/concepts.module.css";
import { FlowComparison, InformationArchitecture, StateCoverageMatrix, WireframeStrip } from "../../case-study-story";

type IconName = "arrow" | "data" | "file" | "folder" | "home" | "truck";
type Annotation = { number: string; title: string; detail: string; x: string; y: string };
type WorkflowStep = { title: string; detail?: string };

const sections = [
  ["overview", "Overview"],
  ["configuration", "Configuration rules"],
  ["ownership", "Delivery ownership"],
  ["pdi", "PDI and JSON forms"],
  ["validation", "Validation and UI QA"],
  ["outcomes", "Behaviour and reflection"],
] as const;

const sectionIds = sections.map(([id]) => id);

const constraints = [
  "Approved workflows required stakeholder agreement before structural changes.",
  "The interface reused the existing component and visual system.",
  "Requirements changed while screens were being designed and built.",
  "Multiple roles relied on the same vehicle, VIN and status data.",
];

const configurationAnnotations: Annotation[] = [
  { number: "01", title: "Dependency-aware options", detail: "Package selection updates the choices that follow.", x: "21%", y: "43%" },
  { number: "02", title: "Disabled with a reason", detail: "Required or incompatible items remain visible with their rule.", x: "49%", y: "58%" },
  { number: "03", title: "Persistent summary", detail: "The selected configuration stays visible while options change.", x: "78%", y: "48%" },
  { number: "04", title: "Model code and price", detail: "Commercial consequences are visible before quotation.", x: "89%", y: "68%" },
];

const deliveryAnnotations: Annotation[] = [
  { number: "01", title: "Current status", detail: "The transfer state remains available for quick scanning.", x: "82%", y: "66%" },
  { number: "02", title: "Completed stage", detail: "Progress cards and status labels show how far the request has moved.", x: "58%", y: "36%" },
  { number: "03", title: "Responsible dealer", detail: "Dealer responsibility is visible beside the vehicle record.", x: "69%", y: "68%" },
  { number: "04", title: "Next action", detail: "The action control opens the task required for that request.", x: "94%", y: "68%" },
];

const pdiAnnotations: Annotation[] = [
  { number: "01", title: "Eight task-based steps", detail: "The checklist is grouped around recognizable inspection work.", x: "12%", y: "57%" },
  { number: "02", title: "Draft and resume", detail: "Progress and Save Draft preserve incomplete inspections.", x: "85%", y: "17%" },
  { number: "03", title: "Failed-item evidence", detail: "A failed result requires issue details and configured evidence.", x: "75%", y: "62%" },
  { number: "04", title: "Review before submission", detail: "Completion moves the technician to sign-off and final review.", x: "93%", y: "17%" },
  { number: "05", title: "Warranty remains gated", detail: "Warranty registration stays unavailable until PDI passes.", x: "91%", y: "91%" },
];

function Icon({ name }: { name: IconName }) {
  const aliases: Record<IconName, SystemIconName> = {
    arrow: "arrow-right",
    data: "database",
    file: "file",
    folder: "folder",
    home: "home",
    truck: "truck",
  };
  return <SystemIcon name={aliases[name]} />;
}

function useHarbingerActiveSection() {
  const [activeSection, setActiveSection] = useState<(typeof sectionIds)[number]>("overview");

  useEffect(() => {
    const root = window.matchMedia("(max-width: 900px)").matches
      ? null
      : document.querySelector<HTMLElement>("[data-case-scroll]");
    const observed = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    const updateFromHash = () => {
      const hash = window.location.hash.slice(1) as (typeof sectionIds)[number];
      if (sectionIds.includes(hash)) setActiveSection(hash);
    };
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id as (typeof sectionIds)[number]);
    }, { root, rootMargin: "-12% 0px -70% 0px", threshold: [0, 0.1, 0.3] });

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);
    observed.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, []);

  const selectSection = useCallback((id: (typeof sectionIds)[number]) => {
    setActiveSection(id);
    const target = document.getElementById(id);
    if (target) {
      if (window.matchMedia("(max-width: 900px)").matches) {
        document.querySelector<HTMLElement>("[data-case-scroll]")?.scrollTo({ top: 0, left: 0, behavior: "auto" });
        window.requestAnimationFrame(() => {
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 78, behavior: "auto" });
        });
      } else {
        target.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  return { activeSection, selectSection };
}

function StorySummary({ problem, decision, delivered }: { problem: string; decision: string; delivered: string }) {
  return (
    <div className={styles.harbingerStorySummary} aria-label="Problem, decision and delivered behaviour">
      <article><span>Problem</span><p>{problem}</p></article>
      <article><span>Decision</span><p>{decision}</p></article>
      <article><span>Delivered behaviour</span><p>{delivered}</p></article>
    </div>
  );
}

function FrameHandles() {
  return <span className={styles.harbingerFrameHandles} aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</span>;
}

function AnnotatedOpenerImage({ src, alt, title, label, annotations }: { src: string; alt: string; title: string; label: string; annotations: Annotation[] }) {
  return (
    <div className={styles.harbingerOpenerScreen}>
      <header><span>{label}</span><b>{title}</b></header>
      <div className={styles.harbingerOpenerImage}>
        <a href={src} target="_blank" rel="noreferrer" aria-label={`${title}. Open full-size screen.`}>
          <img src={src} alt={alt} loading="lazy" decoding="async" />
        </a>
        {annotations.map((annotation) => <i key={annotation.number} style={{ left: annotation.x, top: annotation.y }} aria-hidden="true">{annotation.number}</i>)}
      </div>
    </div>
  );
}

function OpenerAnnotations({ annotations }: { annotations: Annotation[] }) {
  return (
    <figcaption className={styles.harbingerOpenerAnnotations}>
      {annotations.map((annotation) => <div key={annotation.number}><span>{annotation.number}</span><p><b>{annotation.title}</b>{annotation.detail}</p></div>)}
    </figcaption>
  );
}

function SupportingEvidence({ children }: { children: React.ReactNode }) {
  return (
    <details className={styles.harbingerSupportingEvidence}>
      <summary>
        <div><span>User story · workflow · trade-offs</span><b>View supporting evidence</b></div>
        <SystemIcon name="chevron-down" size={18} />
      </summary>
      <div className={styles.harbingerSupportingEvidenceBody}>{children}</div>
    </details>
  );
}

function HeroStoryboard() {
  return (
    <div className={styles.harbingerHeroStoryboard} aria-label="Three connected Harbinger product workflows">
      <div className={styles.harbingerHeroStoryboardTitle}><span>Connected product view</span><b>One vehicle record, three operational decisions</b></div>
      <figure className={styles.harbingerHeroConfiguration}>
        <figcaption><i>01</i><span>Configure</span></figcaption>
        <img src="/case-study-assets/configuration-fedex.png" alt="Vehicle configuration screen" decoding="async" />
      </figure>
      <figure className={styles.harbingerHeroDelivery}>
        <figcaption><i>02</i><span>Transfer</span></figcaption>
        <img src="/case-study-assets/delivery-requests.jpg" alt="Dealer delivery requests screen" decoding="async" />
      </figure>
      <figure className={styles.harbingerHeroPdi}>
        <figcaption><i>03</i><span>Inspect</span></figcaption>
        <img src="/case-study-assets/pdi-failed-item.png" alt="Vehicle PDI checklist screen" decoding="async" />
      </figure>
      <div className={styles.harbingerHeroStoryboardSpine} aria-hidden="true"><span /><span /><span /></div>
      <div className={styles.harbingerHeroHub}><span>Shared system record</span><b>Vehicle + VIN</b><small>HBR Portal · Dealer Portal</small></div>
    </div>
  );
}

function ConfigurationOpener() {
  const steps = ["Chassis", "GVWR", "Wheelbase", "Battery", "Options", "Model code", "Price"];
  return (
    <figure className={`${styles.harbingerStoryOpener} ${styles.harbingerConfigurationOpener}`}>
      <div className={styles.harbingerOpenerCopy}>
        <span>Dependency model</span>
        <h3>Earlier selections control every choice that follows.</h3>
        <ol>{steps.map((step, index) => <li key={step}><i>{String(index + 1).padStart(2, "0")}</i><b>{step}</b></li>)}</ol>
        <p><b>Blocked path</b> Incompatible options remain visible with their reason.</p>
      </div>
      <AnnotatedOpenerImage
        label="Primary final screen · Build Your Own"
        title="Configuration rules remain visible before quotation"
        src="/case-study-assets/configuration-fedex.png"
        alt="Configuration screen showing options and a persistent vehicle summary"
        annotations={configurationAnnotations}
      />
      <OpenerAnnotations annotations={configurationAnnotations} />
    </figure>
  );
}

function DeliveryOpener() {
  return (
    <figure className={`${styles.harbingerStoryOpener} ${styles.harbingerDeliveryOpener}`}>
      <div className={styles.harbingerDeliverySpine}>
        <span>Existing VIN</span>
        <div><i>01</i><b>Requesting Dealer</b><p>Creates request</p></div>
        <div><i>02</i><b>Supplying Dealer</b><p>Accepts and sends In Transit</p></div>
        <div><i>03</i><b>Requesting Dealer</b><p>Completes PDI and delivery</p></div>
      </div>
      <div className={styles.harbingerDeliveryVisual}>
        <header><span>Responsibility model</span><h3>The VIN stays constant while ownership moves.</h3></header>
        <AnnotatedOpenerImage
          label="Primary final screen · Delivery requests"
          title="Ownership and next action remain separate"
          src="/case-study-assets/delivery-requests.jpg"
          alt="Delivery requests screen showing status, dealer and action"
          annotations={deliveryAnnotations}
        />
      </div>
      <OpenerAnnotations annotations={deliveryAnnotations} />
    </figure>
  );
}

function PdiOpener() {
  const controls = ["Labels", "Field types", "Required states", "Validation", "Options", "Ordering", "Conditional visibility"];
  return (
    <figure className={`${styles.harbingerStoryOpener} ${styles.harbingerPdiOpener}`}>
      <div className={styles.harbingerPdiSystem}>
        <header><span>Configuration layer</span><h3>JSON controls shared form behaviour.</h3></header>
        <ul>{controls.map((control) => <li key={control}>{control}</li>)}</ul>
        <div><span>JSON configuration</span><i aria-hidden="true">→</i><span>Reusable renderer</span></div>
      </div>
      <div className={styles.harbingerPdiVisual}>
        <header><span>Rendered workflow</span><b>Eight task-based steps</b><small>Draft · Failure · Evidence · Review · PDI passed</small></header>
        <AnnotatedOpenerImage
          label="Primary final screen · Vehicle PDI checklist"
          title="Eight-step PDI with draft and failure recovery"
          src="/case-study-assets/pdi-failed-item.png"
          alt="Eight-step PDI checklist with draft and failed-item evidence"
          annotations={pdiAnnotations}
        />
      </div>
      <OpenerAnnotations annotations={pdiAnnotations} />
    </figure>
  );
}

function UserStory({ children }: { children: React.ReactNode }) {
  return <div className={styles.harbingerUserStory}><span>User story</span><p>{children}</p></div>;
}

function WorkflowRail({ label, steps, compact = false }: { label: string; steps: WorkflowStep[]; compact?: boolean }) {
  return (
    <div className={`${styles.harbingerWorkflow} ${compact ? styles.harbingerWorkflowCompact : ""}`}>
      <span>{label}</span>
      <div>
        {steps.map((step, index) => (
          <article key={`${step.title}-${index}`}>
            <i>{String(index + 1).padStart(2, "0")}</i>
            <b>{step.title}</b>
            {step.detail ? <p>{step.detail}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function RuleList({ title, items }: { title: string; items: string[] }) {
  return <div className={styles.harbingerRuleList}><span>{title}</span><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}

function ReconstructionDisclosure({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className={styles.harbingerReconstruction}>
      <summary>
        <div>
          <span>Reconstructed retrospectively from delivered workflows and implementation knowledge.</span>
          <b>{title}</b>
        </div>
        <ol aria-label="Reconstructed design progression">
          <li>Sketch</li><li>Wireframe</li><li>Final UI</li>
        </ol>
        <i aria-hidden="true">+</i>
      </summary>
      <div className={styles.harbingerReconstructionBody}>{children}</div>
    </details>
  );
}

function ReconstructionImage({ src, title, note }: { src: string; title: string; note: string }) {
  return (
    <figure className={styles.harbingerReconstructionImage}>
      <figcaption><span>Sketch and workflow map</span><b>{title}</b><p>{note}</p></figcaption>
      <a href={src} target="_blank" rel="noreferrer"><img src={src} alt={title} loading="lazy" decoding="async" /></a>
    </figure>
  );
}

function MoreScreens({ images }: { images: Array<{ src: string; title: string; alt: string }> }) {
  return (
    <details className={styles.harbingerMoreScreens}>
      <summary>View more screens <SystemIcon name="chevron-down" size={14} /></summary>
      <div>
        {images.map((image) => (
          <figure key={image.src}>
            <figcaption>{image.title}</figcaption>
            <a href={image.src} target="_blank" rel="noreferrer"><img src={image.src} alt={image.alt} loading="lazy" decoding="async" /></a>
          </figure>
        ))}
      </div>
    </details>
  );
}

function DecisionGrid({ items }: { items: Array<{ label: string; copy: string }> }) {
  return <div className={styles.harbingerDecisionGrid}>{items.map((item) => <article key={item.label}><span>{item.label}</span><p>{item.copy}</p></article>)}</div>;
}

function StoryBoundary({ benefit, validation }: { benefit: string; validation: string }) {
  return (
    <div className={styles.harbingerStoryBoundary}>
      <div><span>Expected benefit</span><p>{benefit}</p></div>
      <div><span>Validation boundary</span><p>{validation}</p></div>
    </div>
  );
}

export default function HarbingerV2CaseStudy() {
  const { activeSection, selectSection } = useHarbingerActiveSection();
  const [zoom, setZoom] = useState(100);
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
    <main className={`${styles.previewPage} ${styles.studioPage} ${styles.caseWorkspacePage} ${styles.caseV2Page} ${styles.harbingerRefinedPage} ${presenting ? styles.studioPresentation : ""}`}>
      <a className={styles.caseSkipLink} href="#case-canvas">Skip to case study</a>
      <CaseFileHeader fileName="Harbinger.fig">
        <div className={styles.caseZoomControls} aria-label="Canvas zoom controls">
          <button type="button" onClick={() => changeZoom(zoom - 10)} disabled={zoom === 50} aria-label="Zoom out"><SystemIcon name="minus" size={15} /></button>
          <button type="button" className={styles.caseZoomValue} onClick={fitArtboard} aria-label={`Canvas zoom ${zoom} percent. Fit artboard`}>{zoom}%</button>
          <button type="button" onClick={() => changeZoom(zoom + 10)} disabled={zoom === 150} aria-label="Zoom in"><SystemIcon name="plus" size={15} /></button>
        </div>
        <button className={styles.caseToolbarPresent} type="button" onClick={() => setPresenting(true)}>Present <kbd>P</kbd></button>
        <Link href="/work/harbinger/documentation">UX documentation</Link>
      </CaseFileHeader>

      <nav className={styles.caseMobileSectionNav} aria-label="Harbinger case study sections">
        <label htmlFor="harbinger-v2-section">Section</label>
        <select id="harbinger-v2-section" value={activeSection} onChange={(event) => { event.currentTarget.blur(); selectSection(event.target.value as (typeof sectionIds)[number]); }}>
          {sections.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </nav>

      <div className={`${styles.studioWorkspace} ${styles.caseWorkspace}`}>
        <aside className={styles.studioLeft} aria-label="Case study navigation">
          <div className={styles.casePanelHeading}><strong>Contents</strong><span>Harbinger.fig</span></div>
          <nav className={styles.studioPrimaryNav}><Link href="/"><Icon name="home" /><span>Desktop</span></Link></nav>
          <div className={styles.studioProjectTree}>
            <p>Harbinger Motors</p>
            <a className={`${styles.caseViewBranch} ${styles.caseViewBranchActive}`} href="#overview"><Icon name="file" /><span>Case study</span><b><SystemIcon name="chevron-down" size={14} /></b></a>
            <div className={styles.caseSectionLinks}>
              {sections.map(([id, label], index) => (
                <a className={activeSection === id ? styles.studioTreeActive : ""} key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} onClick={(event) => { event.preventDefault(); selectSection(id); }}>
                  <span>{String(index + 1).padStart(2, "0")}</span>{label}
                </a>
              ))}
            </div>
            <Link className={styles.caseViewBranch} href="/work/harbinger/documentation"><Icon name="folder" /><span>UX documentation</span><b><SystemIcon name="chevron-right" size={14} /></b></Link>
            <p className={styles.casePortalLabel}>Product areas</p>
            <div className={styles.casePortalList}><span><Icon name="data" />HBR Portal</span><span><Icon name="truck" />Dealer Portal</span></div>
          </div>
        </aside>

        <section className={styles.caseStudyCanvas} id="case-canvas" ref={canvasRef} tabIndex={-1} aria-label="Harbinger Motors case study canvas" data-case-scroll>
          <article className={styles.caseStudyDocument} ref={documentRef} style={{ zoom: zoom / 100 }}>
            <section className={`${styles.caseStudyHero} ${styles.caseV2Hero} ${styles.harbingerHero} ${styles.harbingerCanvasFrame} ${styles.harbingerSelectedFrame}`} id="overview" data-frame-label="Cover / Connected workflows" data-frame-meta="FRAME 00 · COVER">
              <FrameHandles />
              <span className={styles.harbingerFrameCode} aria-hidden="true">&lt;/&gt;</span>
              <div className={styles.caseV2HeroIntro}>
                <div className={styles.caseStudyKicker}><span>Product case study · Enterprise vehicle operations</span><b>Harbinger Motors</b></div>
                <div className={styles.harbingerHeroCopy}>
                  <p className={styles.caseV2Hook}>Three connected workflows across vehicle configuration, dealer delivery and inspection.</p>
                  <h1>Designing three connected workflows for enterprise vehicle operations</h1>
                  <p className={styles.caseStudyLead}>Harbinger connects product configuration, dealer delivery and vehicle inspection across an internal HBR Portal and an external Dealer Portal.</p>
                </div>
                <HeroStoryboard />
              </div>

              <dl className={styles.harbingerHeroSummary}>
                <div><dt>Role</dt><dd>Senior UI/UX Designer</dd></div>
                <div><dt>Portals</dt><dd>HBR Portal + Dealer Portal</dd></div>
              </dl>
            </section>

            <section className={`${styles.caseStudySection} ${styles.harbingerCanvasFrame} ${styles.harbingerSupportFrame} ${styles.harbingerOverviewFrame}`} data-frame-label="Project overview" data-frame-meta="FRAME 01 · OVERVIEW">
              <div className={styles.harbingerOverview}>
                <div className={styles.harbingerOverviewHeading}><span>Project overview</span><h2>One vehicle record across configuration, delivery and inspection.</h2></div>
                <dl>
                  <div className={styles.harbingerContribution}><dt>Contribution</dt><dd>Workflow structure, high-fidelity UI, states, business-rule clarity, developer handoff, deployed UI review and retrospective UX documentation</dd></div>
                  <div className={styles.harbingerContribution}><dt>Focus</dt><dd>Roles, business rules, states, workflows and UI delivery</dd></div>
                </dl>
                <div className={styles.harbingerScopeBoundary}><span>Scope boundary</span><p>I worked on workflow structure, UI, states, business-rule clarity, developer handoff and deployed UI review. Backend rules, production data, integrations and final permission enforcement remained with the core product and development teams.</p></div>
                <div className={styles.harbingerConstraints}><span>Working constraints</span><ul>{constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}</ul></div>
                <p className={styles.caseEvidenceDisclosure}>Product screens use representative information and remove confidential customer data.</p>
              </div>
            </section>

            <section className={`${styles.caseStudySection} ${styles.harbingerStorySection} ${styles.harbingerCanvasFrame} ${styles.harbingerSupportFrame}`} id="configuration" data-frame-label="Configuration / Dependency rules" data-frame-meta="FRAME 02 · CONFIGURATION">
              <div className={styles.caseSectionHeading}><span>01</span><div><p>Product configuration to quotation</p><h2>Preventing invalid vehicle combinations before quotation</h2></div></div>
              <p className={styles.caseSectionIntro}>Later choices depend on earlier choices, so the interface has to validate the full configuration before it reaches quotation.</p>
              <ConfigurationOpener />
              <StorySummary
                problem="Chassis, GVWR, wheelbase, battery pack, options, model code and pricing could produce incompatible combinations."
                decision="Keep the product range visible, disable incompatible choices with a reason and revalidate later selections."
                delivered="Invalid combinations are blocked before quotation and the selected configuration remains visible."
              />
              <StoryBoundary benefit="Fewer invalid configurations should reach quotation or Sales Order." validation="Rule walkthroughs covered dependency changes and revalidation. Production error-rate measurement was not available." />
              <SupportingEvidence>
                <UserStory>As a sales or admin user, I need valid downstream choices and a persistent summary so I can create a quotation-ready vehicle without losing configuration context.</UserStory>
                <WorkflowRail label="Dependency and commercial flow" compact steps={[
                  { title: "Chassis" }, { title: "GVWR" }, { title: "Wheelbase" }, { title: "Battery pack" }, { title: "Options" }, { title: "Model code" }, { title: "Price" }, { title: "Quotation" }, { title: "Sales Order" },
                ]} />
                <RuleList title="Business rules" items={[
                  "Every downstream choice is checked against earlier selections.",
                  "Incompatible options remain visible and explain the blocking dependency.",
                  "Changing an earlier selection revalidates model code, options and price.",
                  "The selected configuration remains visible through quotation and Sales Order creation.",
                ]} />
                <ReconstructionDisclosure title="How dependency rules became visible before quotation">
                  <ReconstructionImage src="/case-study-assets/figjam/configuration-flow.png" title="Product configuration to Sales Order" note="The map located the point where invalid combinations needed to be stopped." />
                  <FlowComparison before={["Choose chassis", "Choose independent options", "Build an invalid combination", "Discover conflict during quotation"]} after={["Choose chassis", "See valid downstream choices", "Read the blocking reason", "Continue with a quotation-ready setup"]} />
                  <WireframeStrip frames={[
                    { title: "Sketch", note: "Dependency order and summary position.", blocks: ["heading", "field", "field", "status", "action"] },
                    { title: "Wireframe", note: "Disabled choices keep the product range visible.", blocks: ["heading", "field", "status", "field", "action"] },
                    { title: "Final UI", note: "Model code, price and configuration stay in view.", blocks: ["heading", "status", "copy", "copy", "action"] },
                  ]} />
                </ReconstructionDisclosure>
                <DecisionGrid items={[
                  { label: "Decision", copy: "Disable and explain incompatible choices while keeping the configuration summary visible." },
                  { label: "Reason", copy: "Users can understand the available product range and the rule affecting each option." },
                  { label: "Constraint", copy: "Supported product combinations and pricing rules remained fixed business logic." },
                  { label: "Trade-off", copy: "The screen carries more guidance and state detail than a hide-only approach." },
                ]} />
              </SupportingEvidence>
            </section>

            <section className={`${styles.caseStudySection} ${styles.harbingerStorySection} ${styles.harbingerCanvasFrame} ${styles.harbingerSupportFrame}`} id="ownership" data-frame-label="Delivery / Dealer ownership" data-frame-meta="FRAME 03 · DELIVERY">
              <div className={styles.caseSectionHeading}><span>02</span><div><p>VIN-based vehicle operations</p><h2>Making the next responsible dealer visible at every stage</h2></div></div>
              <p className={styles.caseSectionIntro}>A New Delivery transfers responsibility for an existing vehicle between two dealers while the VIN remains the shared record.</p>
              <DeliveryOpener />
              <StorySummary
                problem="A combined status showed progress but left the responsible dealer and next action unclear."
                decision="Separate current status, completed stage, responsible dealer and next action."
                delivered="Each dealer can see their responsibility and the next required action."
              />
              <StoryBoundary benefit="Users should spend less time inferring ownership from status alone." validation="Both dealer perspectives were reviewed across approved stages. Task-time and hand-off metrics were not collected." />
              <SupportingEvidence>
                <UserStory>As a requesting or supplying dealer, I need the current stage, responsible dealer and next action so I know whether a delivery request is waiting on me.</UserStory>
                <WorkflowRail label="Responsibility flow" steps={[
                  { title: "Requesting Dealer", detail: "Creates the request using an existing VIN" },
                  { title: "Supplying Dealer", detail: "Accepts, prepares and marks the vehicle In Transit" },
                  { title: "Requesting Dealer", detail: "Records arrival, completes PDI, warranty registration and retail delivery" },
                ]} />
                <RuleList title="Vehicle and ownership rules" items={[
                  "New Delivery uses an existing VIN.",
                  "No new vehicle record is created.",
                  "VIN comes from the existing vehicle table or system data.",
                  "Requesting and Supplying Dealers have different responsibilities.",
                ]} />
                <ReconstructionDisclosure title="How status became an ownership model">
                  <ReconstructionImage src="/case-study-assets/figjam/delivery-flow.png" title="Dealer-to-dealer New Delivery" note="The role-labelled flow showed where responsibility changes and what each dealer needs next." />
                  <InformationArchitecture title="Delivery information organized around ownership" groups={[
                    { role: "Requesting Dealer", owns: "Request and receipt", access: ["Raise request", "Track transfer", "Record arrival", "Complete PDI and delivery"] },
                    { role: "Supplying Dealer", owns: "Acceptance and dispatch", access: ["Review request", "Accept or reject", "Prepare vehicle", "Mark In Transit"] },
                    { role: "Shared vehicle data", owns: "VIN and lifecycle history", access: ["Existing VIN", "One transfer record", "Stage history", "Warranty dependency"] },
                  ]} />
                  <FlowComparison before={["Read combined status", "Open request", "Inspect history", "Infer owner"]} after={["Scan status", "See completed stage", "See responsible dealer", "Read next action"]} />
                </ReconstructionDisclosure>
                <MoreScreens images={[{ src: "/case-study-assets/delivery-timeline.jpg", title: "Cross-dealer delivery timeline", alt: "Delivery request detail with completed and pending stages" }]} />
                <DecisionGrid items={[
                  { label: "Decision", copy: "Show status, completed stage, responsible dealer and next action as separate signals." },
                  { label: "Reason", copy: "Each signal answers a different operational question during a dealer hand-off." },
                  { label: "Constraint", copy: "Approved transfer stages and dealer responsibilities remained unchanged." },
                  { label: "Trade-off", copy: "The list uses more columns, so information density is intentionally higher." },
                ]} />
              </SupportingEvidence>
            </section>

            <section className={`${styles.caseStudySection} ${styles.harbingerStorySection} ${styles.harbingerCanvasFrame} ${styles.harbingerSupportFrame}`} id="pdi" data-frame-label="PDI / JSON-driven forms" data-frame-meta="FRAME 04 · PDI">
              <div className={styles.caseSectionHeading}><span>03</span><div><p>PDI and JSON-driven forms</p><h2>Reducing checklist effort and requirement-<wbr />change rework</h2></div></div>
              <p className={styles.caseSectionIntro}>The checklist covered eight inspection areas while labels, fields, validation, options and ordering continued to change.</p>
              <PdiOpener />
              <StorySummary
                problem="A long checklist increased scanning effort and hardcoded fields created repeated UI and development changes."
                decision="Use eight task-based steps and move shared form behaviour into JSON configuration."
                delivered="The form structure is separated from the screen layout and common field behaviour can be governed through configuration."
              />
              <StoryBoundary benefit="Requirement changes should need less repeated UI and development work." validation="Form, role, failed-item and resubmission scenarios were reviewed. Completion-time and maintenance-effort improvements were not formally measured." />
              <SupportingEvidence>
                <UserStory>As a dealer technician, I need to save progress, record failed items with evidence and resume the inspection so the vehicle can reach PDI approval without losing work.</UserStory>
                <WorkflowRail label="Inspection and delivery lifecycle" compact steps={[
                  { title: "Draft" }, { title: "Inspection in progress" }, { title: "Failed item" }, { title: "Issue details and evidence" }, { title: "Correction" }, { title: "Resubmission" }, { title: "PDI passed" }, { title: "Warranty registration" }, { title: "Retail delivery" },
                ]} />
                <WorkflowRail label="Eight-step checklist" compact steps={[
                  { title: "Inspection details" }, { title: "Tire + HVAC" }, { title: "Door + Window" }, { title: "Startup + Charging" }, { title: "Lights + Cameras" }, { title: "Road Test + Fluids" }, { title: "Torque inspection" }, { title: "Sign-off" },
                ]} />
                <RuleList title="JSON configuration controls" items={["Labels", "Field types", "Required states", "Validation", "Options", "Ordering", "Conditional visibility"]} />
                <ReconstructionDisclosure title="How the checklist became a configurable form system">
                  <ReconstructionImage src="/case-study-assets/figjam/json-architecture.png" title="JSON configuration and reusable renderer" note="The architecture separates changing field behaviour from the screen implementation." />
                  <WireframeStrip frames={[
                    { title: "Sketch", note: "Long checklist and state requirements.", blocks: ["heading", "field", "field", "field", "action"] },
                    { title: "Wireframe", note: "Eight task groups with draft progress.", blocks: ["heading", "status", "field", "field", "action"] },
                    { title: "Final UI", note: "Failed evidence and review before submission.", blocks: ["heading", "status", "copy", "copy", "action"] },
                  ]} />
                  <StateCoverageMatrix items={[
                    { state: "Draft", cue: "Saved progress", purpose: "Restores work when the inspection resumes.", tone: "progress" },
                    { state: "Failed", cue: "Issue details required", purpose: "Captures the problem and supporting evidence.", tone: "warning" },
                    { state: "Resubmitted", cue: "Correction reviewed", purpose: "Returns the inspection to the approval path.", tone: "progress" },
                    { state: "Passed", cue: "Warranty enabled", purpose: "Allows the vehicle lifecycle to continue.", tone: "positive" },
                  ]} />
                </ReconstructionDisclosure>
                <MoreScreens images={[
                  { src: "/case-study-assets/pdi-final-review.png", title: "Final review before PDI submission", alt: "PDI sign-off and final review screen" },
                  { src: "/case-study-assets/pdi-passed.png", title: "Passed PDI and warranty next action", alt: "Passed PDI details with warranty registration action" },
                ]} />
                <DecisionGrid items={[
                  { label: "Decision", copy: "Use eight task-based steps and one renderer driven by JSON configuration." },
                  { label: "Reason", copy: "Task grouping supports focused inspection while configuration governs shared field behaviour." },
                  { label: "Constraint", copy: "Inspection evidence and the approved vehicle lifecycle had to remain complete." },
                  { label: "Trade-off", copy: "The renderer needs governance and unsupported behaviour still requires custom implementation." },
                ]} />
              </SupportingEvidence>
            </section>

            <section className={`${styles.caseStudySection} ${styles.harbingerValidation} ${styles.harbingerCanvasFrame} ${styles.harbingerSupportFrame}`} id="validation" data-frame-label="Validation / Business-rule checks" data-frame-meta="FRAME 05 · VALIDATION">
              <div className={styles.caseSectionHeading}><span>04</span><div><p>Validation and UI QA</p><h2>Checking the business rules beyond the final screens</h2></div></div>
              <p className={styles.caseSectionIntro}>Validation focused on rules, role ownership, implementation states and deployed UI review. Formal usability testing was outside the available evidence.</p>
              <div className={styles.harbingerValidationGrid}>
                <article><span>Configuration rule</span><h3>Could an invalid product combination still reach quotation?</h3><div><b>Checked</b><p>Dependency rules, invalid combinations, model-code updates and quotation eligibility.</p></div></article>
                <article><span>Role ownership</span><h3>Could each dealer identify their next action?</h3><div><b>Checked</b><p>Status, stage, responsible dealer and hand-off responsibility.</p></div></article>
                <article><span>Form validation</span><h3>Could a failed PDI be submitted without evidence?</h3><div><b>Checked</b><p>Failed-item rules, required issue details, draft recovery and resubmission.</p></div></article>
              </div>
              <div className={styles.caseV2QAFinding}>
                <span>Confirmed UI-QA correction</span>
                <div><h3>The deployed VIN validation used the wrong source.</h3><p>The screen treated the VIN as an unrelated manual value even though the valid VIN was already available in the vehicle table data. I reported the mismatch and asked the team to validate against the existing vehicle source.</p></div>
                <div><b>Why it mattered</b><p>A valid vehicle could be blocked at the start of New Delivery. The correction aligned the interface with the rule that delivery uses an existing VIN.</p></div>
              </div>
            </section>

            <section className={`${styles.caseStudySection} ${styles.caseReflection} ${styles.harbingerOutcomes} ${styles.harbingerCanvasFrame} ${styles.harbingerSupportFrame}`} id="outcomes" data-frame-label="Delivered behaviour / Reflection" data-frame-meta="FRAME 06 · OUTCOMES">
              <div className={styles.caseSectionHeading}><span>05</span><div><p>Delivered behaviour and reflection</p><h2>Delivered behaviour and reflection</h2></div></div>
              <div className={styles.harbingerOutcomeTable}>
                <div className={styles.harbingerOutcomeHeader}><span>Product problem</span><span>Delivered behaviour</span><span>Expected benefit</span></div>
                <div><b>Configuration</b><p>Invalid paths are blocked before quotation and the selected configuration remains visible.</p><strong>Fewer invalid configurations should reach quotation or Sales Order.</strong></div>
                <div><b>Delivery</b><p>Status, stage, responsible dealer and next action are shown separately.</p><strong>Dealers should spend less time inferring responsibility from progress alone.</strong></div>
                <div><b>PDI</b><p>The checklist uses eight task-based steps and shared form behaviour is controlled through JSON configuration.</p><strong>Changing fields and validation rules should require less repeated implementation work.</strong></div>
              </div>
              <div className={styles.caseOutcomeBoundary}><b>Validation boundary</b><p>Formal usability benchmarks, production error rates and maintenance-effort measurements were not available. The case study documents delivered interaction coverage, reviewed business rules and one confirmed implementation correction without inventing business impact.</p></div>
              <div className={styles.harbingerReflectionGrid}>
                <div><span>What I would improve next</span><p>I would define the product model, event tracking and success measures before high-fidelity design. This would create a clearer baseline for comparing each release with the previous workflow.</p></div>
                <div><span>What this project changed in my approach</span><p>I now treat enterprise screens as connected decisions. Roles, business rules, data sources, states and ownership need to be clear before the interface can be considered complete.</p></div>
              </div>
              <div className={styles.caseV2FinalActions}><Link href="/work/harbinger/documentation">Explore detailed UX documentation <Icon name="arrow" /></Link><Link href="/">Return to desktop</Link></div>
            </section>
          </article>
        </section>

        <aside className={`${styles.studioInspector} ${styles.caseInspector}`} aria-label="Selection inspector">
          <div>
            <header><h2>Harbinger.fig</h2><span className={styles.caseInspectorStatus}><i /> Selected</span></header>
            <dl>
              <div><dt>Contribution</dt><dd>Workflow structure, UI, states, handoff and deployed UI review.</dd></div>
              <div><dt>Focus</dt><dd>Roles · Rules · States · Workflows</dd></div>
              <div><dt>Scope boundary</dt><dd>Backend rules, production data, integrations and final permission enforcement remained with the core teams.</dd></div>
            </dl>
            <Link className={styles.studioInspectorAction} href="/work/harbinger/documentation">Open UX documentation</Link>
          </div>
        </aside>
      </div>

      <span className={styles.caseZoomAnnouncement} aria-live="polite">Canvas zoom {zoom}%</span>
      {presenting ? <button className={styles.caseExitPresentation} type="button" onClick={() => setPresenting(false)}>Exit presentation <kbd>Esc</kbd></button> : null}
      <footer className={styles.studioStatusbar}><span><i /> Product case study</span><span>Harbinger Motors</span><span>3 workflows · delivered behaviour · honest evidence boundary</span><Link href="/">Return to desktop</Link></footer>
    </main>
  );
}
