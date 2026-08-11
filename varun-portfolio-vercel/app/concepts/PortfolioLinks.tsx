import { AppearanceControl } from "../appearance/AppearanceControl";

export function PortfolioLinks() {
  return (
    <>
      <AppearanceControl compact />
      <a href="/VarunJ_Resume.pdf?v=2026-08" download="Varun-J-Resume.pdf">
        Resume
      </a>
      <a href="mailto:varunj93478@gmail.com">Contact</a>
    </>
  );
}
