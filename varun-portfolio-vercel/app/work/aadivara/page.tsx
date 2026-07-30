"use client";
/* eslint-disable @next/next/no-img-element -- Product evidence must keep its original screenshot pixels. */

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { PortfolioLinks } from "../../concepts/PortfolioLinks";
import { WorkspaceTabs } from "../../concepts/WorkspaceTabs";
import styles from "../../concepts/concepts.module.css";
import { ArtifactDisclosure, FlowComparison, StateCoverageMatrix } from "../case-study-story";
import { useActiveSection } from "../useActiveSection";

const chapters = [
  ["overview", "Overview"],
  ["candidate", "Candidate access"],
  ["operations", "Event operations"],
  ["employer", "Employer workflow"],
  ["offline", "Offline check-in"],
  ["reflection", "Outcome and reflection"],
] as const;

const chapterIds = chapters.map(([id]) => id);

const roles = [
  ["Candidate", "Mobile", "Profile, jobs and interview access"],
  ["Aadivara Admin", "Web", "Events, mappings, outcomes and reporting"],
  ["Employer", "Web", "Jobs, candidates and interview queues"],
  ["Partner", "Web", "Organisation and user management"],
  ["Volunteer", "Offline web", "Check-in, assistance and slip printing"],
];

function Evidence({
  title,
  note,
  images,
  mobile = false,
}: {
  title: string;
  note: string;
  images: { src: string; alt: string; label: string }[];
  mobile?: boolean;
}) {
  return (
    <figure className={`${styles.aadEvidence} ${mobile ? styles.aadEvidenceMobile : ""}`}>
      <header><span>Product evidence</span><b>{title}</b></header>
      <div>
        {images.map((image) => (
          <a
            href={image.src}
            target="_blank"
            rel="noreferrer"
            aria-label={`${image.label}. Open full-size image in a new tab.`}
            key={image.src}
          >
            <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
            <span>{image.label}</span>
          </a>
        ))}
      </div>
      <figcaption>{note}</figcaption>
    </figure>
  );
}

export default function AadivaraCaseStudy() {
  const reducedMotion = useReducedMotion();
  const { activeSection, selectSection } = useActiveSection(chapterIds, "overview");
  const reveal = {
    initial: reducedMotion ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
  };

  return (
    <main className={`${styles.previewPage} ${styles.studioPage} ${styles.caseWorkspacePage} ${styles.aadPage}`}>
      <header className={styles.studioToolbar}>
        <Link className={styles.studioBrand} href="/">Varun J</Link>
        <WorkspaceTabs />
        <div className={styles.caseToolbarActions}><span>Case study</span><Link href="/">Portfolio</Link><PortfolioLinks /></div>
      </header>

      <nav className={styles.caseMobileSectionNav} aria-label="Aadivara sections">
        <label htmlFor="aadivara-section">Section</label>
        <select id="aadivara-section" value={activeSection} onChange={(event) => selectSection(event.target.value as (typeof chapterIds)[number])}>
          {chapters.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </nav>

      <div className={`${styles.studioWorkspace} ${styles.caseWorkspace}`}>
        <aside className={styles.studioLeft} aria-label="Aadivara case study navigation">
          <nav className={styles.studioPrimaryNav}>
            <Link href="/"><span>⌂</span><span>Portfolio</span></Link>
            <a className={styles.studioPrimaryActive} href="#overview"><span>▤</span><span>Case study</span></a>
          </nav>
          <div className={styles.studioProjectTree}>
            <p>Aadivara</p>
            <div className={styles.caseSectionLinks}>
              {chapters.map(([id, label], index) => (
                <a
                  className={activeSection === id ? styles.studioTreeActive : ""}
                  href={`#${id}`}
                  aria-current={activeSection === id ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    selectSection(id);
                  }}
                  key={id}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>{label}
                </a>
              ))}
            </div>
            <p className={styles.casePortalLabel}>Platforms</p>
            <div className={styles.casePortalList}>
              <span>◉ Candidate mobile app</span>
              <span>▣ Operations web portals</span>
              <span>↻ Offline volunteer app</span>
            </div>
          </div>
        </aside>

        <section className={styles.caseStudyCanvas} aria-label="Aadivara case study" data-case-scroll>
          <article className={styles.caseStudyDocument}>
            <section className={`${styles.caseStudyHero} ${styles.aadHero}`} id="overview">
              <div className={styles.caseStudyKicker}><span>Aadivara</span><b>Product case study</b></div>
              <h1>Connecting accessible candidate journeys with event-day operations.</h1>
              <p className={styles.caseStudyLead}>Aadivara supports employment events for people with disabilities. The product connects candidates, administrators, employers, partners and volunteers across mobile, web and offline-capable workflows.</p>
              <dl className={styles.caseStudyMeta}>
                <div><dt>Role</dt><dd>UI/UX Designer</dd></div>
                <div><dt>Contribution</dt><dd>UX, interaction and UI design</dd></div>
                <div><dt>Platforms</dt><dd>Mobile + web + offline web</dd></div>
                <div><dt>Team</dt><dd>Crecientech + ATF</dd></div>
              </dl>
              <div className={styles.aadRoleMap}>
                {roles.map(([role, platform, task]) => <div key={role}><span>{platform}</span><b>{role}</b><p>{task}</p></div>)}
              </div>
            </section>

            <motion.section className={styles.caseStudySection} id="candidate" {...reveal}>
              <div className={styles.caseSectionHeading}><span>01</span><div><p>Candidate access</p><h2>Collect the right information without making the journey feel heavy.</h2></div></div>
              <div className={styles.caseTwoColumns}>
                <p>Candidate registration needed personal, location, disability, skill and job-preference information. The flow was divided into understandable steps so candidates could focus on one decision at a time.</p>
                <p>The mobile experience used clear labels, large controls, visible progress and direct confirmation. Accessibility details were treated as essential profile data, not an optional afterthought.</p>
              </div>
              <div className={styles.caseDecision}>
                <div><span>Design decision</span><p>Break registration into short, labelled steps with reviewable profile sections.</p></div>
                <div><span>Why</span><p>Reduce cognitive load while still collecting information required for relevant job matching.</p></div>
                <div><span>Accessibility</span><p>Readable hierarchy, clear labels and touch-friendly actions; shipped behaviour should be verified screen by screen.</p></div>
              </div>
              <Evidence mobile title="Candidate registration and profile" note="Real mobile designs from the project. Personal information is shown only as representative interface content." images={[
                { src: "/aadivara-assets/candidate-create-account.png", alt: "Aadivara candidate create-account screen", label: "Create account" },
                { src: "/aadivara-assets/candidate-disability.png", alt: "Aadivara disability details screen", label: "Disability details" },
                { src: "/aadivara-assets/candidate-home.png", alt: "Aadivara candidate home screen", label: "Candidate home" },
                { src: "/aadivara-assets/candidate-profile.png", alt: "Aadivara candidate profile screen", label: "Profile" },
              ]} />
            </motion.section>

            <motion.section className={styles.caseStudySection} id="operations" {...reveal}>
              <div className={styles.caseSectionHeading}><span>02</span><div><p>Admin orchestration</p><h2>Turn an event into a coordinated operating system.</h2></div></div>
              <p className={styles.caseSectionIntro}>The Admin layer connects candidate records, employers, jobs, rooms and event outcomes. Event Coordinator is treated as an Admin permission rather than a separate primary role because no separate login was confirmed.</p>
              <div className={styles.aadOpsFlow}>
                <div><b>Event setup</b><span>Employers + jobs</span></div><i>→</i>
                <div><b>Operational mapping</b><span>Companies + rooms</span></div><i>→</i>
                <div><b>Event day</b><span>Queue + check-in</span></div><i>→</i>
                <div><b>Outcome</b><span>Selected / Rejected</span></div>
              </div>
              <Evidence title="Admin and employer-facing records" note="Real project screens. The wider room-mapping and outcome logic is documented as part of the operational model, without claiming unverified production states." images={[
                { src: "/aadivara-assets/admin-job-list.png", alt: "Aadivara Admin job list", label: "Admin job management" },
                { src: "/aadivara-assets/employer-dashboard.png", alt: "Aadivara employer dashboard", label: "Employer dashboard" },
              ]} />
            </motion.section>

            <motion.section className={styles.caseStudySection} id="employer" {...reveal}>
              <div className={styles.caseSectionHeading}><span>03</span><div><p>Employer operations</p><h2>Keep job setup and interview progress clear.</h2></div></div>
              <div className={styles.caseTwoColumns}>
                <p>Employers create and manage jobs, review candidates and progress the interview queue. The interface supports the operational difference between a candidate being interviewed and the employer waiting for the next person.</p>
                <p>Final Selected or Rejected outcomes remain Admin-owned. This avoids blurring role ownership between interview operations and the event’s official candidate record.</p>
              </div>
              <Evidence title="Employer job workflow" note="Real web screens showing employer job management. Queue behaviour is described from the confirmed product workflow." images={[
                { src: "/aadivara-assets/employer-job-list.png", alt: "Aadivara employer job list", label: "Job list" },
                { src: "/aadivara-assets/employer-job-detail.png", alt: "Aadivara employer job details", label: "Job details" },
              ]} />
            </motion.section>

            <motion.section className={styles.caseStudySection} id="offline" {...reveal}>
              <div className={styles.caseSectionHeading}><span>04</span><div><p>Volunteer operations</p><h2>Check-in had to continue even when connectivity did not.</h2></div></div>
              <p className={styles.caseSectionIntro}>Volunteers support candidates through QR or manual check-in, confirm mappings and print a compact slip for event navigation. Offline updates are queued locally and sync automatically when the connection returns.</p>
              <div className={styles.aadOfflineStates}>
                <div><span>01</span><b>Scan or search</b><p>QR check-in with a manual fallback.</p></div>
                <div><span>02</span><b>Confirm candidate</b><p>Verify identity and event mapping.</p></div>
                <div><span>03</span><b>Print guidance</b><p>Generate a 58 mm or 80 mm slip.</p></div>
                <div><span>04</span><b>Sync safely</b><p>Automatic retry with visible status.</p></div>
              </div>
              <ArtifactDisclosure
                kind="Service flow + recovery states"
                title="Designing check-in for unreliable connectivity"
                summary="See how the primary, fallback and recovery paths support event-day continuity."
              >
                <FlowComparison
                  before={["Attempt QR scan", "Lose connectivity", "Stop check-in", "Wait or use an external workaround"]}
                  after={["Scan QR or search manually", "Confirm locally", "Print event guidance", "Queue the update", "Sync with visible recovery status"]}
                />
                <StateCoverageMatrix items={[
                  { state: "Online", cue: "Synced", purpose: "Confirms the record is available to event operations.", tone: "positive" },
                  { state: "Offline", cue: "Saved on device", purpose: "Lets the volunteer continue without losing the check-in.", tone: "warning" },
                  { state: "Pending", cue: "Waiting to sync", purpose: "Makes unfinished system work visible.", tone: "progress" },
                  { state: "Conflict", cue: "Review required", purpose: "Prevents a local update from silently overwriting a newer record.", tone: "warning" },
                  { state: "Recovered", cue: "Sync complete", purpose: "Closes the loop when connectivity returns.", tone: "positive" },
                ]} />
              </ArtifactDisclosure>
              <Evidence title="Volunteer offline flow" note="Real design board showing the offline-capable volunteer journey and printed-slip workflow." images={[
                { src: "/aadivara-assets/volunteer-flow.png", alt: "Aadivara volunteer offline check-in flow", label: "Offline check-in and slip printing" },
              ]} />
            </motion.section>

            <motion.section className={styles.caseStudySection} id="reflection" {...reveal}>
              <div className={styles.caseSectionHeading}><span>05</span><div><p>System layer</p><h2>Partner management supports the network behind the event.</h2></div></div>
              <Evidence title="Partner organisation management" note="Real web screens showing employee and sub-organisation management." images={[
                { src: "/aadivara-assets/partner-employees.png", alt: "Partner employee management", label: "Employee management" },
                { src: "/aadivara-assets/partner-suborgs.png", alt: "Partner sub-organisation management", label: "Sub-organisations" },
              ]} />
              <div className={styles.aadReflection}>
                <div><span>What was delivered</span><h3>A connected multi-role product model</h3><p>The work established mobile and web experiences across candidate access, job management, partner administration and volunteer event operations.</p></div>
                <div><span>What I would improve next</span><h3>Validate accessibility and offline recovery in the field</h3><p>I would run screen-reader, keyboard and event-day usability testing, then measure completion, check-in time, sync failures and manual recovery.</p></div>
              </div>
              <div className={styles.caseOutcomeBoundary}><b>Outcome boundary</b><p>No adoption or efficiency metrics were available for this case study. The portfolio separates delivered design work from the improvements that should be measured next.</p></div>
              <footer className={styles.aadNextProject}><span>Previous project</span><Link href="/work/harbinger">Harbinger Motors →</Link></footer>
            </motion.section>
          </article>
        </section>
      </div>
    </main>
  );
}
