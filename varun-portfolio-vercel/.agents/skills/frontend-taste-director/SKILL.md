---
name: frontend-taste-director
description: Direct, implement, redesign, and audit distinctive production frontend interfaces by combining strong art direction, anti-generic layout and typography rules, interaction craft, and disciplined motion. Use for landing pages, portfolios, product screens, dashboards, component systems, UI polish, visual QA, design critiques, animation reviews, or any React, Next.js, Vue, Svelte, HTML, and CSS task where visual quality and frontend taste materially affect the result.
---

# Frontend Taste Director

Create interfaces with a deliberate visual thesis, clear hierarchy, useful motion, and production-level finish. Preserve product intent and existing conventions unless the user explicitly requests a new direction.

## Operating modes

Choose one mode from the request:

- **Direct**: establish the visual concept and design system before implementation.
- **Build**: implement a new page, screen, flow, or component in the existing stack.
- **Redesign**: inspect the current interface, retain valuable product structure, and replace weak visual decisions.
- **Polish**: improve spacing, typography, states, motion, responsiveness, and details without changing the core concept.
- **Audit**: report prioritized design and implementation issues; do not edit unless asked.
- **Motion review**: evaluate whether motion belongs, then inspect timing, easing, origin, interruption, performance, and reduced-motion behavior.

If compatible companion skills are installed, use them as specialist passes:

- Use `design-taste-frontend` or `gpt-taste` for broad art direction and anti-generic composition.
- Use `emil-design-eng` for interaction and motion decisions.
- Use `impeccable` for deterministic critique, polish, and anti-pattern detection.

Do not require those skills. Apply the complete workflow below when they are unavailable.

## 1. Read the product before styling it

Inspect the repository, rendered UI, design tokens, assets, content, and component conventions. Identify:

- the product's purpose and audience;
- the action or idea that deserves the strongest emphasis;
- content density and expected interaction frequency;
- technical and accessibility constraints;
- existing choices worth preserving;
- the smallest coherent scope that satisfies the request.

Do not invent a brand story that conflicts with supplied content. Do not redesign unrelated areas.

## 2. Declare the design thesis

Before substantial implementation, write a compact internal direction:

```text
Concept: <one memorable visual idea>
Audience: <who this serves>
Tone: <three precise adjectives>
Hierarchy: <primary focal point and reading order>
Type: <display/body strategy>
Color: <base, accent, contrast strategy>
Shape: <radius, border, and geometry logic>
Motion: <none, restrained, expressive; why>
Density: <spacious, balanced, compact>
Signature: <one distinctive visual or interaction device>
```

Set three 1–10 dials and let them constrain decisions:

- **Variance**: 1 means conventional and symmetrical; 10 means editorial and compositionally adventurous.
- **Motion**: 1 means nearly static; 10 means expressive, choreographed interaction.
- **Density**: 1 means spacious and selective; 10 means information-rich and compact.

Infer conservative defaults from context. Increase a dial only when the product, audience, and user request justify it.

## 3. Build a small visual system

Define or reuse a minimal token set instead of choosing values ad hoc:

- type scale, weights, line heights, and measure;
- spacing rhythm and section cadence;
- canvas, surface, text, muted text, border, and accent colors;
- radius family and border/shadow treatment;
- container widths and responsive breakpoints;
- interaction durations and easing curves.

Use one dominant composition idea and repeat it with variation. Prefer alignment, whitespace, scale, contrast, and rhythm over decorative containers.

### Typography

- Choose typefaces that support the concept and load reliably.
- Avoid defaulting to fashionable sans-serif fonts without a reason.
- Use a decisive display scale where hierarchy calls for it.
- Keep body copy readable: sensible line length, line height, contrast, and paragraph spacing.
- Use uppercase, tracking, italics, monospace, or condensed type as intentional accents, not universal decoration.
- Prevent accidental widows and awkward wraps in prominent headings when practical.

### Layout

- Establish a clear reading order at every breakpoint.
- Use asymmetry, overlap, cropping, or off-grid elements only when they strengthen the concept.
- Vary section rhythm; avoid a page made from identical full-width bands.
- Avoid nesting cards inside cards when grouping, rules, or whitespace can express structure.
- Let important content own space. Do not shrink everything to fit one viewport.
- Design mobile as a composed layout, not merely a collapsed desktop.

### Color and surface

- Use a restrained palette with one clear accent strategy.
- Verify text contrast, including muted text on tinted surfaces.
- Prefer subtle borders and shadows that respond to the background.
- Avoid generic purple-blue gradients, glow effects, glass panels, and excessive blur unless the concept specifically depends on them.
- Avoid placing every icon in the same rounded square tile.

### Imagery and icons

- Reuse supplied brand assets and high-quality imagery.
- Give imagery a compositional role: focal point, texture, narrative, or spatial anchor.
- Keep icon style, optical size, and stroke weight consistent.
- Do not use emoji as interface icons unless the product language calls for them.

## 4. Implement with craft

- Preserve the existing framework and component architecture.
- Reuse existing primitives when they meet the design and accessibility requirements.
- Keep semantic HTML, keyboard access, focus visibility, labels, and target sizes intact.
- Implement every relevant state: default, hover, active, focus, disabled, loading, empty, error, success, and selected.
- Make responsive behavior explicit for narrow, middle, and wide layouts.
- Avoid placeholder content, dead controls, and decorative interactions that imply unavailable behavior.
- Prefer maintainable tokens and shared primitives over scattered one-off values.

## 5. Direct motion deliberately

Ask in order:

1. Does motion explain state, location, causality, or feedback?
2. How often will the user encounter it?
3. Can it be interrupted or rapidly retriggered?
4. Does it remain clear with reduced motion?

Use these defaults:

- Omit animation from frequent keyboard-driven actions.
- Keep common UI feedback fast, usually 100–250 ms.
- Use a strong ease-out for entrances and direct responses.
- Use ease-in-out for movement between visible states.
- Use linear timing only for continuous progress or constant motion.
- Avoid ease-in for UI entrances.
- Start scale entrances near their final size, such as `0.95`, and combine with opacity; never emerge from `scale(0)`.
- Set popover transform origin near its trigger; keep centered modals centered.
- Prefer transform and opacity for smoothness.
- Prefer transitions for interruptible UI and keyframes for predetermined sequences.
- Keep stagger intervals short and never block interaction behind a sequence.
- Add active press feedback only where it suits the control and product tone.
- Gate hover-only effects behind hover-capable pointers.

Provide reduced-motion behavior that removes spatial travel while retaining useful state feedback. Treat motion as optional; a crisp static interface is better than purposeless animation.

## 6. Render and verify

Run the application and inspect the actual result whenever tooling permits. Verify:

- desktop and mobile composition;
- overflow, clipping, wrapping, and cumulative spacing;
- hover, focus, active, loading, empty, and error states;
- keyboard navigation and visible focus;
- contrast and legibility;
- motion timing, transform origin, interruption, and reduced motion;
- console errors, hydration issues, and obvious performance regressions.

Capture screenshots or use browser inspection for visual work. Iterate on what is rendered, not only what the source appears to express.

## 7. Apply the anti-generic preflight

Before handoff, remove or justify:

- interchangeable SaaS hero copy and layouts;
- gradients, glass, glows, or blobs used as automatic decoration;
- excessive pills, rounded cards, and icon tiles;
- repeated three-column feature-card grids;
- arbitrary animations and scroll reveals;
- weak type hierarchy or uniformly medium-sized text;
- low-contrast gray text;
- inconsistent radii, shadows, icon weights, or spacing;
- sections that all use the same composition;
- dense desktop layouts merely stacked on mobile;
- controls without complete interaction states.

Do not eliminate familiar patterns when familiarity improves usability. Make the overall composition distinctive while keeping individual controls understandable.

## Review output

For audits, prioritize findings as `P0` broken or inaccessible, `P1` major hierarchy or usability issue, `P2` visible craft issue, and `P3` optional refinement.

Use a compact table:

| Priority | Current | Recommended | Why |
| --- | --- | --- | --- |
| P1 | Describe the observed issue | Give a concrete change | State the user or design impact |

Separate observed facts from subjective recommendations. Reference exact files, components, or screenshots when available. End with the three changes that would create the largest improvement.

## Source lineage

Synthesize and adapt ideas from:

- Emil Kowalski's [Skills for Design Engineers](https://github.com/emilkowalski/skills)
- Leonxlnx's [Taste Skill](https://github.com/Leonxlnx/taste-skill)
- Paul Bakaus's [Impeccable](https://github.com/pbakaus/impeccable)

Consult the upstream projects for their latest specialist workflows and license terms when copying or redistributing their files. Keep this skill's wording and structure original.
