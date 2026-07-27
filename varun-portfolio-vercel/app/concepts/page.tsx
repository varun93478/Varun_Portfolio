import Link from "next/link";
import styles from "./concepts.module.css";

const concepts = [
  { href: "/concepts/editorial", no: "01", title: "Editorial Blueprint", note: "Clean, bold and easy to scan." },
  { href: "/concepts/console", no: "02", title: "Industrial Systems Console", note: "Technical, structured and enterprise focused." },
  { href: "/concepts/atlas", no: "03", title: "Playable Systems Atlas", note: "Tactile, interactive and more distinctive." },
  { href: "/concepts/studio", no: "04", title: "Design Workspace", note: "Professional, spatial and built around a designer's working canvas." },
];

export default function ConceptsPage() {
  return (
    <main className={styles.consolePage}>
      <header className={styles.previewNav}>
        <Link className={styles.previewBrand} href="/">Varun J</Link>
        <Link href="/">Back to current site</Link>
      </header>
      <section className={styles.conceptIndex}>
        <p>Portfolio direction</p>
        <h1>Compare all four live concepts.</h1>
        <div>
          {concepts.map((concept) => (
            <Link href={concept.href} key={concept.no}>
              <span>{concept.no}</span>
              <h2>{concept.title}</h2>
              <p>{concept.note}</p>
              <b>Open live concept →</b>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
