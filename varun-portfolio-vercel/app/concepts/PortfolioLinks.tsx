import { AppearanceControl } from "../appearance/AppearanceControl";

export function PortfolioLinks() {
  return (
    <>
      <AppearanceControl compact />
      <a href="/VarunJ_Resume.pdf" download="Varun-J-Resume.pdf">
        Resume
      </a>
      <a href="mailto:varunj93478@gmail.com">Contact</a>
    </>
  );
}
