"use client";
/* eslint-disable @next/next/no-img-element -- Product evidence must keep its original screenshot pixels. */

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { PortfolioLinks } from "../../concepts/PortfolioLinks";
import { WorkspaceTabs } from "../../concepts/WorkspaceTabs";
import styles from "../../concepts/concepts.module.css";
import { useActiveSection } from "../useActiveSection";

const chapters = [
  ["overview", "Overview"],
  ["roles", "Product model"],
  ["onboarding", "Franchise onboarding"],
  ["property", "Post a property"],
  ["requirements", "Property requirements"],
  ["discovery", "Discovery and enquiry"],
  ["continuity", "Web and mobile"],
  ["reflection", "Reflection"],
] as const;

const chapterIds = chapters.map(([id]) => id);

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
}: {
  title: string;
  note: string;
  images: EvidenceItem[];
  mobile?: boolean;
}) {
  return (
    <figure className={`${styles.pcEvidence} ${mobile ? styles.pcEvidenceMobile : ""}`}>
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

const roles = [
  ["Property seeker", "Discover", "Search, compare, save and enquire about properties"],
  ["Property owner", "Publish", "Post a property and manage its information and status"],
  ["Franchise user", "Operate", "Complete onboarding and manage property activity"],
  ["Platform admin", "Review", "Review franchise accounts, documents and account status"],
];

export default function PropertyCareCaseStudy() {
  const reducedMotion = useReducedMotion();
  const { activeSection, selectSection } = useActiveSection(chapterIds, "overview");
  const reveal = {
    initial: reducedMotion ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
  };

  return (
    <main className={`${styles.previewPage} ${styles.studioPage} ${styles.caseWorkspacePage} ${styles.pcPage}`}>
      <header className={styles.studioToolbar}>
        <Link className={styles.studioBrand} href="/">Varun J</Link>
        <WorkspaceTabs />
        <div className={styles.caseToolbarActions}><span>Case study</span><Link href="/">Portfolio</Link><PortfolioLinks /></div>
      </header>

      <nav className={styles.caseMobileSectionNav} aria-label="Property Care sections">
        <label htmlFor="property-care-section">Section</label>
        <select id="property-care-section" value={activeSection} onChange={(event) => selectSection(event.target.value as (typeof chapterIds)[number])}>
          {chapters.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </nav>

      <div className={`${styles.studioWorkspace} ${styles.caseWorkspace}`}>
        <aside className={styles.studioLeft} aria-label="Property Care case study navigation">
          <nav className={styles.studioPrimaryNav}>
            <Link href="/"><span>⌂</span><span>Portfolio</span></Link>
            <a className={styles.studioPrimaryActive} href="#overview"><span>▤</span><span>Case study</span></a>
          </nav>
          <div className={styles.studioProjectTree}>
            <p>Property Care</p>
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
              <span>▣ Web platform</span>
              <span>◉ Mobile application</span>
              <span>⌁ Phase 2 design</span>
            </div>
          </div>
        </aside>

        <section className={styles.caseStudyCanvas} aria-label="Property Care case study" data-case-scroll>
          <article className={styles.caseStudyDocument}>
            <section className={`${styles.caseStudyHero} ${styles.pcHero}`} id="overview">
              <div className={styles.caseStudyKicker}><span>Property Care</span><b>Product case study</b></div>
              <h1>Connecting property discovery with the work required to publish and manage it.</h1>
              <p className={styles.caseStudyLead}>Property Care supports customers looking for properties, owners posting them, franchise teams managing activity and admins reviewing accounts. The Phase 2 design covered the workflow before and after a property appears in search.</p>
              <dl className={styles.caseStudyMeta}>
                <div><dt>Role</dt><dd>UI/UX Designer</dd></div>
                <div><dt>Contribution</dt><dd>Web and mobile UI, forms, states and workflows</dd></div>
                <div><dt>Platforms</dt><dd>Responsive web + mobile</dd></div>
                <div><dt>Scope</dt><dd>Phase 2 product design</dd></div>
              </dl>
              <div className={styles.pcHeroComposition}>
                <img src="/property-care-assets/property-list.png" alt="Property Care map and property listing interface" loading="eager" decoding="async" />
                <img src="/property-care-assets/property-posted-mobile.png" alt="Property Care mobile property posted confirmation" loading="eager" decoding="async" />
                <div><span>Connected workflow</span><b>Onboard → Publish → Discover → Enquire</b></div>
              </div>
            </section>

            <motion.section className={styles.caseStudySection} id="roles" {...reveal}>
              <div className={styles.caseSectionHeading}><span>01</span><div><p>Product model</p><h2>The same property record supports different decisions.</h2></div></div>
              <div className={styles.caseTwoColumns}>
                <p>A property seeker needs relevant results and enough detail to enquire. An owner or franchise user needs a structured way to post accurate information. The admin needs the context required to review accounts and manage operational states.</p>
                <p>The interface changes by role, but the underlying property, requirement, enquiry and account records stay connected. This relationship shaped the navigation, form steps and status patterns across web and mobile.</p>
              </div>
              <div className={styles.pcRoleMap}>
                {roles.map(([role, action, detail]) => (
                  <div key={role}><span>{action}</span><b>{role}</b><p>{detail}</p></div>
                ))}
              </div>
              <div className={styles.pcSystemRail}>
                <div><span>Supply</span><b>Properties</b></div>
                <i>↔</i>
                <div><span>Demand</span><b>Requirements</b></div>
                <i>→</i>
                <div><span>Action</span><b>Enquiries and requests</b></div>
              </div>
            </motion.section>

            <motion.section className={styles.caseStudySection} id="onboarding" {...reveal}>
              <div className={styles.caseSectionHeading}><span>02</span><div><p>Franchise onboarding</p><h2>Collect business information without turning onboarding into one long form.</h2></div></div>
              <p className={styles.caseSectionIntro}>The franchise flow divides business details, contact information and supporting documents into three steps. A separate admin view then brings those records together for review and status updates.</p>
              <div className={styles.pcFlowRail}>
                <div><span>01</span><b>Franchise info</b><p>Contract, service and location details</p></div>
                <i>→</i>
                <div><span>02</span><b>Contact info</b><p>Primary and additional contacts</p></div>
                <i>→</i>
                <div><span>03</span><b>Documents</b><p>Required evidence before submission</p></div>
                <i>→</i>
                <div><span>04</span><b>Admin review</b><p>Approve, reject or keep the account on hold</p></div>
              </div>
              <Evidence
                title="Franchise setup and review"
                note="Real Phase 2 screens. The flow separates onboarding input from the admin review queue."
                images={[
                  { src: "/property-care-assets/franchise-onboarding.png", alt: "Create Franchise first step with contract and location details", label: "Franchise information" },
                  { src: "/property-care-assets/franchise-documents.png", alt: "Create Franchise attachment step", label: "Required documents" },
                  { src: "/property-care-assets/franchise-requests.png", alt: "Admin list of franchise onboarding requests and statuses", label: "Admin review queue" },
                ]}
              />
            </motion.section>

            <motion.section className={styles.caseStudySection} id="property" {...reveal}>
              <div className={styles.caseSectionHeading}><span>03</span><div><p>Post a property</p><h2>Structure a detailed property record through progressive steps.</h2></div></div>
              <div className={styles.caseTwoColumns}>
                <p>Posting a property requires category, service type, contact details, location, specifications, amenities and media. Showing every field together would make it difficult to understand what is complete and what still needs attention.</p>
                <p>The step-based structure groups related information and keeps the current stage visible. Longer specification screens stay focused on one decision area while Back and Next preserve the larger workflow.</p>
              </div>
              <div className={styles.caseDecision}>
                <div><span>Decision</span><p>Group fields by the way users describe a property, rather than by database structure.</p></div>
                <div><span>Reason</span><p>Property type, location, specifications, amenities and media require different kinds of input.</p></div>
                <div><span>Trade-off</span><p>The flow takes more steps, but each step is easier to review and correct.</p></div>
              </div>
              <Evidence
                title="Property posting flow"
                note="Real screens from the eight-step property posting flow. Full-size images open in a separate tab."
                images={[
                  { src: "/property-care-assets/post-property-type.png", alt: "Post Property basic information step", label: "1 of 8 · Basic information" },
                  { src: "/property-care-assets/post-property-details.png", alt: "Post Property specifications and details step", label: "Property details" },
                  { src: "/property-care-assets/post-property-amenities.png", alt: "Post Property amenities step", label: "7 of 8 · Amenities" },
                ]}
              />
            </motion.section>

            <motion.section className={styles.caseStudySection} id="requirements" {...reveal}>
              <div className={styles.caseSectionHeading}><span>04</span><div><p>Property requirements</p><h2>Capture demand in a format the property catalogue can use.</h2></div></div>
              <p className={styles.caseSectionIntro}>Customers can describe the property they need through category, service type, budget, furnishing, urgency and contact details. Structured requirements create a clearer basis for suggested properties and follow-up.</p>
              <div className={styles.pcRequirementLogic}>
                <div><span>Need</span><b>Property category and service</b><p>Rent, lease or buy</p></div>
                <i>+</i>
                <div><span>Fit</span><b>Budget and property attributes</b><p>Rooms, furnishing and location</p></div>
                <i>+</i>
                <div><span>Follow-up</span><b>Contact and urgency</b><p>Who to contact and when</p></div>
              </div>
              <Evidence
                title="Post a requirement"
                note="Real requirement screens showing the split between property criteria and contact information."
                images={[
                  { src: "/property-care-assets/post-requirement-basics.png", alt: "Post Requirement basic information", label: "Requirement criteria" },
                  { src: "/property-care-assets/post-requirement-contact.png", alt: "Post Requirement additional and contact information", label: "Contact and urgency" },
                ]}
              />
            </motion.section>

            <motion.section className={styles.caseStudySection} id="discovery" {...reveal}>
              <div className={styles.caseSectionHeading}><span>05</span><div><p>Discovery and enquiry</p><h2>Keep search context visible while users compare properties.</h2></div></div>
              <div className={styles.caseTwoColumns}>
                <p>The discovery experience combines map context, filters and listing results. Users can move from an area-level view to property details without losing the criteria used to find it.</p>
                <p>The detail screen brings images, specifications, pricing, contact context and the enquiry action together. Favourites provide a lighter commitment before a user is ready to contact someone.</p>
              </div>
              <Evidence
                title="Search and property detail"
                note="Real web screens. Search, map context, property detail and enquiry actions remain part of one connected task."
                images={[
                  { src: "/property-care-assets/property-list.png", alt: "Property Care map view with filters and property result list", label: "Map and list discovery" },
                  { src: "/property-care-assets/property-detail.png", alt: "Property Care property detail with enquiry controls", label: "Property detail and enquiry" },
                ]}
              />
            </motion.section>

            <motion.section className={styles.caseStudySection} id="continuity" {...reveal}>
              <div className={styles.caseSectionHeading}><span>06</span><div><p>Web and mobile continuity</p><h2>Show property state clearly on a smaller screen.</h2></div></div>
              <p className={styles.caseSectionIntro}>The mobile experience carries the same property information and publishing states into a narrow layout. Status is shown with a label and related action, rather than relying only on colour.</p>
              <div className={styles.pcStatusRail}>
                <div><span>Draft record</span><b>Pending</b><p>Information is available, but the property is still waiting for the next state.</p></div>
                <div><span>Visible record</span><b>Published</b><p>The property is available through the discovery experience.</p></div>
                <div><span>Confirmation</span><b>Posted</b><p>The user receives a clear completion message after submission.</p></div>
              </div>
              <Evidence
                mobile
                title="Mobile property states"
                note="Real mobile screens. Long details remain available without shrinking the interface into unreadable thumbnails."
                images={[
                  { src: "/property-care-assets/property-pending-mobile.png", alt: "Pending property details on mobile", label: "Pending property", format: "mobile" },
                  { src: "/property-care-assets/property-published-mobile.png", alt: "Published property details on mobile", label: "Published property", format: "mobile" },
                  { src: "/property-care-assets/property-posted-mobile.png", alt: "Property posted confirmation on mobile", label: "Posted confirmation", format: "mobile" },
                ]}
              />
            </motion.section>

            <motion.section className={`${styles.caseStudySection} ${styles.pcReflection}`} id="reflection" {...reveal}>
              <div className={styles.caseSectionHeading}><span>07</span><div><p>Reflection</p><h2>The strongest part of the product is the relationship between supply, demand and operations.</h2></div></div>
              <div className={styles.caseHandoffFlow}>
                <article><span>01</span><h3>Workflow structure</h3><p>Separated onboarding, posting, requirements and discovery into clear tasks.</p></article>
                <article><span>02</span><h3>Cross-platform patterns</h3><p>Carried property details, actions and statuses from web into mobile layouts.</p></article>
                <article><span>03</span><h3>Operational states</h3><p>Designed admin review and property states so the next action remains visible.</p></article>
              </div>
              <div className={styles.pcReflectionGrid}>
                <div><span>What the design covers</span><h3>A connected Phase 2 product workflow</h3><p>The designs cover franchise onboarding, property supply, customer requirements, discovery, enquiries and mobile property states.</p></div>
                <div><span>What I would validate next</span><h3>Where users pause in the longest forms</h3><p>I would test onboarding and property posting separately, then review completion, validation and return-to-draft behaviour with real users.</p></div>
              </div>
              <div className={styles.caseOutcomeBoundary}><b>Outcome boundary</b><p>Verified usability results, adoption metrics and implementation outcomes were not available for this case study. The page documents the Phase 2 design work and the next validation steps without inventing impact.</p></div>
              <footer className={styles.pcNextProject}><span>Next project</span><Link href="/work/hcm-cafe">HCM Café →</Link></footer>
            </motion.section>
          </article>
        </section>
      </div>
    </main>
  );
}
