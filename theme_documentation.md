# Zoho CRM Widget — Design Theme Standard

> **Purpose**: This document is the single source of truth for the visual design system, component patterns, and UI conventions used across Zoho CRM widgets. Use it as a drop-in design guide when starting a new widget or extending an existing one.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Tokens (CSS Custom Properties)](#2-design-tokens-css-custom-properties)
3. [Typography](#3-typography)
4. [Color Palette](#4-color-palette)
5. [Spacing & Sizing](#5-spacing--sizing)
6. [Border Radius & Shadows](#6-border-radius--shadows)
7. [Motion & Animation](#7-motion--animation)
8. [Layout Architecture](#8-layout-architecture)
9. [Component Library](#9-component-library)
   - [Card](#91-card)
   - [Card Header](#92-card-header)
   - [Card Body](#93-card-body)
   - [Card Footer](#94-card-footer)
   - [Field Group & Labels](#95-field-group--labels)
   - [Field Inputs](#96-field-inputs)
   - [Trigger Fields (Lookup / Picker)](#97-trigger-fields-lookup--picker)
   - [Clear Button](#98-clear-button)
   - [Buttons](#99-buttons)
   - [Spinner](#910-spinner)
   - [Loading Overlay](#911-loading-overlay)
   - [Toast Notification](#912-toast-notification)
   - [Divider](#913-divider)
   - [Modal System](#914-modal-system)
   - [Lookup Modal](#915-lookup-modal)
   - [Filter Toggle (Tab Switcher)](#916-filter-toggle-tab-switcher)
   - [Create-Entity Form Panel](#917-create-entity-form-panel)
   - [Badges](#918-badges)
   - [Pricing Table (Step 2)](#919-pricing-table-step-2)
   - [Step Header](#920-step-header)
   - [Add Row Button](#921-add-row-button)
   - [Remove Row Button](#922-remove-row-button)
10. [Utility Classes](#10-utility-classes)
11. [Interaction States](#11-interaction-states)
12. [Multi-Step Navigation Pattern](#12-multi-step-navigation-pattern)
13. [JavaScript UI Conventions](#13-javascript-ui-conventions)
14. [Accessibility Patterns](#14-accessibility-patterns)
15. [Scroll Performance](#15-scroll-performance)
16. [Zoho CRM Integration Patterns](#16-zoho-crm-integration-patterns)

---

## 1. Design Philosophy

The Deal CRM widget design system is **clean, professional, and restrained**. Every decision prioritizes clarity and trustworthiness over decoration.

| Principle                 | Implementation                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| **Light & Airy**          | White cards on a very light slate background; generous whitespace                        |
| **Micro-animations**      | Subtle `fadeSlideUp` entrance, smooth hover/focus transitions — never jarring            |
| **Consistent Hierarchy**  | Bold gradient header → structured body → quiet footer                                    |
| **Responsive to State**   | Every interactive element has distinct default / hover / focus / error / disabled states |
| **Accessibility-first**   | `role`, `aria-*` attributes on all interactive elements; keyboard navigation throughout  |
| **Minimal Icon Language** | Stroke-only Lucide-style SVG icons at consistent 2px stroke weight                       |

---

## 2. Design Tokens (CSS Custom Properties)

Define these on `:root`. They are the **only** way colors, radius, and transitions are referenced inside component CSS.

```css
:root {
  /* ── Blues (primary action) ── */
  --blue-600: #2563eb; /* Default CTA, focus rings, selected state */
  --blue-hover: #3b82f6; /* Button hover */

  /* ── Emeralds (success) ── */
  --emerald-600: #059669; /* Success toast background */
  --emerald-hover: #047857;
  --emerald-100: #d1fae5; /* Preferred badge background */
  --emerald-700: #047857; /* Preferred badge text */

  /* ── Garnets / Reds (error / destructive) ── */
  --garnet-500: #ef4444; /* (available, not used in primary flow) */
  --garnet-800: #991b1b; /* Error toast background */

  /* ── Slate (neutrals) ── */
  --slate-50: #f8fafc; /* Page / input background */
  --slate-100: #f1f5f9; /* Secondary button, modal search bg, disabled bg */
  --slate-200: #e2e8f0; /* Default borders */
  --slate-300: #cbd5e1; /* Scrollbar thumb, dashed add-row border */
  --slate-400: #94a3b8; /* Placeholder text, muted icons */
  --slate-500: #64748b; /* Field labels, secondary text */
  --slate-600: #475569; /* Secondary button text, muted body text */
  --slate-800: #1e293b; /* Primary body text */
  --slate-900: #0f172a; /* Toast background (default), darkest text */

  /* ── Shape ── */
  --radius: 10px; /* Default border radius for inputs and cards */

  /* ── Motion ── */
  --transition: 220ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

> **Rule**: Never hardcode a color in component CSS. Always reference a token. If a new color is genuinely needed, add it to `:root` first.

---

## 3. Typography

### Font Stack

```css
font-family: "Inter", system-ui, sans-serif;
```

Inter is loaded from Google Fonts with weights **400, 500, 600, 700**:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

### Type Scale

| Role                     | Size     | Weight    | Transform   | Usage                        |
| ------------------------ | -------- | --------- | ----------- | ---------------------------- |
| Card title (h1)          | `15px`   | `700`     | —           | Card header widget name      |
| Card subtitle            | `11.5px` | `400`     | —           | Deal name in header          |
| Modal title              | `16px`   | `700`     | —           | All modal headers            |
| Step section header (h3) | `16px`   | `700`     | —           | Step 2 section heading       |
| Step section subtext     | `13px`   | `400`     | —           | Step 2 description           |
| Field labels             | `11.5px` | `700`     | `uppercase` | All `.field-label`           |
| Field input              | `14px`   | `400`     | —           | All text inputs, selects     |
| Button                   | `13.5px` | `600`     | —           | All `.btn` variants          |
| Modal search             | `13.5px` | `400`     | —           | Search inputs in modals      |
| List option              | `14px`   | `400`     | —           | Country / lookup options     |
| Table header             | `11px`   | `600`     | `uppercase` | Pricing table `<th>`         |
| Table cells              | `13.5px` | `400`     | —           | Table input fields           |
| Toast                    | `13px`   | `500`     | —           | Toast notification text      |
| Badge                    | `10px`   | `700`     | `uppercase` | All badge variants           |
| Error message            | `12.5px` | `400`     | —           | Inline form errors           |
| Loading overlay text     | `13px`   | `500`     | —           | Overlay message              |
| Empty state              | `13.5px` | `400`     | —           | "No records found"           |
| Filter label             | `11.5px` | `600`     | `uppercase` | Contact filter "SHOW:" label |
| Filter tab               | `12.5px` | `500/600` | —           | Active: 600, inactive: 500   |

### Letter Spacing

- Field labels: `0.06em`
- Badges: `0.02em`
- Table headers: `0.05em`
- Filter labels: `0.05em`
- Card header title: `0.01em`

---

## 4. Color Palette

### Semantic Usage Map

| Token                    | Used For                                                                                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--blue-600`             | Primary buttons, focus rings (`box-shadow: 0 0 0 3px rgba(37,99,235,0.12)`), selected list items, modal title icons, lookup search button background, filter active tab text |
| `--blue-hover`           | Primary button hover, lookup search button hover                                                                                                                             |
| `--emerald-600`          | Success toast background                                                                                                                                                     |
| `--emerald-100`          | Preferred badge `background`                                                                                                                                                 |
| `--emerald-700`          | Preferred badge `color`                                                                                                                                                      |
| `--garnet-800`           | Error toast background                                                                                                                                                       |
| `#dc2626`                | Required label `*`, error border, clear button X hover color, inline form error text                                                                                         |
| `#fee2e2`                | Remove-row button hover background                                                                                                                                           |
| `--slate-50`             | Page background, input default background, modal search wrap background, step header section background                                                                      |
| `--slate-100`            | Secondary button background, close button background, modal filter background, readonly input bg, disabled bg                                                                |
| `--slate-200`            | Default input borders, dividers, table borders, modal borders                                                                                                                |
| `--slate-300`            | Scrollbar thumb, dashed add-row border                                                                                                                                       |
| `--slate-400`            | Placeholder text, label icons, trigger icon (chevron/search), lookup close icon, clear button color                                                                          |
| `--slate-500`            | Field label text, empty state text, table header text, overlay body text                                                                                                     |
| `--slate-600`            | Secondary button text, secondary text, contact filter inactive label                                                                                                         |
| `--slate-800`            | Primary body text, modal title, list item default text                                                                                                                       |
| `--slate-900`            | Default toast background                                                                                                                                                     |
| `#ffffff`                | Card background, modal background, active filter tab, selected scrollbar border                                                                                              |
| `#1e3a8a`                | Card header gradient start (deep navy)                                                                                                                                       |
| `#eff6ff`                | Hover background for list items, add-row hover background, contact badge background                                                                                          |
| `#dbeafe`                | Selected list item background                                                                                                                                                |
| `rgba(15,23,42,0.4)`     | Modal overlay backdrop                                                                                                                                                       |
| `rgba(248,250,252,0.88)` | Loading overlay background (semi-transparent + blur)                                                                                                                         |

### Card Header Gradient

```css
background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
```

This navy→blue diagonal gradient is the **signature** of every widget header. Do not change it.

---

## 5. Spacing & Sizing

### Core Spacing Scale

| Token  | Value | Usage                                                                                                 |
| ------ | ----- | ----------------------------------------------------------------------------------------------------- |
| `4px`  | XS    | Divider margin, badge vertical padding                                                                |
| `5px`  | —     | Field group gap                                                                                       |
| `6px`  | —     | Field label gap, badge horizontal padding                                                             |
| `8px`  | S     | Button icon gap, modal search row gap, filter row gap, toast gap                                      |
| `10px` | —     | Button padding (vertical), card footer gap, address modal footer gap                                  |
| `11px` | —     | Field input padding (vertical)                                                                        |
| `12px` | M     | Card header gap, loading overlay gap, modal search wrap padding TB                                    |
| `16px` | —     | Modal search wrap padding LR, create-form body padding, step header padding, field-row gap            |
| `20px` | L     | Modal close button size, lookup filter padding, lookup create body padding, step header margin-bottom |
| `24px` | XL    | Card body/footer padding LR, modal header padding, create-acct-body padding                           |

### Component Sizing

| Component                | Width                                  | Height             | Notes                           |
| ------------------------ | -------------------------------------- | ------------------ | ------------------------------- |
| Card (Step 1)            | `max-width: 500px`                     | auto               | Transitions to 1000px on Step 2 |
| Card (Step 2)            | `max-width: 1000px`                    | auto               | Expands for pricing table       |
| Modal                    | `max-width: var(--modal-width, 440px)` | `max-height: 90vh` | Account/Contact lookups: 1000px |
| Card header icon         | `36×36px`                              |                    | `border-radius: 8px`            |
| Card header icon SVG     | `18×18px`                              |                    |                                 |
| Field input              | `100%`, `padding: 10px 13px`           | —                  | Height self-determines          |
| Field input (modal form) | `100%`, `height: 42px`                 | —                  | Used inside modal forms         |
| Trigger field            | same as field-input                    |                    |                                 |
| Close button             | `30×30px`                              |                    | `border-radius: 8px`            |
| Lookup search button     | `38×38px`                              |                    | `border-radius: 8px`            |
| Lookup create button     | `38×38px`                              |                    | `border-radius: 8px`            |
| Spinner (inline)         | `16×16px`                              |                    | `border: 2.5px`                 |
| Spinner (overlay)        | `28×28px`                              |                    | `border: 3px`                   |
| Step header icon         | `44×44px`                              |                    | `border-radius: 10px`           |
| Step header icon SVG     | `22×22px`                              |                    |                                 |
| Remove-row button        | `32×32px`                              |                    | `border-radius: 6px`            |
| Scroll thumb min-height  | `48px`                                 |                    | Easy grab                       |

---

## 6. Border Radius & Shadows

### Border Radius

| Value             | Used For                                                                         |
| ----------------- | -------------------------------------------------------------------------------- |
| `--radius` (10px) | All standard inputs, triggers, card base                                         |
| `6px`             | Badges, small action buttons (remove-row), table inputs, filter tabs             |
| `7px`             | Filter toggle buttons (inside the pill)                                          |
| `8px`             | Header icon, close button, search button, create button, modal search input      |
| `9px`             | Filter toggle pill container                                                     |
| `10px`            | Modal form inputs (`field-input` inside modal), step header, address form inputs |
| `12px`            | Step header section                                                              |
| `16px`            | Card container, loading overlay                                                  |
| `20px`            | All modals (`.country-modal`, `.create-acct-card`)                               |
| `99px`            | Divider, scrollbar thumb                                                         |

### Box Shadows

| Shadow                                                                                            | Used For                          |
| ------------------------------------------------------------------------------------------------- | --------------------------------- |
| `0 4px 24px rgba(15,23,42,0.08)`                                                                  | Card container                    |
| `0 2px 8px rgba(37,99,235,0.3)`                                                                   | Primary button default            |
| `0 4px 14px rgba(37,99,235,0.4)`                                                                  | Primary button hover              |
| `0 0 0 3px rgba(37,99,235,0.12)`                                                                  | Input / trigger focus ring        |
| `0 0 0 3px rgba(220,38,38,0.12)`                                                                  | Error focus ring                  |
| `0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.05)` | All modals                        |
| `0 2px 6px rgba(15,23,42,0.08)`                                                                   | Active filter tab                 |
| `0 1px 4px rgba(15,23,42,0.1)`                                                                    | Active contact filter tab         |
| `0 2px 8px rgba(15,23,42,0.05)`                                                                   | Step header icon                  |
| `inset 0 1px 2px rgba(0,0,0,0.05)`                                                                | Filter toggle pill (inner shadow) |
| `0 2px 8px rgba(15,23,42,0.05)`                                                                   | Step header icon container        |

---

## 7. Motion & Animation

### Keyframe Animations

#### `fadeSlideUp` — Card Entrance

```css
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Usage: animation: fadeSlideUp 300ms ease both; */
```

Applied to `.card` on initial render.

#### `spin` — Spinner Rotation

```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
/* Usage: animation: spin 0.7s linear infinite; */
```

### Transition Conventions

| Context                                 | Value                                                   |
| --------------------------------------- | ------------------------------------------------------- |
| Default (inputs, buttons, borders)      | `var(--transition)` = `220ms cubic-bezier(0.4,0,0.2,1)` |
| Card max-width change (step transition) | `0.4s cubic-bezier(0.16,1,0.3,1)` — spring-like         |
| Modal enter/exit (transform)            | `0.4s cubic-bezier(0.16,1,0.3,1)` — spring-like         |
| Modal opacity                           | `0.3s ease`                                             |
| Overlay opacity                         | `0.3s ease`                                             |
| Loading overlay fade                    | `250ms ease`                                            |
| Toast slide-in                          | `280ms ease`                                            |
| List item hover (fast)                  | `100ms ease` (intentionally faster than default)        |
| List item hover during scroll           | `none` (suppressed by JS `.is-scrolling` class)         |

### Modal Open/Close Mechanic

- **Overlay**: opacity `0 → 1`, `pointer-events: none → all`
- **Card within**: `translateY(20px) scale(0.96) → translateY(0) scale(1)` + opacity `0 → 1`
- Triggered by `.classList.add('open')` / `.classList.remove('open')`

### Button Press

```css
.btn:active {
  transform: scale(0.98);
}
```

Gives a satisfying "click" feel without heavy animation.

---

## 8. Layout Architecture

### Page Shell

```html
<div class="page">
  <!-- Full viewport, centers the card -->
  <div class="card-wrapper">
    <!-- position: relative, hosts loading overlay -->
    <div id="loading-overlay">…</div>
    <div class="card">…</div>
  </div>
</div>
```

```css
.page {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px 16px;
  min-height: 100%;
}
```

### Card Anatomy

```
┌──────────────────────────────────────────┐
│  .card-header  (gradient)                │
│   icon + h1 title + subtitle             │
├──────────────────────────────────────────┤
│  .card-body                              │
│   #step-1 or #step-2 (hidden/shown by JS)│
├──────────────────────────────────────────┤
│  .divider                                │
├──────────────────────────────────────────┤
│  .card-footer (step-specific)            │
│   Buttons: Primary + Secondary           │
└──────────────────────────────────────────┘
```

### Responsive Width

The card width changes dynamically to accommodate the step:

```js
// Step 1: narrow
document.querySelector(".card").style.maxWidth = "500px";

// Step 2: wide (pricing table)
document.querySelector(".card").style.maxWidth = "1000px";
```

CSS transition on `.card` handles the smooth expansion:

```css
.card {
  transition: max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 9. Component Library

### 9.1 Card

```html
<div class="card-wrapper">
  <div class="card">
    <!-- content -->
  </div>
</div>
```

```css
.card {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border: 1px solid var(--slate-200);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
  animation: fadeSlideUp 300ms ease both;
  transition: max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

### 9.2 Card Header

```html
<div class="card-header">
  <div class="card-header-icon">
    <svg viewBox="0 0 24 24"><!-- icon paths --></svg>
  </div>
  <div class="card-header-text">
    <h1>Widget Title</h1>
    <p id="deal-name-sub">Context subtitle</p>
  </div>
</div>
```

- Background: `linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)`
- Title: white, `15px / 700`
- Subtitle: `rgba(255,255,255,0.72)`, `11.5px`
- Icon container: `36×36px`, `background: rgba(255,255,255,0.15)`, `border-radius: 8px`
- Icon SVG: `18×18px`, `stroke: #fff`, `stroke-width: 2`, no fill

---

### 9.3 Card Body

```html
<div class="card-body">
  <!-- field-groups and steps -->
</div>
```

```css
.card-body {
  padding: 24px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

Step panels (`#step-1`, `#step-2`) live inside card-body.  
`.hidden` class hides the inactive step.

---

### 9.4 Card Footer

```html
<!-- Column layout (single step) -->
<div class="card-footer" id="footer-step-1" style="padding-top: 20px">
  <button class="btn btn-primary">Next →</button>
  <button class="btn btn-secondary">Refresh</button>
</div>

<!-- Row layout (two buttons side-by-side) -->
<div class="card-footer footer-row hidden" id="footer-step-2" style="padding-top: 20px">
  <button class="btn btn-secondary">← Go Back</button>
  <button class="btn btn-primary">Save ✓</button>
</div>
```

```css
.card-footer {
  padding: 0 24px 24px;
  display: flex;
  gap: 10px;
  flex-direction: column; /* default: stack buttons */
}
.footer-row {
  flex-direction: row !important;
} /* side-by-side */
```

---

### 9.5 Field Group & Labels

```html
<div class="field-group">
  <label class="field-label required" for="my-input">
    <svg viewBox="0 0 24 24"><!-- icon --></svg>
    Field Name
  </label>
  <!-- input or trigger -->
</div>
```

```css
.field-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-label {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--slate-500);
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Required marker */
.field-label.required::after {
  content: " *";
  color: #dc2626;
  font-size: 14px;
}

/* Label icon */
.field-label svg {
  width: 13px;
  height: 13px;
  stroke: var(--slate-400);
  fill: none;
  stroke-width: 2;
}
```

**Field row (side-by-side in modals):**

```css
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
```

---

### 9.6 Field Inputs

Standard text / number input:

```html
<input id="my-input" class="field-input" type="text" placeholder="Enter value…" />
```

```css
.field-input {
  width: 100%;
  padding: 10px 13px;
  background: var(--slate-50);
  border: 1.5px solid var(--slate-200);
  border-radius: var(--radius);
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: var(--slate-800);
  transition:
    border-color var(--transition),
    box-shadow var(--transition),
    background var(--transition);
  outline: none;
  appearance: none;
}

.field-input:hover {
  border-color: #93c5fd;
  background: #ffffff;
}
.field-input:focus {
  border-color: var(--blue-600);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
.field-input[readonly] {
  background: var(--slate-100);
  cursor: default;
  border-color: var(--slate-200);
}
.field-input[readonly]:hover,
.field-input[readonly]:focus {
  border-color: var(--slate-200);
  background: var(--slate-100);
  box-shadow: none;
}
```

**Inside modals** (slightly taller, for addresses/create forms):

```css
.field-input {
  height: 42px;
  border-radius: 10px;
  padding: 0 12px;
}
.field-input:focus {
  outline: none;
  background: #fff;
  border-color: var(--blue-600);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

**Error state** (set via JS `.classList.add('error')`):

```css
.field-input.error,
.country-trigger.error {
  border-color: #dc2626;
  background: #fef2f2;
}
.country-trigger.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.12);
}
```

---

### 9.7 Trigger Fields (Lookup / Picker)

Used for fields that open a modal picker instead of accepting free text.

```html
<div
  class="country-trigger"
  id="my-trigger"
  tabindex="0"
  role="button"
  aria-haspopup="dialog"
  onclick="openMyModal()"
  onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openMyModal();}"
>
  <span class="country-trigger-text placeholder" id="my-display">Select option…</span>
  <button
    class="clear-field hidden"
    id="clear-my"
    onclick="event.stopPropagation(); clearField('my')"
    aria-label="Clear"
  >
    <svg viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
  <svg class="country-trigger-icon" viewBox="0 0 24 24"><!-- chevron or search icon --></svg>
</div>
```

States:

- **Default**: `background: var(--slate-50)`, border: `--slate-200`
- **Hover**: `border-color: #93c5fd`, `background: #ffffff`
- **Focus**: blue border + focus ring
- **Error**: `border-color: #dc2626`, `background: #fef2f2`
- **Disabled**: `background: var(--slate-100)`, `opacity: 0.6`, `cursor: not-allowed`

```css
.country-trigger-text.placeholder {
  color: var(--slate-400);
}
.country-trigger-icon {
  width: 15px;
  height: 15px;
  stroke: var(--slate-400);
  fill: none;
  stroke-width: 2;
}
```

**Field Input Trigger** (used inside modal forms):

```html
<div class="field-input-trigger" id="addr-country-trigger" onclick="openCountryModal(true)">
  <span id="addr-country-display" class="placeholder">Select country…</span>
  <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
</div>
```

---

### 9.8 Clear Button

Appears inside a trigger field. Hidden by default, shown when the field has a value.

```css
.clear-field {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  color: var(--slate-400);
  transition: all var(--transition);
}
.clear-field:hover {
  background: var(--slate-100);
  color: #dc2626;
}
.clear-field svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2.5;
}
.clear-field.hidden {
  display: none;
}
```

JavaScript pattern:

```js
function updateClearButtons() {
  document.getElementById("clear-account")?.classList.toggle("hidden", !accountLookup.id);
  document.getElementById("clear-contact")?.classList.toggle("hidden", !contactLookup.id);
  document.getElementById("clear-country")?.classList.toggle("hidden", !selectedCountry);
}
```

---

### 9.9 Buttons

All buttons share the `.btn` base class:

```css
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 11px 16px;
  border: none;
  border-radius: var(--radius);
  font-family: "Inter", sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background var(--transition),
    transform var(--transition),
    box-shadow var(--transition);
  position: relative;
  overflow: hidden;
}
.btn:active {
  transform: scale(0.98);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
.btn svg {
  width: 15px;
  height: 15px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
}
```

#### Primary Button

```css
.btn-primary {
  background: var(--blue-600);
  color: #fff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}
.btn-primary:hover:not(:disabled) {
  background: var(--blue-hover);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
}
```

#### Secondary Button

```css
.btn-secondary {
  background: var(--slate-100);
  color: var(--slate-600);
  border: 1.5px solid var(--slate-200);
}
.btn-secondary:hover:not(:disabled) {
  background: var(--slate-200);
  color: var(--slate-800);
}
```

#### Loading State (JS Pattern)

```js
function setBtnLoading(btn, loading, text, iconHTML = "") {
  btn.disabled = loading;
  if (loading) {
    btn.innerHTML = `<div class="spinner"></div><span>${text}</span>`;
  } else {
    btn.innerHTML = `${iconHTML}<span>${text}</span>`;
  }
}
// Usage:
setBtnLoading(btnSave, true, "Saving…");
setBtnLoading(
  btnSave,
  false,
  "Save",
  `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
);
```

---

### 9.10 Spinner

Two variants: **white** (on colored backgrounds) and **dark** (on light backgrounds).

```html
<!-- White -->
<div class="spinner"></div>

<!-- Dark -->
<div class="spinner spinner-dark"></div>
```

```css
.spinner {
  width: 16px;
  height: 16px;
  border: 2.5px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}
.spinner-dark {
  border-color: rgba(71, 85, 105, 0.3);
  border-top-color: var(--slate-600);
}
```

---

### 9.11 Loading Overlay

Covers the entire card while async data is loading. Blurred frosted-glass effect.

```html
<div id="loading-overlay">
  <div class="spinner"></div>
  <p>Loading deal data…</p>
</div>
```

```css
#loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(248, 250, 252, 0.88);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 50;
  border-radius: 16px;
  transition: opacity 250ms ease;
}
#loading-overlay.hidden {
  opacity: 0;
  pointer-events: none;
}
#loading-overlay .spinner {
  width: 28px;
  height: 28px;
  border-width: 3px;
  border-color: rgba(37, 99, 235, 0.2);
  border-top-color: var(--blue-600);
}
#loading-overlay p {
  font-size: 13px;
  font-weight: 500;
  color: var(--slate-600);
}
```

```js
function showOverlay(visible) {
  document.getElementById("loading-overlay").classList.toggle("hidden", !visible);
}
```

---

### 9.12 Toast Notification

Fixed at the bottom-center. Slides in from below.

```html
<div id="toast">
  <svg id="toast-icon" viewBox="0 0 24 24"></svg>
  <span id="toast-msg"></span>
</div>
```

```css
#toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(12px);
  opacity: 0;
  pointer-events: none;
  background: var(--slate-900);
  color: #fff;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 999;
  transition:
    opacity 280ms ease,
    transform 280ms ease;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 90vw;
}
#toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
#toast.toast-success {
  background: var(--emerald-600);
}
#toast.toast-error {
  background: var(--garnet-800);
}
```

Three types:

| Type    | Call                          | Icon        | Background      |
| ------- | ----------------------------- | ----------- | --------------- |
| Default | `showToast('msg')`            | Info circle | `--slate-900`   |
| Success | `showToast('msg', 'success')` | Checkmark   | `--emerald-600` |
| Error   | `showToast('msg', 'error')`   | X circle    | `--garnet-800`  |

```js
function showToast(message, type = "default") {
  const toast = document.getElementById("toast");
  const msgEl = document.getElementById("toast-msg");
  const iconEl = document.getElementById("toast-icon");
  msgEl.textContent = message;
  if (type === "success") {
    toast.className = "toast-success show";
    iconEl.innerHTML = `<polyline points="20 6 9 17 4 12"/>`;
  } else if (type === "error") {
    toast.className = "toast-error show";
    iconEl.innerHTML = `<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>`;
  } else {
    toast.className = "show";
    iconEl.innerHTML = `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`;
  }
  clearTimeout(toastTimer);
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}
```

---

### 9.13 Divider

```html
<div class="divider"></div>
<!-- or inline styled -->
<div class="divider" style="margin: 0 24px"></div>
```

```css
.divider {
  height: 1px;
  background: var(--slate-200);
  margin: 4px 0;
  border-radius: 99px;
}
```

---

### 9.14 Modal System

All modals share two classes: `.country-modal-overlay` (or `.create-acct-overlay` for form modals) as the backdrop, and `.country-modal` / `.create-acct-card` as the panel.

#### Overlay (Backdrop)

```css
.country-modal-overlay,
.create-acct-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.country-modal-overlay.open,
.create-acct-overlay.open {
  opacity: 1;
  pointer-events: all;
}
```

#### Panel

```css
.country-modal,
.create-acct-card {
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: var(--modal-width, 440px);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  transform: translateY(20px) scale(0.96);
  opacity: 0;
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s ease;
  overflow: hidden;
}
.country-modal-overlay.open .country-modal,
.create-acct-overlay.open .create-acct-card {
  transform: translateY(0) scale(1);
  opacity: 1;
}
```

#### Modal Header

```html
<div class="country-modal-header">
  <div class="country-modal-title">
    <svg viewBox="0 0 24 24"><!-- icon --></svg>
    Modal Title
  </div>
  <button class="country-modal-close" onclick="closeModal()" aria-label="Close">
    <svg viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
</div>
```

```css
.country-modal-header,
.create-acct-header {
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--slate-100);
}
.country-modal-title,
.create-acct-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--slate-900);
  display: flex;
  align-items: center;
  gap: 10px;
}
.country-modal-title svg,
.create-acct-title svg {
  width: 20px;
  height: 20px;
  stroke: var(--blue-600);
  stroke-width: 2;
  fill: none;
}
.country-modal-close {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--slate-100);
  border-radius: 8px;
  cursor: pointer;
  transition: background var(--transition);
}
.country-modal-close:hover {
  background: var(--slate-200);
}
.country-modal-close svg {
  width: 15px;
  height: 15px;
  stroke: var(--slate-600);
  fill: none;
  stroke-width: 2.2;
}
```

#### Modal Open/Close (JS Pattern)

```js
function openModal(overlayId) {
  document.getElementById(overlayId).classList.add("open");
}
function closeModal(overlayId) {
  document.getElementById(overlayId).classList.remove("open");
}

// Close on backdrop click
document.addEventListener("click", (e) => {
  const overlay = document.getElementById("my-modal-overlay");
  if (e.target === overlay) closeModal("my-modal-overlay");
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal("my-modal-overlay");
});
```

#### Modal Width System

Set via CSS custom property on the overlay element:

```js
overlay.style.setProperty("--modal-width", "440px"); // compact
overlay.style.setProperty("--modal-width", "1000px"); // wide (lookup tables)
```

---

### 9.15 Lookup Modal

A specialized modal for searching and selecting CRM records.

```
┌─────────────────────────────────────────┐
│ Modal Header (title + close button)      │
├─────────────────────────────────────────┤
│ Filter Bar (contact filter tabs)         │  ← optional, only for contacts
├─────────────────────────────────────────┤
│ Search Row (input + search btn + + btn)  │
├─────────────────────────────────────────┤
│ Loading indicator                        │  ← shown while fetching
├─────────────────────────────────────────┤
│ Results list (scrollable)               │
└─────────────────────────────────────────┘
```

#### Search Wrap

```css
.lookup-search-wrap {
  padding: 12px 16px 10px;
  border-bottom: 1px solid var(--slate-200);
  background: var(--slate-50);
  flex-shrink: 0;
}
.lookup-search-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
```

#### Search Input

```css
.country-modal-search {
  width: 100%;
  padding: 9px 12px 9px 36px;
  background: #ffffff;
  border: 1.5px solid var(--slate-200);
  border-radius: 8px;
  font-family: "Inter", sans-serif;
  font-size: 13.5px;
  color: var(--slate-800);
  outline: none;
  background-image: url("data:image/svg+xml,…search icon…");
  background-repeat: no-repeat;
  background-position: 11px center;
  transition:
    border-color var(--transition),
    box-shadow var(--transition);
}
.country-modal-search:focus {
  border-color: var(--blue-600);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
```

#### Search Button (beside input)

```css
.lookup-search-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--blue-600);
  border-radius: 8px;
  cursor: pointer;
  transition: background var(--transition);
}
.lookup-search-btn:hover {
  background: var(--blue-hover);
}
.lookup-search-btn svg {
  width: 14px;
  height: 14px;
  stroke: #fff;
  fill: none;
  stroke-width: 2.5;
}
```

#### Create Entity Button (beside search)

```css
.lookup-create-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--slate-200);
  background: #ffffff;
  border-radius: 8px;
  color: var(--slate-500);
  cursor: pointer;
  transition:
    background var(--transition),
    border-color var(--transition),
    color var(--transition);
}
.lookup-create-btn:hover {
  background: #f0fdf4;
  border-color: #16a34a;
  color: #16a34a;
}
.lookup-create-btn svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2.5;
}
```

#### Results List

```css
.country-modal-list {
  list-style: none;
  overflow-y: scroll;
  flex: 1;
  padding: 6px 0;
  max-height: 70vh;
  overscroll-behavior: contain;
  will-change: scroll-position;
  contain: content;
}
/* Scrollbar */
.country-modal-list::-webkit-scrollbar {
  width: 8px;
}
.country-modal-list::-webkit-scrollbar-track {
  background: var(--slate-100);
}
.country-modal-list::-webkit-scrollbar-thumb {
  background: var(--slate-300);
  border-radius: 99px;
  border: 2px solid var(--slate-100);
  min-height: 48px;
}
.country-modal-list::-webkit-scrollbar-thumb:hover {
  background: var(--slate-400);
}
```

#### List Options

```css
.country-modal-option {
  padding: 11px 20px;
  font-size: 14px;
  color: var(--slate-800);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition:
    background 100ms ease,
    color 100ms ease;
}
.country-modal-option:hover,
.country-modal-option.focused {
  background: #eff6ff;
  color: var(--blue-600);
}
.country-modal-option.selected {
  background: #dbeafe;
  color: var(--blue-600);
  font-weight: 600;
}
.country-modal-option.suggested-option {
  background: #f8fafc;
  border-left: 3px solid var(--blue-600);
}
```

Check icon (shown when selected):

```css
.country-modal-option .check-icon {
  width: 16px;
  height: 16px;
  stroke: var(--blue-600);
  fill: none;
  stroke-width: 2.5;
  opacity: 0;
}
.country-modal-option.selected .check-icon {
  opacity: 1;
}
```

Empty state:

```css
.country-modal-empty {
  padding: 32px 20px;
  text-align: center;
  font-size: 13.5px;
  color: var(--slate-400);
}
```

#### Loading Indicator (inside modal)

```html
<div class="lookup-loading hidden" id="lookup-loading">
  <div class="spinner spinner-dark"></div>
  <span>Loading…</span>
</div>
```

```css
.lookup-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  font-size: 13px;
  color: var(--slate-600);
}
```

---

### 9.16 Filter Toggle (Tab Switcher)

A pill-shaped toggle shown above the results list (used for Related/All Contacts filter).

```html
<div class="lookup-filter-wrap" id="lookup-filter-wrap">
  <div class="lookup-filter-row">
    <button class="lookup-filter-btn active" id="filter-related" onclick="setFilter('related')">
      Related Contacts
    </button>
    <button class="lookup-filter-btn" id="filter-all" onclick="setFilter('all')">
      All Contacts
    </button>
  </div>
</div>
```

```css
.lookup-filter-wrap {
  padding: 12px 16px 4px;
  background: var(--slate-50);
  border-bottom: 1px solid var(--slate-200);
}
.lookup-filter-row {
  display: flex;
  background: var(--slate-100);
  padding: 3px;
  border-radius: 9px;
  gap: 2px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}
.lookup-filter-btn {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--slate-600);
  border-radius: 7px;
  cursor: pointer;
  transition: all var(--transition);
}
.lookup-filter-btn:hover {
  color: var(--slate-800);
}
.lookup-filter-btn.active {
  background: #ffffff;
  color: var(--blue-600);
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
}
```

**Contact filter bar alternate style** (horizontal, with a label):

```css
.contact-filter-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px 10px;
  border-bottom: 1px solid var(--slate-200);
  background: var(--slate-50);
}
.contact-filter-label {
  font-size: 11.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--slate-400);
  white-space: nowrap;
}
.contact-filter-tabs {
  display: flex;
  gap: 4px;
  background: var(--slate-200);
  border-radius: 8px;
  padding: 3px;
}
.contact-filter-tab {
  padding: 5px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--slate-600);
  background: transparent;
  cursor: pointer;
  transition:
    background var(--transition),
    color var(--transition),
    box-shadow var(--transition);
}
.contact-filter-tab.active {
  background: #ffffff;
  color: var(--blue-600);
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.1);
}
```

---

### 9.17 Create-Entity Form Panel

A modal that stacks above the lookup modal for creating new CRM records (Account, Contact).

```html
<div class="create-acct-overlay" id="create-entity-overlay" role="dialog" aria-modal="true">
  <div class="create-acct-card">
    <div class="create-acct-header">
      <div class="create-acct-title">
        <svg viewBox="0 0 24 24"><!-- icon --></svg>
        Create Entity
      </div>
      <button class="country-modal-close" onclick="closeForm()" aria-label="Close">…</button>
    </div>

    <div class="create-acct-body">
      <div class="field-group">
        <label class="field-label">Field Name</label>
        <input class="field-input" type="text" placeholder="Enter value…" />
      </div>
      <p class="create-acct-error hidden" id="create-entity-error"></p>
    </div>

    <div class="create-acct-footer">
      <button class="btn btn-secondary" onclick="closeForm()">Cancel</button>
      <button class="btn btn-primary" onclick="submitForm()">
        <svg viewBox="0 0 24 24"><!-- plus icon --></svg>
        Create Entity
      </button>
    </div>
  </div>
</div>
```

```css
.create-acct-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}
.create-acct-footer {
  padding: 16px 24px 24px;
  display: flex;
  gap: 12px;
  border-top: 1px solid var(--slate-100);
  background: var(--slate-50);
}
.create-acct-footer .btn {
  flex: 1;
}
.create-acct-error {
  font-size: 12.5px;
  color: #dc2626;
  margin: 6px 0 0;
  display: flex;
  align-items: center;
  gap: 4px;
}
```

Z-index stacking: The create overlay (`z-index: 600`) sits above the lookup overlay (`z-index: 600`). Both have the same z-index but are opened/closed sequentially, so the later `.classList.add('open')` wins.

---

### 9.18 Badges

Small inline labels used to highlight status or relationships.

#### Preferred Badge (green)

```css
.preferred-badge {
  background: var(--emerald-100);
  color: var(--emerald-700);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 6px;
  letter-spacing: 0.02em;
  margin-right: 8px;
  flex-shrink: 0;
}
```

#### Contact Badge (blue)

```css
.contact-badge {
  flex-shrink: 0;
  background: #eff6ff;
  color: var(--blue-600);
  border: 1px solid #dbeafe;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 6px;
  letter-spacing: 0.02em;
  margin-right: 8px;
}
```

---

### 9.19 Pricing Table (Step 2)

A responsive data table for entering multiple pricing rows.

```html
<div class="pricing-table-wrap">
  <div class="pricing-table-container">
    <table class="pricing-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Comments</th>
          <th style="width: 44px"></th>
        </tr>
      </thead>
      <tbody id="pricing-body">
        <!-- JS rendered rows -->
      </tbody>
    </table>
  </div>
  <button class="add-row-btn" onclick="addPricingRow()">
    <svg viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
    <span>Add Pricing Row</span>
  </button>
</div>
```

```css
.pricing-table-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pricing-table-container {
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.pricing-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.pricing-table th {
  text-align: left;
  padding: 8px 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--slate-500);
  border-bottom: 1px solid var(--slate-200);
  background: #fff;
}
.pricing-table td {
  padding: 4px 6px;
  border-bottom: 1px solid var(--slate-100);
  vertical-align: middle;
}
.pricing-table tr:last-child td {
  border-bottom: none;
}
```

Table input (text/number cell):

```css
.table-input {
  width: 100%;
  padding: 6px 8px;
  border: 1.5px solid var(--slate-200);
  border-radius: 6px;
  font-family: inherit;
  font-size: 13.5px;
  outline: none;
  transition: all var(--transition);
  background: var(--slate-50);
}
.table-input:focus {
  border-color: var(--blue-600);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

Select dropdown:

```css
.table-select {
  appearance: none;
  background-image: url("data:image/svg+xml,…chevron-down icon…");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 32px;
}
```

---

### 9.20 Step Header

Contextual header block used at the top of Step 2:

```html
<div class="step-header">
  <div class="step-header-icon">
    <svg viewBox="0 0 24 24"><!-- icon --></svg>
  </div>
  <div class="step-header-text">
    <h3>Section Title</h3>
    <p>Section description</p>
  </div>
</div>
```

```css
.step-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  background: var(--slate-50);
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid var(--slate-200);
}
.step-header-icon {
  width: 44px;
  height: 44px;
  background: #ffffff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
  border: 1px solid var(--slate-200);
  flex-shrink: 0;
}
.step-header-icon svg {
  width: 22px;
  height: 22px;
  stroke: var(--blue-600);
  fill: none;
  stroke-width: 2.2;
}
.step-header-text h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--slate-800);
}
.step-header-text p {
  font-size: 13px;
  color: var(--slate-500);
  margin-top: 1px;
}
```

---

### 9.21 Add Row Button

Dashed outline "ghost" button for adding a new data row:

```css
.add-row-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #fff;
  border: 1.5px dashed var(--slate-300);
  border-radius: 10px;
  color: var(--slate-600);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  align-self: flex-start;
}
.add-row-btn:hover {
  border-color: var(--blue-600);
  color: var(--blue-600);
  background: #eff6ff;
}
.add-row-btn svg {
  width: 15px;
  height: 15px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2.5;
}
```

---

### 9.22 Remove Row Button

Destructive icon button on each table row:

```css
.remove-row-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--slate-400);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
}
.remove-row-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}
.remove-row-btn svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  stroke-width: 2.5;
  fill: none;
}
```

---

## 10. Utility Classes

| Class                           | Effect                                                            |
| ------------------------------- | ----------------------------------------------------------------- |
| `.hidden`                       | `display: none !important`                                        |
| `.footer-row`                   | `flex-direction: row !important` — makes footer horizontal        |
| `.placeholder` (on span)        | `color: var(--slate-400)` — placeholder text color                |
| `.is-scrolling` (JS-applied)    | Disables transitions + pointer-events on list items during scroll |
| `.error` (on trigger/input)     | Red border + red tinted background                                |
| `.disabled` (on trigger)        | Muted background, `cursor: not-allowed`, `opacity: 0.6`           |
| `.active` (on filter btn)       | White background + blue text + box shadow                         |
| `.selected` (on list option)    | Blue tinted background + blue text + bold                         |
| `.focused` (on list option, JS) | Same hover style, keyboard navigation highlight                   |
| `.suggested-option`             | Blue left border + light background for prioritized record        |
| `.open` (on overlay)            | `opacity: 1; pointer-events: all` — modal visible                 |

---

## 11. Interaction States

Every interactive element must implement all applicable states:

| Element              | Default                           | Hover                                  | Focus                                     | Error                          | Disabled                        |
| -------------------- | --------------------------------- | -------------------------------------- | ----------------------------------------- | ------------------------------ | ------------------------------- |
| Text input           | `slate-50` bg, `slate-200` border | `white` bg, `#93c5fd` border           | `white` bg, `blue-600` border, blue ring  | `#fef2f2` bg, `#dc2626` border | `slate-100` bg, pointer blocked |
| Trigger field        | same as input                     | same                                   | same                                      | same                           | `opacity: 0.6`, `not-allowed`   |
| Primary button       | `blue-600`                        | `blue-hover` + elevated shadow         | (no visible focus ring beyond OS default) | —                              | `opacity: 0.6`, `not-allowed`   |
| Secondary button     | `slate-100`                       | `slate-200` bg, `slate-800` text       | —                                         | —                              | `opacity: 0.6`                  |
| Modal close btn      | `slate-100` bg                    | `slate-200` bg                         | —                                         | —                              | —                               |
| List option          | transparent                       | `#eff6ff` bg, blue text                | `.focused` = same as hover                | —                              | —                               |
| Selected list option | `#dbeafe` bg, blue text, bold     | —                                      | —                                         | —                              | —                               |
| Filter tab           | transparent                       | `slate-800` text                       | —                                         | —                              | —                               |
| Active filter tab    | `white` bg, blue text, shadow     | —                                      | —                                         | —                              | —                               |
| Clear button         | `slate-400` color                 | `slate-100` bg, red color              | —                                         | —                              | —                               |
| Remove-row button    | transparent                       | `#fee2e2` bg, red color                | —                                         | —                              | —                               |
| Add-row button       | white bg, dashed border           | blue border, blue text, `#eff6ff` bg   | —                                         | —                              | —                               |
| Create entity button | white bg, `slate-200` border      | `#f0fdf4` bg, green border, green text | —                                         | —                              | —                               |

---

## 12. Multi-Step Navigation Pattern

Widgets that require multiple steps use the following pattern:

### HTML Structure

```html
<!-- Step panels inside .card-body -->
<div id="step-1"><!-- Step 1 content --></div>
<div id="step-2" class="hidden"><!-- Step 2 content --></div>

<!-- Separate footers for each step -->
<div class="card-footer" id="footer-step-1">
  <button class="btn btn-primary" onclick="validateStep1()">Next →</button>
  <button class="btn btn-secondary" onclick="refreshData()">Refresh</button>
</div>
<div class="card-footer footer-row hidden" id="footer-step-2">
  <button class="btn btn-secondary" onclick="goToStep(1)">← Go Back</button>
  <button class="btn btn-primary" onclick="saveRecord()">Save ✓</button>
</div>
```

### JavaScript Pattern

```js
function goToStep(stepNum) {
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  const footer1 = document.getElementById("footer-step-1");
  const footer2 = document.getElementById("footer-step-2");

  if (stepNum === 1) {
    step1.classList.remove("hidden");
    step2.classList.add("hidden");
    footer1.classList.remove("hidden");
    footer2.classList.add("hidden");
    document.querySelector(".card").style.maxWidth = "500px";
    ZOHO.CRM.UI.Resize({ width: "950", height: "auto" });
  } else {
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
    footer1.classList.add("hidden");
    footer2.classList.remove("hidden");
    document.querySelector(".card").style.maxWidth = "1000px";
    ZOHO.CRM.UI.Resize({ width: "950", height: "auto" });
  }
}
```

### Validation Pattern

```js
async function validateStep1() {
  const triggers = {
    contact: document.getElementById("contact-trigger"),
    country: document.getElementById("country-trigger"),
  };
  // Reset
  Object.values(triggers).forEach((t) => t.classList.remove("error"));

  let hasError = false;
  if (!contactLookup.id) {
    triggers.contact.classList.add("error");
    hasError = true;
  }
  if (!selectedCountry) {
    triggers.country.classList.add("error");
    hasError = true;
  }
  if (hasError) {
    showToast("Please fill in all mandatory fields.", "error");
    return;
  }

  // Async pre-fetch before advancing
  showOverlay(true);
  await prefillNextStep();
  showOverlay(false);

  goToStep(2);
}
```

---

## 13. JavaScript UI Conventions

### State Management

```js
// Lookup fields always stored as { name, id } objects
let accountLookup = { name: "", id: null };
let contactLookup = { name: "", id: null };
let contactAccount = { name: "", id: null }; // contacts's associated account

// Plain text fields
let selectedCountry = "";

// Complex state objects
let selectedAddress = { country: "", street: "", city: "", state: "", zip: "" };
```

### Keyboard Navigation for Modal Lists

```js
function modalSearchKeydown(e) {
  const options = [...document.querySelectorAll(".country-modal-option")];
  if (e.key === "ArrowDown") {
    focusedIndex = Math.min(focusedIndex + 1, options.length - 1);
    updateFocus(options);
  }
  if (e.key === "ArrowUp") {
    focusedIndex = Math.max(focusedIndex - 1, 0);
    updateFocus(options);
  }
  if (e.key === "Enter" && focusedIndex >= 0) selectItem(options[focusedIndex].dataset.value);
}
function updateFocus(options) {
  options.forEach((o, i) => o.classList.toggle("focused", i === focusedIndex));
  if (options[focusedIndex]) options[focusedIndex].scrollIntoView({ block: "nearest" });
}
```

### Entity Resolution Pattern

When reading lookup fields from Zoho CRM API responses (which may return an object or sometimes a string):

```js
const raw = record.Account_Name;
const lookup = {
  name: raw?.name ?? (typeof raw === "string" ? raw : ""),
  id: raw?.id ?? null,
};
```

### Placeholder ↔ Value Toggle Pattern

```js
const displayEl = document.getElementById("my-display");
displayEl.textContent = value || "Select option…";
displayEl.classList.toggle("placeholder", !value);
```

### Error State Toggle Pattern

```js
// Set error
trigger.classList.add("error");

// Clear error
trigger.classList.remove("error");
```

---

## 14. Accessibility Patterns

| Pattern               | Implementation                                                 |
| --------------------- | -------------------------------------------------------------- |
| Trigger buttons       | `tabindex="0"`, `role="button"`, `aria-haspopup="dialog"`      |
| Modal overlays        | `role="dialog"`, `aria-modal="true"`, `aria-label="…"`         |
| Results lists         | `role="listbox"` on `<ul>`, `role="option"` on `<li>`          |
| Close buttons         | `aria-label="Close"`                                           |
| Clear buttons         | `aria-label="Clear {field}"`                                   |
| Keyboard in triggers  | `onkeydown`: `Enter` or `Space` fires `openModal()`            |
| Escape key            | Global `keydown` listener dismisses top-most open modal        |
| Focus return          | After modal close, focus returns to the trigger that opened it |
| Required field marker | `::after` CSS (visual), `class="required"` (semantic label)    |

---

## 15. Scroll Performance

For scrollable lists inside modals, transitions and pointer events are disabled during active scrolling using a JS optimization:

```js
(function attachScrollOptimizers() {
  function optimize(id) {
    const el = document.getElementById(id);
    if (!el) return;
    let timer;
    el.addEventListener(
      "scroll",
      () => {
        if (!el.classList.contains("is-scrolling")) el.classList.add("is-scrolling");
        clearTimeout(timer);
        timer = setTimeout(() => el.classList.remove("is-scrolling"), 200);
      },
      { passive: true },
    );
  }
  optimize("country-list");
  optimize("lookup-list");
})();
```

```css
/* CSS response to .is-scrolling */
.country-modal-list.is-scrolling .country-modal-option {
  transition: none;
  pointer-events: none;
}
```

Benefits: prevents input lag and frame drops during fast scroll on large lists.

---

## 16. Zoho CRM Integration Patterns

### Widget Initialization

```js
ZOHO.embeddedApp.on("PageLoad", async (data) => {
  ZOHO.CRM.UI.Resize({ width: "950", height: "auto" });

  // Robust ID extraction
  const idValue = data.EntityId || data[0]?.EntityId || data.id || data[0]?.id;
  DEAL_ID = idValue ? String(idValue) : null;

  if (DEAL_ID) {
    await Promise.all([loadCountries(), loadDeal(), fetchMetadata()]);
  } else {
    showToast("Invalid context: No Deal ID found.", "error");
  }
});
ZOHO.embeddedApp.init();
```

### Common API Patterns

```js
// Fetch a single record
const resp = await ZOHO.CRM.API.getRecord({ Entity: "Deals", RecordID: DEAL_ID });
const record = resp?.data?.[0];

// Search records
const resp = await ZOHO.CRM.API.searchRecord({
  Entity: "Contacts",
  Type: "word",
  Query: searchQuery,
});
const records = resp?.data ?? [];

// Criteria search
const resp = await ZOHO.CRM.API.searchRecord({
  Entity: "Contacts",
  Type: "criteria",
  Query: `(Account_Name:equals:${accountId})`,
});

// List all records (with pagination)
const resp = await ZOHO.CRM.API.getAllRecords({
  Entity: "Accounts",
  sort_order: "desc",
  per_page: 20,
  page: 1,
});

// Get related records
const resp = await ZOHO.CRM.API.getRelatedRecords({
  Entity: "Accounts",
  RecordID: String(accountId),
  RelatedList: "Pricing_Config",
  page: 1,
  per_page: 200,
});

// Update record
const resp = await ZOHO.CRM.API.updateRecord({
  Entity: "Deals",
  APIData: {
    id: String(DEAL_ID),
    Field_Name: value,
    Lookup_Field: { name: "Name", id: String(id) },
  },
  Trigger: [],
});
const status = resp?.data?.[0]?.code ?? resp?.data?.[0]?.status;
if (status === "SUCCESS" || status === "success") {
  /* OK */
}

// Create record
const resp = await ZOHO.CRM.API.insertRecord({
  Entity: "Contacts",
  APIData: { First_Name: first, Last_Name: last, Account_Name: { name, id } },
  Trigger: ["workflow"],
});
const result = resp?.data?.[0];
if (result?.code === "SUCCESS" || result?.status === "success") {
  const newId = result.details.id;
}

// Get module field metadata
const meta = await ZOHO.CRM.META.getFields({ Entity: "Pricing_Config" });
const field = meta.fields.find((f) => f.api_name === "Record_Type");
const options =
  field?.pick_list_values
    ?.filter((opt) => opt.display_value !== "-None-")
    ?.map((opt) => opt.display_value) ?? [];

// Blueprint proceed
ZOHO.CRM.BLUEPRINT.proceed();

// Resize widget
ZOHO.CRM.UI.Resize({ width: "950", height: "auto" });
```

### Lookup Field Data Type

Always cast IDs to strings (`String(id)`) before sending to the API. Always pass lookup objects with both `name` and `id`:

```js
// Correct
{ name: accountLookup.name, id: String(accountLookup.id) }

// Wrong — ID as number
{ name: accountLookup.name, id: accountLookup.id }
```

### Refresh Pattern

```js
function refreshData() {
  try {
    window.top.location.href = window.top.location.href; // reload the parent CRM tab
  } catch (err) {
    window.location.reload(); // fallback: reload the widget iframe
  }
}
```

---

## Quick Reference — Icon SVG Snippets

All icons are Lucide-style, `stroke-only`, `fill: none`, `stroke-width: 2`, `stroke-linecap: round`, `stroke-linejoin: round`.

| Icon               | Usage                 | SVG path                                                                                                                                                                       |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Check / Save       | Success, save button  | `<polyline points="20 6 9 17 4 12"/>`                                                                                                                                          |
| X / Close          | Modal close, clear    | `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`                                                                                                   |
| Search             | Lookup modal          | `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>`                                                                                                                  |
| Plus               | Add row, create       | `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`                                                                                                 |
| Arrow Right (Next) | Next button           | `<polyline points="9 18 15 12 9 6"/>`                                                                                                                                          |
| Arrow Left (Back)  | Go back button        | `<polyline points="15 18 9 12 15 6"/>`                                                                                                                                         |
| Refresh            | Refresh button        | `<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>`                                                                                         |
| Person / Contact   | Contact field         | `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`                                                                                          |
| Building / Account | Account field         | `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>`                                                                        |
| Globe              | Country               | `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>` |
| Location Pin       | Address / destination | `<path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>`                                                          |
| Layers             | Deal / widget         | `<path d="M12 2L2 7l10 5 10-5-10-5z"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>`                                                              |
| Chevron Down       | Select dropdowns      | `<path d="m6 9 6 6 6-6"/>`                                                                                                                                                     |
| Info circle        | Info toast            | `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`                                                             |
| Error circle       | Error toast           | `<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>`                                                                   |

---

_Last updated: April 2026 · Source: `Assign_to_Client` widget (`widget.html`, `widget.css`, `widget.js`)_
