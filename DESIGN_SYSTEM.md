# ERP interface system

`src/design-system.css` owns shared color, spacing, radius, elevation, control-size, focus and motion tokens. It loads after the layout stylesheet. Use tokens and shared components for new interface work; keep page classes for layout.

## Components

- `Button`: primary (main action), secondary, danger, warning, ghost; md, sm and icon sizes. Supply a label for icon-only controls. `surface` is reserved for navigation and compound clickable rows. Native form behavior is retained; set `type="button"` for non-submit actions in forms.
- `Input`, `Select`, `Textarea`: shared default, focus, disabled, readonly and `aria-invalid` states. Use `ds-control-leading` / `ds-control-trailing` for space around embedded icons. Associate labels using `htmlFor` and `id`.
- `Card`: none, sm (16px), md (24px) padding. Use none for tables and cards with separately padded sections. Do not combine padding variants with competing padding utilities.
- `TabButton`: controlled `active` state, exposed with `aria-pressed`. Place related controls in a `ds-tabs` container with a descriptive group label. Long tab groups scroll locally.
- `Badge` and `StatusBadge`: neutral, success, warning, danger, info and violet tones. Status meaning is conveyed by text as well as color.
- `Modal` / `DialogSurface`: common surface styling, keyboard focus containment, Escape dismissal and focus restoration. Drawers use `presentation="drawer"`. Every dialog needs a label. Existing submit handlers and validation remain in their feature components.
- `ds-popover` and `ds-overlay`: shared elevation and backdrop. On phones, header popovers fit the viewport; dialogs use viewport-limited heights with scrolling content.

## Responsive and interaction rules

Controls are 40px on desktop and at least 44px on phones. Mobile inputs use 16px text. Dense data tables scroll within their container or use the existing mobile record cards. Sidebars retain the same routes and role permissions. Reduced-motion settings disable token-based transitions.

Run `npm run check:ui` to check every TSX file for native controls or dialogs bypassing the shared system. Run `npm run build` for TypeScript and production bundling. This structural check complements browser checks; it does not prove visual correctness.

Visual verification includes admin routes at desktop and 390px, role-specific dashboards and workflows, tablet layouts, customer dialog focus cycling / Escape / restoration, mobile navigation, and local table/tab scrolling. Business data, calculations and record mutations are outside the UI migration.
