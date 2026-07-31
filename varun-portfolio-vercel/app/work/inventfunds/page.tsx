"use client";
/* eslint-disable @next/next/no-img-element -- Product evidence must keep its original screenshot pixels. */

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { CaseFileHeader } from "../../concepts/CaseFileHeader";
import { SystemIcon } from "../../components/SystemIcon";
import styles from "../../concepts/concepts.module.css";
import { ArtifactDisclosure, StateCoverageMatrix } from "../case-study-story";
import { useActiveSection } from "../useActiveSection";

const chapters = [
  ["overview", "Overview"],
  ["roles", "Product model"],
  ["founder", "Founder workflow"],
  ["funder", "Funder workflow"],
  ["fixer", "Fixer workflow"],
  ["nda", "Trust and NDA"],
  ["reflection", "Handoff and reflection"],
] as const;

const chapterIds = chapters.map(([id]) => id);

const roles = [
  ["Founder", "Build", "Create projects, define phases and bring collaborators into the work"],
  ["Funder", "Evaluate", "Discover projects, review details and structure investment decisions"],
  ["Fixer", "Contribute", "Build a specialist profile, find opportunities and collaborate securely"],
];

type EvidenceItem = {
  src: string;
  alt: string;
  label: string;
};

function Evidence({
  title,
  note,
  images,
  mobile = false,
}: {
  title: string;
  note: string;
  images: EvidenceItem[];
  mobile?: boolean;
}) {
  return (
    <figure className={`${styles.invEvidence} ${mobile ? styles.invEvidenceMobile : ""}`}>
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
            data-format={image.src.includes("/mobile-") ? "mobile" : "web"}
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

export default function InventFundsCaseStudy() {
  const reducedMotion = useReducedMotion();
  const { activeSection, selectSection } = useActiveSection(chapterIds, "overview");
  const reveal = {
    initial: reducedMotion ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
  };

  return (
    <main className={`${styles.previewPage} ${styles.studioPage} ${styles.caseWorkspacePage} ${styles.invPage}`}>
      <CaseFileHeader fileName="InventFunds.fig"><span className={styles.caseViewActive}>Case study</span></CaseFileHeader>

      <nav className={styles.caseMobileSectionNav} aria-label="InventFunds sections">
        <label htmlFor="inventfunds-section">Section</label>
        <select id="inventfunds-section" value={activeSection} onChange={(event) => selectSection(event.target.value as (typeof chapterIds)[number])}>
          {chapters.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </nav>

      <div className={`${styles.studioWorkspace} ${styles.caseWorkspace}`}>
        <aside className={styles.studioLeft} aria-label="InventFunds case study navigation">
          <div className={styles.casePanelHeading}>
            <strong>Contents</strong>
            <span>InventFunds.fig</span>
          </div>
          <nav className={styles.studioPrimaryNav}>
            <Link href="/"><SystemIcon name="home" /><span>Desktop</span></Link>
            <a className={styles.studioPrimaryActive} href="#overview"><SystemIcon name="file" /><span>Case study</span></a>
          </nav>
          <div className={styles.studioProjectTree}>
            <p>InventFunds</p>
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
              <span><SystemIcon name="monitor" />Web product</span>
              <span><SystemIcon name="mobile" />Mobile application</span>
              <span><SystemIcon name="code" />Angular + Ionic</span>
            </div>
          </div>
        </aside>

        <section className={styles.caseStudyCanvas} aria-label="InventFunds case study" data-case-scroll>
          <article className={styles.caseStudyDocument}>
            <section className={`${styles.caseStudyHero} ${styles.invHero}`} id="overview">
              <div className={styles.caseStudyKicker}><span>InventFunds</span><b>Product case study</b></div>
              <h1>Connecting people who build ideas, fund them and help deliver the work.</h1>
              <p className={styles.caseStudyLead}>InventFunds brings Founder, Funder and Fixer workflows into one product. The design had to support project creation, discovery, evaluation, collaboration and NDA management across web and mobile.</p>
              <dl className={styles.caseStudyMeta}>
                <div><dt>Role</dt><dd>UI/UX Designer</dd></div>
                <div><dt>Contribution</dt><dd>Product UI, states and implementation review</dd></div>
                <div><dt>Platforms</dt><dd>Responsive web + mobile</dd></div>
                <div><dt>Implementation</dt><dd>Angular + Ionic collaboration</dd></div>
              </dl>
              <div className={styles.invSystemMap}>
                {roles.map(([role, action, task]) => (
                  <div key={role}><span>{action}</span><b>{role}</b><p>{task}</p></div>
                ))}
              </div>
              <Evidence
                title="Funder dashboard"
                note="Real interface from the project. Financial values and user details shown in the screen are representative."
                images={[
                  { src: "/inventfunds-assets/web-funder-dashboard.png", alt: "InventFunds Funder dashboard showing portfolio and project information", label: "Role-specific dashboard" },
                ]}
              />
            </section>

            <motion.section className={styles.caseStudySection} id="roles" {...reveal}>
              <div className={styles.caseSectionHeading}><span>01</span><div><p>Product model</p><h2>Three roles enter the product with different goals.</h2></div></div>
              <div className={styles.caseTwoColumns}>
                <p>Founders need to turn an idea into a structured project. Funders need enough information to compare opportunities and make a decision. Fixers need to show their expertise and find work where they can contribute.</p>
                <p>The product could not use one generic dashboard for every user. Navigation, information priority and actions had to change with the selected role while shared project records remained connected.</p>
              </div>
              <div className={styles.invRoleDecision}>
                <div><span>Shared layer</span><b>Projects, people and files</b><p>Common records connect work across roles.</p></div>
                <div><span>Role layer</span><b>Different decisions</b><p>Each dashboard prioritises the next action for that role.</p></div>
                <div><span>Trust layer</span><b>NDA and permissions</b><p>Access changes as collaboration becomes formal.</p></div>
              </div>
              <Evidence
                mobile
                title="Role selection and Fixer profile"
                note="Real mobile screens showing how the product establishes a role before collecting role-specific information."
                images={[
                  { src: "/inventfunds-assets/mobile-role-selection.png", alt: "InventFunds mobile role selection for Founder, Funder and Fixer", label: "Select a role" },
                  { src: "/inventfunds-assets/mobile-fixer-profile.png", alt: "InventFunds Fixer profile showing skills and experience", label: "Fixer profile" },
                ]}
              />
            </motion.section>

            <motion.section className={styles.caseStudySection} id="founder" {...reveal}>
              <div className={styles.caseSectionHeading}><span>02</span><div><p>Founder workflow</p><h2>Turn an early idea into work that other people can understand.</h2></div></div>
              <p className={styles.caseSectionIntro}>The Founder flow progressively structures a project through details, phases, team access and collaboration terms. This keeps the initial setup manageable while creating enough context for Funders and Fixers later.</p>
              <div className={styles.invFlowRail}>
                <div><span>01</span><b>Define</b><p>Project basics and purpose</p></div>
                <i>→</i>
                <div><span>02</span><b>Plan</b><p>Phases, files and requirements</p></div>
                <i>→</i>
                <div><span>03</span><b>Invite</b><p>Team members and access</p></div>
                <i>→</i>
                <div><span>04</span><b>Agree</b><p>Terms before collaboration</p></div>
              </div>
              <Evidence
                title="Founder collaboration setup"
                note="Real web screens showing permission assignment and collaboration terms."
                images={[
                  { src: "/inventfunds-assets/web-collaboration-access.png", alt: "InventFunds collaboration process assigning project access", label: "Assign project access" },
                  { src: "/inventfunds-assets/web-collaboration-agreement.png", alt: "InventFunds collaboration agreement review screen", label: "Review collaboration agreement" },
                ]}
              />
            </motion.section>

            <motion.section className={styles.caseStudySection} id="funder" {...reveal}>
              <div className={styles.caseSectionHeading}><span>03</span><div><p>Funder workflow</p><h2>Move from discovery to evaluation without losing project context.</h2></div></div>
              <div className={styles.caseTwoColumns}>
                <p>Funders browse projects, open detailed records and move through a guided evaluation process. The interface keeps project information, people and financial decisions connected instead of spreading them across unrelated screens.</p>
                <p>The investment flow divides a complex decision into clear steps. Funders can review participants, define contribution details and confirm the structure before moving forward.</p>
              </div>
              <Evidence
                title="Discovery and project evaluation"
                note="Real web screens showing project discovery, detail review and the structured investment process."
                images={[
                  { src: "/inventfunds-assets/web-browse-projects.png", alt: "InventFunds Browse Projects screen", label: "Browse projects" },
                  { src: "/inventfunds-assets/web-project-details.png", alt: "InventFunds project details dashboard", label: "Review project details" },
                  { src: "/inventfunds-assets/web-investment-team.png", alt: "InventFunds investment process team selection", label: "Select participants" },
                  { src: "/inventfunds-assets/web-investment-split.png", alt: "InventFunds investment contribution split", label: "Structure the contribution" },
                ]}
              />
            </motion.section>

            <motion.section className={styles.caseStudySection} id="fixer" {...reveal}>
              <div className={styles.caseSectionHeading}><span>04</span><div><p>Fixer workflow</p><h2>Make specialist expertise useful for project matching.</h2></div></div>
              <p className={styles.caseSectionIntro}>Fixers create profiles around expertise, industries and experience. The mobile experience then uses that context to support discovery, saved opportunities, collaboration and communication.</p>
              <div className={styles.caseDecision}>
                <div><span>Decision</span><p>Collect expertise as structured profile information rather than relying only on a free-text bio.</p></div>
                <div><span>Reason</span><p>Structured skills support clearer project discovery and help Founders understand why a Fixer may be relevant.</p></div>
                <div><span>Trade-off</span><p>Detailed onboarding improves matching context, but it increases the effort required before the profile feels complete.</p></div>
              </div>
              <Evidence
                mobile
                title="Fixer dashboard and discovery"
                note="Real mobile screens showing the Fixer workspace and opportunity discovery."
                images={[
                  { src: "/inventfunds-assets/mobile-fixer-dashboard.png", alt: "InventFunds Fixer mobile dashboard", label: "Fixer dashboard" },
                  { src: "/inventfunds-assets/mobile-discover.png", alt: "InventFunds mobile discovery screen", label: "Discover opportunities" },
                ]}
              />
            </motion.section>

            <motion.section className={styles.caseStudySection} id="nda" {...reveal}>
              <div className={styles.caseSectionHeading}><span>05</span><div><p>Trust and NDA</p><h2>Make document status visible before people share sensitive work.</h2></div></div>
              <div className={styles.caseTwoColumns}>
                <p>NDA information originally needed clearer separation by role and status. I worked on role-specific cards, current and past NDA sections, global templates and the empty, loading and error states around them.</p>
                <p>The design treated NDA status as part of the collaboration workflow. Users needed to understand what was active, what required action and which document governed the project before accessing sensitive information.</p>
              </div>
              <div className={styles.invNdaStates}>
                <div><span>Current</span><b>Active project NDAs</b></div>
                <div><span>Action</span><b>Review or sign</b></div>
                <div><span>Reference</span><b>Global NDA template</b></div>
                <div><span>Recovery</span><b>Empty, loading and error states</b></div>
              </div>
              <ArtifactDisclosure
                kind="Trust-state architecture"
                title="The NDA component is a workflow, not a document card"
                summary="Review the state model that controls access, action and recovery."
              >
                <StateCoverageMatrix items={[
                  { state: "Empty", cue: "No NDA exists", purpose: "Explains who can create the agreement and what happens next." },
                  { state: "Draft", cue: "Not shared", purpose: "Keeps incomplete legal context out of the collaboration flow.", tone: "progress" },
                  { state: "Review", cue: "Action required", purpose: "Shows who must read or sign before access changes.", tone: "warning" },
                  { state: "Active", cue: "Access governed", purpose: "Identifies the agreement currently protecting the project.", tone: "positive" },
                  { state: "Expired", cue: "Past agreement", purpose: "Keeps historical context without implying current access.", tone: "restricted" },
                  { state: "Error", cue: "Document unavailable", purpose: "Protects sensitive access and provides a recovery action.", tone: "warning" },
                ]} />
              </ArtifactDisclosure>
              <Evidence
                title="NDA and collaboration communication"
                note="Real web and mobile screens. The case study focuses on visibility and state design rather than legal document content."
                images={[
                  { src: "/inventfunds-assets/web-nda-detail.png", alt: "InventFunds web NDA details and project access screen", label: "NDA detail" },
                  { src: "/inventfunds-assets/web-collaboration-chat.png", alt: "InventFunds project collaboration chat", label: "Project communication" },
                  { src: "/inventfunds-assets/mobile-nda.png", alt: "InventFunds mobile NDA document screen", label: "Mobile NDA access" },
                ]}
              />
            </motion.section>

            <motion.section className={styles.caseStudySection} id="reflection" {...reveal}>
              <div className={styles.caseSectionHeading}><span>06</span><div><p>Handoff and reflection</p><h2>Design decisions continued into implementation review.</h2></div></div>
              <div className={styles.caseHandoffFlow}>
                <article><span>01</span><h3>Design</h3><p>Created role-specific dashboards, workflows, states and responsive interfaces.</p></article>
                <article><span>02</span><h3>Implementation support</h3><p>Worked with the Angular and Ionic structure, reviewed component behaviour and checked UI styling.</p></article>
                <article><span>03</span><h3>Design QA</h3><p>Compared implemented screens with the intended hierarchy, states and responsive behaviour.</p></article>
              </div>
              <div className={styles.invReflection}>
                <div><span>What the work established</span><h3>A connected product model across web and mobile</h3><p>The design covered role-based dashboards, project discovery, investment decisions, collaboration and document access.</p></div>
                <div><span>What I would improve next</span><h3>Validate the longest decisions with real users</h3><p>I would test Founder setup, Funder evaluation and Fixer onboarding separately, then measure where users pause, leave or need support.</p></div>
              </div>
              <div className={styles.caseOutcomeBoundary}><b>Outcome boundary</b><p>Formal usability results, adoption metrics and investment outcomes were not available. This case study documents the delivered design work and the next validation steps without inventing business impact.</p></div>
              <footer className={styles.invNextProject}><span>Explore another project</span><Link href="/work/aadivara">Aadivara <SystemIcon name="arrow-right" size={14} /></Link></footer>
            </motion.section>
          </article>
        </section>
      </div>
    </main>
  );
}
