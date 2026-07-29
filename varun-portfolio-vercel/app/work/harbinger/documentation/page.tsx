"use client";

import Link from "next/link";
import { PortfolioLinks } from "../../../concepts/PortfolioLinks";
import { WorkspaceTabs } from "../../../concepts/WorkspaceTabs";
import styles from "../../../concepts/concepts.module.css";
import { useActiveSection } from "../../useActiveSection";

const documents = [
  ["product-model", "Product model"],
  ["roles", "Roles and permissions"],
  ["architecture", "Information architecture"],
  ["workflow", "Cross-role workflow"],
  ["states", "States and ownership"],
  ["rules", "Business rules"],
  ["decisions", "Design decisions"],
  ["json-forms", "JSON-driven forms"],
  ["delivery", "Delivery and reflection"],
] as const;

type DocumentId = (typeof documents)[number][0];
type EvidenceType = "Confirmed" | "Interpreted" | "Recommended" | "Open question";

const documentIds = documents.map(([id]) => id);

const roles = [
  ["Harbinger Admin", "Configure products, track vehicles, review warranty claims"],
  ["Super Admin", "Manage dealer organizations, users and platform access"],
  ["Dealer Admin", "Manage dealer employees and operational records"],
  ["Dealer Employee", "Raise deliveries, complete PDI and deliver vehicles"],
  ["Service Center", "Create Repair Orders and submit warranty claims"],
];

const rules = [
  "A New Delivery uses an existing vehicle or VIN. It does not create a vehicle.",
  "Product options appear only when the selected chassis, GVWR, wheelbase and battery combination allows them.",
  "Warranty registration requires a Passed PDI.",
  "A failed PDI item requires a comment and can include supporting evidence.",
  "A rejected quotation requires a reason before it can return for correction.",
  "A Sales Order must not be created twice for the same approved quotation.",
];

const edgeCases = [
  "An earlier configuration change invalidates a later option.",
  "A saved product rule changes while a draft is open.",
  "No product matches the requirement details.",
  "A copied quotation contains an option that is no longer active.",
  "NetSuite creates an order, but the response times out.",
  "A vehicle reaches the dealer with incomplete arrival or inspection data.",
];

function DocIcon({ name }: { name: "arrow" | "file" | "folder" | "home" | "truck" }) {
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
  if (name === "file") return <svg {...props}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 12h6M9 16h6" /></svg>;
  if (name === "folder") return <svg {...props}><path d="M3 6h7l2 2h9v10H3z" /></svg>;
  if (name === "home") return <svg {...props}><path d="m4 11 8-7 8 7v9h-6v-6h-4v6H4z" /></svg>;
  return <svg {...props}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>;
}

function EvidenceLabel({ children, type = "Confirmed" }: { children: React.ReactNode; type?: EvidenceType }) {
  return <div className={styles.docEvidenceLabel} data-evidence={type}><span>{type}</span><p>{children}</p></div>;
}

function DecisionBlock({ decision, reason, constraint, tradeoff }: { decision: string; reason: string; constraint: string; tradeoff: string }) {
  return (
    <dl className={styles.docDecisionBlock}>
      <div><dt>Decision</dt><dd>{decision}</dd></div>
      <div><dt>Reason</dt><dd>{reason}</dd></div>
      <div><dt>Constraint</dt><dd>{constraint}</dd></div>
      <div><dt>Trade-off</dt><dd>{tradeoff}</dd></div>
    </dl>
  );
}

export default function HarbingerDocumentation() {
  const { activeSection: activeDocument, selectSection: selectDocument } =
    useActiveSection(documentIds, "product-model");

  return (
    <main className={`${styles.previewPage} ${styles.studioPage} ${styles.caseWorkspacePage} ${styles.documentationPage}`}>
      <header className={styles.studioToolbar}>
        <Link className={styles.studioBrand} href="/">Varun J</Link>
        <WorkspaceTabs />
        <div className={styles.caseToolbarActions}>
          <Link href="/work/harbinger">Case study</Link>
          <span className={styles.caseViewActive}>UX documentation</span>
          <PortfolioLinks />
        </div>
      </header>

      <nav className={styles.caseMobileSectionNav} aria-label="Harbinger UX documentation sections">
        <label htmlFor="harbinger-documentation-section">Section</label>
        <select id="harbinger-documentation-section" value={activeDocument} onChange={(event) => selectDocument(event.target.value as DocumentId)}>
          {documents.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </nav>

      <div className={`${styles.studioWorkspace} ${styles.caseWorkspace}`}>
        <aside className={styles.studioLeft} aria-label="Harbinger documentation navigation">
          <nav className={styles.studioPrimaryNav}>
            <Link href="/"><DocIcon name="home" /><span>Portfolio</span></Link>
          </nav>
          <div className={styles.studioProjectTree}>
            <p>Harbinger Motors</p>
            <Link className={styles.caseViewBranch} href="/work/harbinger">
              <DocIcon name="file" /><span>Case study</span><b>›</b>
            </Link>
            <a className={`${styles.caseViewBranch} ${styles.caseViewBranchActive}`} href="#product-model">
              <DocIcon name="folder" /><span>UX documentation</span><b>⌄</b>
            </a>
            <div className={styles.caseSectionLinks}>
              {documents.map(([id, label], index) => (
                <button
                  className={activeDocument === id ? styles.studioTreeActive : ""}
                  type="button"
                  onClick={() => selectDocument(id)}
                  aria-current={activeDocument === id ? "location" : undefined}
                  key={id}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>{label}
                </button>
              ))}
            </div>
            <p className={styles.casePortalLabel}>Evidence labels</p>
            <div className={styles.docLegend}>
              <span title="Verified in requirements, screens or implementation"><i className={styles.docKnown} />Confirmed</span>
              <span title="Reasonable reading of the available evidence"><i className={styles.docInferred} />Interpreted</span>
              <span title="A suggested improvement, not the current product"><i className={styles.docProposed} />Recommended</span>
              <span title="Requires stakeholder or engineering confirmation"><i className={styles.docValidate} />Open question</span>
              <small>These labels show what was verified and what still needs review.</small>
            </div>
          </div>
        </aside>

        <section className={styles.caseStudyCanvas} aria-label="Harbinger UX documentation" data-case-scroll>
          <article className={`${styles.caseStudyDocument} ${styles.documentationDocument}`}>
            <header className={styles.documentationHero}>
              <div className={styles.caseStudyKicker}><span>Harbinger Motors</span><b>UX documentation</b></div>
              <p className={styles.documentationEyebrow}>A deeper view of the system behind the screens</p>
              <h1>Roles, rules, workflows and product decisions.</h1>
              <p>This documentation was created after parts of the project had already moved into high-fidelity UI. I revisited the work to make the product logic clearer, separate confirmed information from interpretations and improve future design and handoff decisions.</p>
              <div className={styles.documentationSummary}>
                <div><b>2</b><span>Enterprise portals</span></div>
                <div><b>5</b><span>Primary role groups</span></div>
                <div><b>9</b><span>Documentation areas</span></div>
                <div><b>1</b><span>Shared vehicle reference: VIN</span></div>
              </div>
            </header>

            <section className={styles.documentationSection} id="product-model">
              <div className={styles.documentationHeading}><span>01</span><div><p>Product understanding</p><h2>Two portals support different parts of the vehicle lifecycle.</h2></div></div>
              <div className={styles.docPortalMap}>
                <article>
                  <header><span>HBR Portal</span><b>Internal operations</b></header>
                  <div><p>Product configuration</p><p>Build Your Own</p><p>Vehicle tracking</p><p>Yard management</p><p>Master data</p></div>
                </article>
                <div className={styles.docSharedCore}><span>Shared reference</span><b>Vehicle + VIN</b><p>Portal integration is not presented as confirmed.</p></div>
                <article>
                  <header><span>Dealer Portal</span><b>Dealer operations</b></header>
                  <div><p>New Delivery</p><p>Vehicle PDI</p><p>Retail delivery</p><p>Service Center</p><p>Warranty claims</p></div>
                </article>
              </div>
              <EvidenceLabel>Portal names, major modules and VIN-based workflows came from project screens, requirements and implementation work.</EvidenceLabel>
              <DecisionBlock
                decision="Document each portal separately, then show the vehicle and VIN as the connecting operational reference."
                reason="This makes the product easier to explain without presenting an unverified technical integration."
                constraint="Direct synchronization and backend ownership between the portals were not confirmed."
                tradeoff="The map explains product relationships, but it does not claim a complete systems architecture."
              />
            </section>

            <section className={styles.documentationSection} id="roles">
              <div className={styles.documentationHeading}><span>02</span><div><p>Users and access</p><h2>Each role sees the same vehicle through a different responsibility.</h2></div></div>
              <div className={styles.docRoleMatrix}>
                <header><span>Role</span><span>Primary responsibility</span><span>Portal</span></header>
                {roles.map(([role, responsibility], index) => (
                  <div key={role}><b>{role}</b><p>{responsibility}</p><span>{index === 0 || index === 4 ? "HBR / Dealer" : "Dealer"}</span></div>
                ))}
              </div>
              <EvidenceLabel type="Interpreted">The role map combines confirmed screen access with responsibilities interpreted from visible actions. Final permission boundaries still need stakeholder review.</EvidenceLabel>
              <DecisionBlock
                decision="Describe roles through responsibilities and permitted actions instead of demographic personas."
                reason="Enterprise behaviour is shaped mainly by operational ownership, access and the next required action."
                constraint="Formal user interviews and validated behavioural personas were not available."
                tradeoff="Proto-personas support workflow design, but they do not replace direct research."
              />
            </section>

            <section className={styles.documentationSection} id="architecture">
              <div className={styles.documentationHeading}><span>03</span><div><p>Information architecture</p><h2>Navigation follows operational areas, while the VIN keeps the record connected.</h2></div></div>
              <div className={styles.docSitemap}>
                <div className={styles.docSitemapRoot}>Harbinger Motors</div>
                <div>
                  <article><b>HBR Portal</b><span>Applications</span><p>Build Your Own</p><p>Vehicle tracking</p><p>Yard management</p><span>Configuration</span><p>All master data</p><p>Product configuration</p></article>
                  <article><b>Dealer Portal</b><span>Operations</span><p>New Delivery</p><p>Vehicle PDI</p><p>Retail delivery</p><span>After-sales</span><p>Service Center</p><p>Warranty claims</p></article>
                </div>
              </div>
              <EvidenceLabel>Menu structure and module grouping are grounded in the designed portal navigation and delivered screens.</EvidenceLabel>
              <DecisionBlock
                decision="Separate master data from product configuration and keep dealer tasks grouped by operational stage."
                reason="Reference data, dependency rules and daily vehicle work require different mental models."
                constraint="Approved navigation patterns and existing modules had to be preserved."
                tradeoff="The structure improves clarity, but final labels still depend on product-wide naming governance."
              />
            </section>

            <section className={styles.documentationSection} id="workflow">
              <div className={styles.documentationHeading}><span>04</span><div><p>Cross-role workflow</p><h2>A New Delivery transfers responsibility for an existing vehicle.</h2></div></div>
              <div className={styles.docSwimlane}>
                <header><span>Role</span><span>Request</span><span>Accept</span><span>Transit</span><span>Arrival</span><span>Delivery</span></header>
                <div><b>Requesting dealer</b><span className={styles.docFlowActive}>Select VIN and customer</span><span /><span /><span className={styles.docFlowActive}>Verify PDI</span><span className={styles.docFlowActive}>Deliver to customer</span></div>
                <div><b>Supplying dealer</b><span /><span className={styles.docFlowActive}>Accept request</span><span className={styles.docFlowActive}>Mark in transit</span><span /><span /></div>
                <div><b>System</b><span className={styles.docFlowSystem}>Create delivery request</span><span className={styles.docFlowSystem}>Update owner</span><span className={styles.docFlowSystem}>Track status</span><span className={styles.docFlowSystem}>Record inspection</span><span className={styles.docFlowSystem}>Close workflow</span></div>
              </div>
              <EvidenceLabel>The workflow reflects the agreed Dealer A and Dealer B process. Service coordination happens outside the portal.</EvidenceLabel>
              <DecisionBlock
                decision="Show the completed stage, current status, responsible dealer and next action as separate signals."
                reason="A single status label cannot explain where the vehicle is, who owns it and what must happen next."
                constraint="The workflow had to preserve the agreed business sequence."
                tradeoff="More explicit signals improve clarity, but require consistent status rules across list and detail screens."
              />
            </section>

            <section className={styles.documentationSection} id="states">
              <div className={styles.documentationHeading}><span>05</span><div><p>Status lifecycle</p><h2>Status should tell the team what happened and who acts next.</h2></div></div>
              <div className={styles.docStatusTable}>
                <header><span>Status</span><span>Owner</span><span>Next action</span><span>Exit condition</span></header>
                <div><b>Requested</b><span>Supplying dealer</span><p>Review request</p><p>Accept or reject</p></div>
                <div><b>Accepted</b><span>Supplying dealer</span><p>Prepare vehicle</p><p>Mark in transit</p></div>
                <div><b>In transit</b><span>Supplying dealer</span><p>Complete transport</p><p>Vehicle arrives</p></div>
                <div><b>Arrived</b><span>Requesting dealer</span><p>Log inspection</p><p>Arrival recorded</p></div>
                <div><b>PDI required</b><span>Requesting dealer</span><p>Complete checklist</p><p>PDI passes</p></div>
                <div><b>Ready for delivery</b><span>Requesting dealer</span><p>Deliver to customer</p><p>Retail delivery recorded</p></div>
              </div>
              <EvidenceLabel type="Recommended">This normalized status and ownership model documents the intended workflow. Final system values need engineering and stakeholder confirmation.</EvidenceLabel>
              <DecisionBlock
                decision="Define every status with an owner, next action and exit condition."
                reason="This reduces labels that describe a state but leave the operational team unsure what to do."
                constraint="Existing status values may be shared with backend integrations."
                tradeoff="Clearer UI language may require mapping user-facing labels to existing system values."
              />
            </section>

            <section className={styles.documentationSection} id="rules">
              <div className={styles.documentationHeading}><span>06</span><div><p>Business rules and edge cases</p><h2>The screen is only one layer of the product.</h2></div></div>
              <div className={styles.docRulesGrid}>
                <article><h3>Core rules</h3>{rules.map((rule, index) => <div key={rule}><span>{String(index + 1).padStart(2, "0")}</span><p>{rule}</p></div>)}</article>
                <article><h3>Important edge cases</h3>{edgeCases.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</article>
              </div>
              <EvidenceLabel type="Open question">These edge cases are a design and implementation checklist. Priority, system behaviour and exception ownership require product review.</EvidenceLabel>
              <DecisionBlock
                decision="Document rules next to the workflow and include failure paths before developer handoff."
                reason="A successful happy path does not explain how the interface should behave when data or dependencies change."
                constraint="Requirements were often clarified while UI work was already in progress."
                tradeoff="The catalogue improves coverage, but it needs active maintenance as business logic changes."
              />
            </section>

            <section className={styles.documentationSection} id="decisions">
              <div className={styles.documentationHeading}><span>07</span><div><p>Design development</p><h2>Three decisions made the operational work easier to follow.</h2></div></div>
              <div className={styles.docDecisionCards}>
                <article><span>01</span><h3>Dependency-based configuration</h3><p>Reveal only valid downstream options after chassis, GVWR, wheelbase and battery selections.</p><b>Reduces invalid combinations</b></article>
                <article><span>02</span><h3>Eight-step PDI</h3><p>Group inspection items by task so technicians can complete one clear section at a time.</p><b>Reduces visual overload</b></article>
                <article><span>03</span><h3>Status plus next action</h3><p>Keep lifecycle status separate from the action and person responsible for moving the record forward.</p><b>Clarifies operational ownership</b></article>
              </div>
              <EvidenceLabel>These decisions are visible in the Product Configuration, New Delivery and Vehicle PDI screens.</EvidenceLabel>
              <DecisionBlock
                decision="Use repeatable interaction patterns for dependency selection, long checklists and operational status."
                reason="The product contains many modules, but the same clarity problems appear across them."
                constraint="The UI needed to reuse existing styles and preserve approved functionality."
                tradeoff="Shared patterns improve consistency, but each module still needs its own business rules and validation."
              />
            </section>

            <section className={styles.documentationSection} id="json-forms">
              <div className={styles.documentationHeading}><span>08</span><div><p>Scalable forms</p><h2>Changing requirements needed a form structure that could change with them.</h2></div></div>
              <div className={styles.docJsonFlow}>
                <article><span>Schema defines</span><div><p>Label</p><p>Field type</p><p>Required state</p><p>Validation</p><p>Options</p><p>Order</p><p>Conditional visibility</p></div></article>
                <i><DocIcon name="arrow" /></i>
                <article><span>Reusable renderer</span><div className={styles.docRenderer}><b>Field group</b><p>Input behaviour</p><p>Validation message</p><p>Conditional state</p></div></article>
                <i><DocIcon name="arrow" /></i>
                <article><span>Product forms</span><div><p>PDI checklist</p><p>Inspection details</p><p>Configurable forms</p><p>Future modules</p></div></article>
              </div>
              <EvidenceLabel>The team introduced JSON-driven forms because field requirements frequently changed during the project.</EvidenceLabel>
              <DecisionBlock
                decision="Move reusable form behaviour from hardcoded screens into configuration."
                reason="Labels, validations, required states, options and ordering changed often."
                constraint="The UI work still depended on engineering integration and the supported form component set."
                tradeoff="Configuration reduces repeated changes, but complex custom interactions may still need dedicated components."
              />
            </section>

            <section className={`${styles.documentationSection} ${styles.documentationReflection}`} id="delivery">
              <div className={styles.documentationHeading}><span>09</span><div><p>Validation and delivery</p><h2>The documentation now supports design, handoff and future requirements.</h2></div></div>
              <div className={styles.docDeliveryRail}>
                {["Requirement intake", "Product understanding", "Flow and rules", "High-fidelity UI", "Developer handoff", "UI QA", "Documentation"].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}
              </div>
              <div className={styles.docReflectionGrid}>
                <article><span>What shipped</span><p>Vehicle Transfer and Service Center UI reached the shared test environment.</p></article>
                <article><span>What improved</span><p>Roles, status ownership, dependencies, business rules and edge cases became easier to review together.</p></article>
                <article><span>What remains open</span><p>Formal usability testing, measured impact and some technical integration details were not available.</p></article>
              </div>
              <blockquote>I would document the product model and lifecycle rules earlier. It would make design reviews, requirement changes and developer handoff clearer before high-fidelity work begins.</blockquote>
              <div className={styles.documentationActions}>
                <Link href="/work/harbinger">Return to case study <DocIcon name="arrow" /></Link>
                <Link href="/">Portfolio canvas</Link>
              </div>
            </section>
          </article>
        </section>

      </div>

      <footer className={styles.studioStatusbar}>
        <span><i /> UX documentation</span>
        <span>Harbinger Motors</span>
        <span>9 documents</span>
        <Link href="/work/harbinger">Open case study</Link>
      </footer>
    </main>
  );
}
