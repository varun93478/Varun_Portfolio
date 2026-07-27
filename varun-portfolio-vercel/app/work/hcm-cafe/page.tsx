"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import styles from "../../concepts/concepts.module.css";

const chapters = [
  ["overview", "Overview"],
  ["model", "Product model"],
  ["configuration", "HR configuration"],
  ["attendance", "Attendance and leave"],
  ["visitors", "Visitor lifecycle"],
  ["front-desk", "Front desk operations"],
  ["patterns", "Shared patterns"],
  ["reflection", "Reflection"],
] as const;

type EvidenceItem = {
  src: string;
  alt: string;
  label: string;
  format?: "web" | "mobile";
};

function Evidence({
  title,
  note,
  images,
  mobile = false,
  tone = "hr",
}: {
  title: string;
  note: string;
  images: EvidenceItem[];
  mobile?: boolean;
  tone?: "hr" | "vms";
}) {
  return (
    <figure className={`${styles.hcmEvidence} ${mobile ? styles.hcmEvidenceMobile : ""} ${tone === "vms" ? styles.hcmEvidenceVms : ""}`}>
      <header>
        <span>Product evidence</span>
        <b>{title}</b>
      </header>
      <div>
        {images.map((image) => (
          <a
            href={image.src}
            target="_blank"
            rel="noreferrer"
            data-format={image.format ?? "web"}
            key={image.src}
          >
            <img src={image.src} alt={image.alt} />
            <span>{image.label}</span>
          </a>
        ))}
      </div>
      <figcaption>{note}</figcaption>
    </figure>
  );
}

const visitorRoles = [
  ["Host", "Invite", "Creates the visit and shares the visitor pass"],
  ["Company Admin", "Review", "Manages visitors, employees and communication records"],
  ["Security", "Verify", "Scans the pass or finds the visitor manually"],
  ["Super Admin", "Govern", "Manages companies, reports and platform-level activity"],
];

export default function HcmCafeCaseStudy() {
  const reducedMotion = useReducedMotion();
  const reveal = {
    initial: reducedMotion ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.08 },
  };

  return (
    <main className={`${styles.previewPage} ${styles.studioPage} ${styles.caseWorkspacePage} ${styles.hcmPage}`}>
      <header className={styles.studioToolbar}>
        <Link className={styles.studioBrand} href="/">Varun J</Link>
        <div className={styles.studioTabs}>
          <Link href="/">Portfolio <span>×</span></Link>
          <Link href="/work/harbinger">Harbinger Motors <span>×</span></Link>
          <Link href="/work/aadivara">Aadivara <span>×</span></Link>
          <Link href="/work/inventfunds">InventFunds <span>×</span></Link>
          <Link href="/work/property-care">Property Care <span>×</span></Link>
          <span className={styles.studioTabActive}>HCM Café <button type="button" onClick={() => window.location.assign("/")} aria-label="Close HCM Café case study">×</button></span>
        </div>
        <div className={styles.caseToolbarActions}><span>Case study</span><Link href="/">Back to portfolio</Link></div>
      </header>

      <div className={`${styles.studioWorkspace} ${styles.caseWorkspace}`}>
        <aside className={styles.studioLeft} aria-label="HCM Café case study navigation">
          <nav className={styles.studioPrimaryNav}>
            <Link href="/"><span>⌂</span><span>Portfolio</span></Link>
            <a className={styles.studioPrimaryActive} href="#overview"><span>▤</span><span>Case study</span></a>
          </nav>
          <div className={styles.studioProjectTree}>
            <p>HCM Café</p>
            <div className={styles.caseSectionLinks}>
              {chapters.map(([id, label], index) => (
                <a className={index === 0 ? styles.studioTreeActive : ""} href={`#${id}`} key={id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>{label}
                </a>
              ))}
            </div>
            <p className={styles.casePortalLabel}>Workstreams</p>
            <div className={styles.casePortalList}>
              <span>▣ HR management</span>
              <span>◈ Visitor management</span>
              <span>◉ Web and mobile</span>
            </div>
          </div>
        </aside>

        <section className={styles.caseStudyCanvas} aria-label="HCM Café Workplace Operations case study">
          <article className={styles.caseStudyDocument}>
            <section className={`${styles.caseStudyHero} ${styles.hcmHero}`} id="overview">
              <div className={styles.caseStudyKicker}><span>HCM Café</span><b>Workplace operations</b></div>
              <h1>Designing clear operational workspaces for employees, admins, hosts and front-desk teams.</h1>
              <p className={styles.caseStudyLead}>HCM Café covers two workplace products. The HR platform supports configurable dashboards, attendance and leave. The Visitor Management System coordinates invitations, arrival, check-in and check-out across four roles.</p>
              <dl className={styles.caseStudyMeta}>
                <div><dt>Role</dt><dd>UI/UX Designer</dd></div>
                <div><dt>Contribution</dt><dd>Web and mobile workflows, dashboards, forms and states</dd></div>
                <div><dt>Workstreams</dt><dd>HR management + Visitor management</dd></div>
                <div><dt>Evidence</dt><dd>Product design files and workflow screens</dd></div>
              </dl>
              <div className={styles.hcmHeroComposition}>
                <img src="/hcm-assets/hr-employee-dashboard.jpg" alt="HCM Café employee dashboard with attendance and leave information" />
                <img src="/hcm-assets/vms-company-dashboard.png" alt="HCM Café Visitor Management company admin dashboard" />
                <img src="/hcm-assets/vms-host-dashboard-mobile.png" alt="HCM Café Visitor Management host mobile dashboard" />
                <div><span>Two workstreams</span><b>HR operations + Visitor operations</b></div>
              </div>
            </section>

            <motion.section className={styles.caseStudySection} id="model" {...reveal}>
              <div className={styles.caseSectionHeading}><span>01</span><div><p>Product model</p><h2>Keep two related workplace products clear without pretending they are one workflow.</h2></div></div>
              <div className={styles.caseTwoColumns}>
                <p>The HR product is organised around employees, managers, modules, attendance and leave. Its main challenge is helping each role see the tools and decisions relevant to them.</p>
                <p>The Visitor Management System is organised around a visitor record that moves between Host, Company Admin, Security and Super Admin. The products share a brand and visual language, but the case study keeps their responsibilities separate.</p>
              </div>
              <div className={styles.hcmWorkstreams}>
                <div><span>Workstream A</span><b>HR management</b><p>Configure modules, personalise dashboards, record attendance and manage leave.</p></div>
                <i>+</i>
                <div><span>Workstream B</span><b>Visitor management</b><p>Invite visitors, verify arrival, record guests and assets, then complete check-out.</p></div>
              </div>
            </motion.section>

            <motion.section className={`${styles.caseStudySection} ${styles.hcmHrSection}`} id="configuration" {...reveal}>
              <div className={styles.caseSectionHeading}><span>02</span><div><p>HR management</p><h2>Let organisations configure the workspace before employees use it.</h2></div></div>
              <p className={styles.caseSectionIntro}>The module configuration area brings organisation structure, locations, attendance rules, leave settings and other HR capabilities into one administrative workspace. Dashboard widgets then reflect the modules relevant to each role.</p>
              <div className={styles.hcmConfigRail}>
                <div><span>01</span><b>Organisation</b><p>Company, location, department and role structure</p></div>
                <i>→</i>
                <div><span>02</span><b>Rules</b><p>Attendance, leave, payroll and recruitment settings</p></div>
                <i>→</i>
                <div><span>03</span><b>Workspace</b><p>Role-relevant dashboard widgets and actions</p></div>
              </div>
              <Evidence
                title="Configuration and employee dashboard"
                note="Real HR product screens. Configuration defines the available modules, while the dashboard brings daily employee actions into one place."
                images={[
                  { src: "/hcm-assets/hr-module-configuration.jpg", alt: "HCM Café modules configuration screen", label: "Module configuration" },
                  { src: "/hcm-assets/hr-employee-dashboard.jpg", alt: "HCM Café employee dashboard with attendance, leave and notifications", label: "Employee dashboard" },
                ]}
              />
            </motion.section>

            <motion.section className={`${styles.caseStudySection} ${styles.hcmHrSection}`} id="attendance" {...reveal}>
              <div className={styles.caseSectionHeading}><span>03</span><div><p>Attendance and leave</p><h2>Make the current state and next action visible in exception-heavy workflows.</h2></div></div>
              <div className={styles.caseTwoColumns}>
                <p>Attendance is more than a check-in time. The interface also needs to communicate breaks, overtime, missing punches, regularisation and approval status.</p>
                <p>Leave follows a similar pattern. Employees submit a request with context, while managers need a review view that shows dates, balance, reason and a clear decision.</p>
              </div>
              <div className={styles.caseDecision}>
                <div><span>Decision</span><p>Keep summary counts, detailed records and approval actions in the same operational context.</p></div>
                <div><span>Reason</span><p>Managers need to understand the exception before approving, rejecting or requesting a correction.</p></div>
                <div><span>Trade-off</span><p>The screens remain data-heavy, so hierarchy and status consistency carry more value than decorative simplification.</p></div>
              </div>
              <Evidence
                title="Attendance exceptions and leave decisions"
                note="Real HR screens showing overview, regularisation and leave approval. The interface keeps employee context close to the decision."
                images={[
                  { src: "/hcm-assets/hr-attendance-overview.jpg", alt: "Attendance overview with status summaries and employee records", label: "Attendance overview" },
                  { src: "/hcm-assets/hr-attendance-regularization.jpg", alt: "Attendance regularisation form with recorded and requested times", label: "Attendance regularisation" },
                  { src: "/hcm-assets/hr-leave-approval.jpg", alt: "Employee leave list with approve and reject actions", label: "Leave approval" },
                ]}
              />
            </motion.section>

            <motion.section className={`${styles.caseStudySection} ${styles.hcmVmsSection}`} id="visitors" {...reveal}>
              <div className={styles.caseSectionHeading}><span>04</span><div><p>Visitor management</p><h2>Coordinate one visitor lifecycle across four roles.</h2></div></div>
              <p className={styles.caseSectionIntro}>The visitor record changes owner as the visit progresses. The Host creates the invitation. Admin users manage company-level records. Security verifies arrival and completes check-in. Super Admin users review platform activity.</p>
              <div className={styles.hcmRoleMap}>
                {visitorRoles.map(([role, action, detail]) => (
                  <div key={role}><span>{action}</span><b>{role}</b><p>{detail}</p></div>
                ))}
              </div>
              <div className={styles.hcmVisitorRail}>
                <div><span>01</span><b>Invite</b><p>Host adds visitor and visit details</p></div>
                <i>→</i>
                <div><span>02</span><b>Share pass</b><p>Visitor receives QR or numeric code</p></div>
                <i>→</i>
                <div><span>03</span><b>Verify</b><p>Security scans or searches manually</p></div>
                <i>→</i>
                <div><span>04</span><b>Check in</b><p>Guests and assets are recorded</p></div>
                <i>→</i>
                <div><span>05</span><b>Check out</b><p>The visit is completed and logged</p></div>
              </div>
              <Evidence
                mobile
                tone="vms"
                title="Host invitation and visitor pass"
                note="Real mobile screens. The Host can review daily visits, create an invitation and share a scannable pass."
                images={[
                  { src: "/hcm-assets/vms-host-dashboard-mobile.png", alt: "Host dashboard with upcoming, completed and pending visitors", label: "Host dashboard", format: "mobile" },
                  { src: "/hcm-assets/vms-host-invite-mobile.png", alt: "Host visitor invitation details", label: "Invite visitor", format: "mobile" },
                  { src: "/hcm-assets/vms-host-qr-mobile.png", alt: "Visitor invitation QR and numeric code", label: "Visitor pass", format: "mobile" },
                ]}
              />
            </motion.section>

            <motion.section className={`${styles.caseStudySection} ${styles.hcmVmsSection}`} id="front-desk" {...reveal}>
              <div className={styles.caseSectionHeading}><span>05</span><div><p>Front desk operations</p><h2>Support QR speed without making the workflow depend on QR alone.</h2></div></div>
              <div className={styles.caseTwoColumns}>
                <p>Security can scan a visitor pass for a fast lookup. A numeric code and manual visitor search remain available when the pass cannot be scanned or the visitor arrives without it.</p>
                <p>Before check-in, the flow captures accompanying guests and carried assets. Check-out closes the visit and preserves the record for history, reports and operational review.</p>
              </div>
              <div className={styles.hcmFallback}>
                <div><span>Primary path</span><b>Scan QR</b><p>Identify the invitation and open the visitor record.</p></div>
                <i>or</i>
                <div><span>Fallback</span><b>Enter code or search</b><p>Continue when scanning is unavailable.</p></div>
                <i>then</i>
                <div><span>Operational record</span><b>Guests, assets and status</b><p>Complete check-in with the required context.</p></div>
              </div>
              <Evidence
                mobile
                tone="vms"
                title="Security verification and visit completion"
                note="Real mobile screens. The sequence covers dashboard actions, QR scanning, check-in details and check-out."
                images={[
                  { src: "/hcm-assets/vms-security-dashboard-mobile.png", alt: "Security dashboard with scan, check-in, check-out and log actions", label: "Security dashboard", format: "mobile" },
                  { src: "/hcm-assets/vms-security-scan-mobile.png", alt: "QR scanner with numeric code fallback", label: "Scan or enter code", format: "mobile" },
                  { src: "/hcm-assets/vms-security-checkin-mobile.png", alt: "Successful visitor check-in with guests and assets", label: "Check-in record", format: "mobile" },
                  { src: "/hcm-assets/vms-security-checkout-mobile.png", alt: "Visitor detail used for check-out", label: "Check-out record", format: "mobile" },
                ]}
              />
              <Evidence
                tone="vms"
                title="Administrative control and communication tracking"
                note="Real web screens. Company and Super Admin dashboards summarise activity, while the tracker records SMS and WhatsApp usage."
                images={[
                  { src: "/hcm-assets/vms-company-dashboard.png", alt: "Company Admin dashboard for visitor operations", label: "Company Admin workspace" },
                  { src: "/hcm-assets/vms-super-dashboard.png", alt: "Super Admin dashboard for company activity", label: "Super Admin workspace" },
                  { src: "/hcm-assets/vms-message-tracker.png", alt: "SMS and WhatsApp credit and usage tracker", label: "Communication tracker" },
                ]}
              />
            </motion.section>

            <motion.section className={styles.caseStudySection} id="patterns" {...reveal}>
              <div className={styles.caseSectionHeading}><span>06</span><div><p>Shared visual patterns</p><h2>Use the same interaction language while keeping each product recognisable.</h2></div></div>
              <div className={styles.hcmPatternGrid}>
                <article><span>01</span><h3>Role-based dashboards</h3><p>Cards and widgets surface the modules and daily actions relevant to the signed-in role.</p></article>
                <article><span>02</span><h3>Operational status</h3><p>Counts, labels and record states help users understand what needs attention.</p></article>
                <article><span>03</span><h3>Review in context</h3><p>Drawers and modals keep supporting details close to approval or update actions.</p></article>
                <article><span>04</span><h3>Web and mobile continuity</h3><p>Desktop supports broad monitoring. Mobile keeps focused actions available at the point of work.</p></article>
              </div>
              <div className={styles.hcmBoundary}><b>Scope boundary</b><p>The two products share HCM Café branding and visual patterns. A shared backend, component library or direct data integration was not verified, so this case study does not claim one.</p></div>
            </motion.section>

            <motion.section className={`${styles.caseStudySection} ${styles.hcmReflection}`} id="reflection" {...reveal}>
              <div className={styles.caseSectionHeading}><span>07</span><div><p>Reflection</p><h2>The strongest design decision is making ownership visible at every operational hand-off.</h2></div></div>
              <div className={styles.hcmReflectionGrid}>
                <div><span>What the work demonstrates</span><h3>Role-aware enterprise product design</h3><p>The designs cover configuration, dashboards, exceptions, approvals, invitations, front-desk operations, communication tracking and mobile task flows.</p></div>
                <div><span>What I would validate next</span><h3>Exceptions and real-world front-desk pressure</h3><p>I would test attendance corrections, leave decisions, failed QR scans, walk-in visitors, multiple guests and asset reconciliation with the people handling those tasks.</p></div>
              </div>
              <div className={styles.caseOutcomeBoundary}><b>Outcome boundary</b><p>Formal usability findings, product adoption and business metrics were not available for this case study. The documented outcome is the design coverage and the operational logic visible in the product files.</p></div>
              <footer className={styles.pcNextProject}><span>Portfolio</span><Link href="/">Return to all projects →</Link></footer>
            </motion.section>
          </article>
        </section>
      </div>
    </main>
  );
}
