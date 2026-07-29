import Link from "next/link";

export function PortfolioLinks() {
  return (
    <>
      <a href="/VarunJ_Resume.pdf" download="Varun-J-Resume.pdf">
        Résumé
      </a>
      <Link href="/#contact">Contact</Link>
    </>
  );
}
