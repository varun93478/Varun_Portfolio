"use client";

import Link from "next/link";
import { CaseFileHeader } from "../../../concepts/CaseFileHeader";
import { SystemIcon, type SystemIconName } from "../../../components/SystemIcon";
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
  ["measurement", "KPI measurement"],
  ["delivery", "Delivery and reflection"],
] as const;

type DocumentId = (typeof documents)[number][0];
type EvidenceType = "Confirmed requirement" | "Reconstructed context" | "Recommended improvement" | "Needs validation";

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
  const aliases: Record<"arrow" | "file" | "folder" | "home" | "truck", SystemIconName> = {
    arrow: "arrow-right",
    file: "file",
    folder: "folder",
    home: "home",
    truck: "truck",
  };
  return <SystemIcon name={aliases[name]} />;
}

function EvidenceLabel({ children, type = "Confirmed requirement" }: { children: React.ReactNode; type?: EvidenceType }) {
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
      <CaseFileHeader fileName="Harbinger / UX documentation">
          <Link href="/work/harbinger">Case study</Link>
          <span className={styles.caseViewActive}>UX documentation</span>
      </CaseFileHeader>

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
              <DocIcon name="file" /><span>Case study</span><b><SystemIcon name="chevron-right" size={14} /></b>
            </Link>
            <a className={`${styles.caseViewBranch} ${styles.caseViewBranchActive}`} href="#product-model">
              <DocIcon name="folder" /><span>UX documentation</span><b><SystemIcon name="chevron-down" size={14} /></b>
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
              <span title="Verified in requirements, screens or implementation"><i className={styles.docKnown} />Confirmed requirement</span>
              <span title="Reconstructed from the available project evidence"><i className={styles.docInferred} />Reconstructed context</span>
              <span title="A suggested improvement beyond the current product"><i className={styles.docProposed} />Recommended improvement</span>
              <span title="Requires stakeholder or engineering confirmation"><i className={styles.docValidate} />Needs validation</span>
              <small>The labels separate project evidence from reconstructed and recommended work.</small>
            </div>
          </div>
        </aside>

        <section className={styles.caseStudyCanvas} aria-label="Harbinger UX documentation" data-case-scroll>
          <article className={`${styles.caseStudyDocument} ${styles.documentationDocument}`}>
            <header className={styles.documentationHero}>
              <div className={styles.caseStudyKicker}><span>Harbinger Motors</span><b>UX documentation</b></div>
              <p className={styles.documentationEyebrow}>A deeper view of the system behind the screens</p>
              <h1>Roles, rules, workflows and product decisions.</h1>
              <p>This documentation was created after parts of the project had already moved into high-fidelity UI. I revisited the work to clarify the product logic, record confirmed requirements, reconstruct missing context and improve future design and handoff decisions.</p>
              <nav className={styles.docStoryLinks} aria-label="Harbinger problem-solving stories">
                <span>Linked case-study decisions</span>
                <Link href="/work/harbinger#configuration"><b>01</b> Configuration rules</Link>
                <Link href="/work/harbinger#ownership"><b>02</b> Delivery ownership</Link>
                <Link href="/work/harbinger#pdi"><b>03</b> PDI and JSON forms</Link>
              </nav>
              <div className={styles.documentationSummary}>
                <div><b>2</b><span>Enterprise portals</span></div>
                <div><b>5</b><span>Primary role groups</span></div>
                <div><b>10</b><span>Documentation areas</span></div>
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
              <EvidenceLabel type="Reconstructed context">The role map combines confirmed screen access with responsibilities reconstructed from visible actions. Final permission boundaries still need stakeholder review.</EvidenceLabel>
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
              <EvidenceLabel type="Recommended improvement">This normalized status and ownership model documents the intended workflow. Final system values need engineering and stakeholder confirmation.</EvidenceLabel>
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
              <EvidenceLabel type="Needs validation">These edge cases are a design and implementation checklist. Priority, system behaviour and exception ownership require product review.</EvidenceLabel>
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
                <article><span>01</span><h3>Dependency-based configuration</h3><p>Keep unavailable downstream options visible, disable them and explain which earlier selection caused the restriction.</p><b>Reduces invalid combinations</b><Link href="/work/harbinger#configuration">Open decision story <DocIcon name="arrow" /></Link></article>
                <article><span>02</span><h3>Status plus next action</h3><p>Keep lifecycle status separate from the current stage, responsible dealer and next required action.</p><b>Clarifies operational ownership</b><Link href="/work/harbinger#ownership">Open decision story <DocIcon name="arrow" /></Link></article>
                <article><span>03</span><h3>Eight-step PDI</h3><p>Group inspection items by task and keep a final review before dealer sign-off.</p><b>Reduces visual overload</b><Link href="/work/harbinger#pdi">Open decision story <DocIcon name="arrow" /></Link></article>
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
                <article><span>JSON Schema + UI schema</span><div><p>Data type</p><p>Required state</p><p>Validation</p><p>Label</p><p>Options</p><p>Order</p><p>Conditional visibility</p><p>Renderer options</p></div></article>
                <i><DocIcon name="arrow" /></i>
                <article><span>Reusable renderer</span><div className={styles.docRenderer}><b>Control mapping</b><p>Approved input component</p><p>Validation message</p><p>Required and disabled state</p><p>Conditional behaviour</p></div></article>
                <i><DocIcon name="arrow" /></i>
                <article><span>Rendered product forms</span><div><p>PDI checklist</p><p>Inspection details</p><p>Pass or fail states</p><p>Evidence upload</p><p>Final review</p></div></article>
              </div>
              <EvidenceLabel>The team introduced JSON-driven forms because field requirements frequently changed during the project.</EvidenceLabel>
              <DecisionBlock
                decision="Move reusable form behaviour from hardcoded screens into configuration."
                reason="Labels, validations, required states, options and ordering changed often."
                constraint="The UI work still depended on engineering integration and the supported form component set."
                tradeoff="Configuration reduces repeated changes, but complex custom interactions may still need dedicated components."
              />
              <div className={styles.docJsonGovernance}>
                <article><span>Supported through configuration</span><p>Labels, required states, validation rules, options, order, default values and conditional visibility.</p></article>
                <article><span>Requires a custom renderer</span><p>New interaction patterns, complex uploads or behaviour that the existing component set does not support.</p></article>
                <article><span>Recommended governance</span><p>Version schemas, test affected workflows and keep renderer support documented before a configuration is published.</p></article>
              </div>
            </section>

            <section className={styles.documentationSection} id="measurement">
              <div className={styles.documentationHeading}><span>09</span><div><p>KPI measurement plan</p><h2>Each design decision has a measurable operational result.</h2></div></div>
              <div className={styles.docMetricTable}>
                <header><span>Decision</span><span>Primary KPI</span><span>Calculation</span><span>Data needed</span></header>
                <div><b>Configuration rules</b><p>Invalid configuration rate</p><p>Invalid reviews ÷ completed configurations</p><p>Selections, validation errors and quotation status</p></div>
                <div><b>Delivery ownership</b><p>Unclear hand-off rate</p><p>Requests needing ownership clarification ÷ total requests</p><p>Status, owner, next action and support events</p></div>
                <div><b>PDI and JSON forms</b><p>Field-change turnaround</p><p>Release time minus approved requirement time</p><p>Requirement, schema change, QA and release timestamps</p></div>
              </div>
              <div className={styles.docMetricCards}>
                <article><span>Configuration</span><b>Completion time</b><p>First valid selection to quotation-ready setup.</p></article>
                <article><span>Delivery</span><b>Overdue actions</b><p>Requests that remain beyond the expected time for the current owner.</p></article>
                <article><span>PDI</span><b>Form-change defects</b><p>Defects caused by updates to labels, validations, required states or options.</p></article>
              </div>
              <EvidenceLabel type="Recommended improvement">Track a baseline before release and compare the same event definitions after release. Keep KPI ownership with product and engineering so the measurement remains consistent.</EvidenceLabel>
            </section>

            <section className={`${styles.documentationSection} ${styles.documentationReflection}`} id="delivery">
              <div className={styles.documentationHeading}><span>10</span><div><p>Validation and delivery</p><h2>The documentation now supports design, handoff and future requirements.</h2></div></div>
              <div className={styles.docDeliveryRail}>
                {["Requirement intake", "Product understanding", "Flow and rules", "High-fidelity UI", "Developer handoff", "UI QA", "Documentation"].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}
              </div>
              <div className={styles.docReflectionGrid}>
                <article><span>What shipped</span><p>Vehicle Transfer and Service Center UI reached the shared test environment.</p></article>
                <article><span>What improved</span><p>Roles, status ownership, dependencies, business rules and edge cases became easier to review together.</p></article>
                <article><span>What to measure next</span><p>Configuration errors, hand-off clarity, overdue actions, PDI completion and form-change effort.</p></article>
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
        <span>10 documents</span>
        <Link href="/work/harbinger">Open case study</Link>
      </footer>
    </main>
  );
}
