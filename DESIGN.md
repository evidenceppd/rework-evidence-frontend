# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-05-27
- Primary product surfaces: Admin > Conteúdos > Análise builder; public `/analise` form.
- Evidence reviewed: `frontend/src/pages/admin/AnaliseBuilderPage.tsx`, `frontend/src/pages/AdminPage.tsx`, `frontend/src/components/admin/Sidebar.tsx`, `frontend/src/pages/AnalisePage.jsx`, user reference image for form builder.

## Brand
- Personality: professional, precise, data-driven, conversion-focused.
- Trust signals: clean admin hierarchy, clear form preview, explicit required/optional metadata.
- Avoid: dark maker UI inside the light admin shell, unclear generic cards, hidden configuration controls.

## Product goals
- Goals: let admins configure the `/analise` diagnostic form with a builder visually similar to the provided reference while preserving the light admin design system.
- Non-goals: full drag-and-drop implementation, backend persistence, new design-system dependencies.
- Success signals: admin can see segments, step flow, questions, preview, and properties in one workspace.

## Personas and jobs
- Primary personas: site administrator/editor configuring diagnostic forms.
- User jobs: select segment, edit form steps, add questions/options, preview user-facing fields, publish/save configuration.
- Key contexts of use: desktop admin panel.

## Information architecture
- Primary navigation: Admin sidebar > Conteúdos > Análise.
- Core routes/screens: `/admin?page=conteudos-analise`, `/analise`.
- Content hierarchy: header actions; left segments; center step flow and question list; right preview and properties.

## Design principles
- Principle 1: Match the reference layout and density, translated to the existing light admin theme.
- Principle 2: Keep editing context visible: selected segment, selected step, selected question, preview, and properties.
- Tradeoffs: visual fidelity prioritized over minimalism; advanced rules/drag behavior can be added later.

## Visual language
- Color: white/light gray surfaces, Evidence red `#eb001a` for active/primary states, slate text.
- Typography: existing admin typography; bold section titles and compact metadata.
- Spacing/layout rhythm: three-column builder grid, rounded cards, compact high-density controls.
- Shape/radius/elevation: rounded-xl/2xl cards, subtle borders, low shadow.
- Motion: hover/active transitions only.
- Imagery/iconography: lucide icons and lightweight inline icons.

## Components
- Existing components to reuse: admin inputs/classes (`admin-input`, `admin-textarea`), admin shell/sidebar/header.
- New/changed components: `AnaliseBuilderPage` builder workspace.
- Variants and states: active segment, active step, active question, required flag, empty option lists.
- Token/component ownership: local to admin frontend, no new dependencies.

## Accessibility
- Target standard: basic keyboard-readable controls and semantic buttons/inputs.
- Keyboard/focus behavior: buttons and form controls remain native focusable.
- Contrast/readability: red active states on pale red; body text slate on white.
- Screen-reader semantics: inputs retain labels; future improvement can add richer aria labels.
- Reduced motion: only minimal transitions.

## Responsive behavior
- Supported breakpoints/devices: desktop-first admin; grid collapses on smaller widths.
- Layout adaptations: three columns collapse to one column before xl.
- Touch/hover differences: controls remain large enough for pointer/touch.

## Interaction states
- Loading: not applicable for localStorage builder.
- Empty: new steps/questions can be added; preview handles missing options/placeholders.
- Error: no remote error state yet.
- Success: save persists to localStorage.
- Disabled: not currently used.
- Offline/slow network: local builder remains usable.

## Content voice
- Tone: direct Portuguese admin labels.
- Terminology: Segmentos, etapas, perguntas, propriedades, pré-visualização, publicar/salvar formulário.
- Microcopy rules: describe what the user is editing and where it appears.

## Implementation constraints
- Framework/styling system: React + Vite + Tailwind utility classes.
- Design-token constraints: use existing Evidence red and admin neutral palette.
- Performance constraints: keep builder local and lightweight.
- Compatibility constraints: `/analise` must keep default fallback when no saved config exists.
- Test/screenshot expectations: `npm run build` must pass after UI changes.

## Open questions
- [ ] Should builder persistence move from localStorage to backend API? / owner: product / impact: multi-user admin support.
- [ ] Should step/question reordering become true drag-and-drop? / owner: product / impact: interaction parity with reference.
