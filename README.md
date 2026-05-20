# B2B Bike Catalog on Salesforce (React + GraphQL UI API)

A React uiBundle application running natively on Salesforce Multi-Framework, providing a B2B bike catalog and order flow powered entirely by the Salesforce GraphQL UI API — no Apex required.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Design System & Theming](#design-system--theming)
5. [Responsive Layouts](#responsive-layouts)
6. [Screenshots](#screenshots)
7. [Getting Started](#getting-started)
8. [Development & Branching](#development--branching)
9. [Future Work](#future-work)
10. [License / Credits](#license--credits)

---

## Overview

The **B2B Bike Catalog** app is a modern, production-style Salesforce application built as a **React uiBundle** running inside the **Salesforce Multi-Framework / Agentforce 360** runtime. It allows B2B sales representatives and buyers to:

- Browse a catalog of bike models (`Bike__c`) with search and brand filtering.
- Build draft purchase orders by selecting products and quantities.
- Associate orders with Salesforce Accounts via a live lookup.
- Track and manage orders (`Bike_Order__c`) through their lifecycle.

**Tech stack at a glance:**

| Layer      | Technology                                           |
| ---------- | ---------------------------------------------------- |
| Frontend   | React (TypeScript)                                   |
| Runtime    | Salesforce Multi-Framework uiBundle                  |
| Data       | Salesforce GraphQL UI API via `@salesforce/sdk-data` |
| Styling    | Tailwind CSS (custom design tokens, dark mode)       |
| Validation | Salesforce Record-Triggered Flow                     |
| Build      | Vite / npm                                           |

This project is designed as a **portfolio-quality example** of what a modern, framework-native UI looks like on Salesforce — demonstrating GraphQL data access, custom design systems, and responsive layout without a single line of Apex.

---

## Architecture

### Salesforce Multi-Framework uiBundle

The app runs as a **uiBundle** deployed to a Salesforce org, making it available inside the App Launcher or an Experience Cloud site. The Multi-Framework runtime handles bootstrapping, authentication context, and SDK injection — the React app simply consumes the platform-provided SDK APIs.

### Data Layer — GraphQL UI API (No Apex)

All data access goes through the **Salesforce GraphQL UI API**, accessed via `@salesforce/sdk-data`. There is no Apex controller involved at any point in the data flow.

- **`src/api/graphqlClient.ts`** is the single typed gateway for all GraphQL operations. It:
  - Initializes the SDK with `createDataSDK()`.
  - Executes queries and mutations via `sdk.graphql`.
  - Unwraps `response.data` and surfaces typed errors when `response.errors` is present or `data` is missing.

- **`src/api/queries.ts`** centralizes all GraphQL query and mutation strings:
  - `GET_BIKES_QUERY` — fetches `Bike__c` records via `uiapi { query { Bike__c { edges { node { ... } } } } }`.
  - `SEARCH_ACCOUNTS_QUERY` — searches `Account` by `Name` for the order's account lookup field.
  - `GET_ORDERS_QUERY` — lists `Bike_Order__c` records with status, linked account, total, and creation date.
  - Order mutations use the UI API's object-specific mutation pattern (`Bike_Order__cCreate` with `Bike_Order__cCreateInput`), consistent with the `UIAPIMutations` schema.

### Services and Hooks

- **`src/services/bikeService.ts`** exposes a `useBikeCatalog` hook that:
  - Calls `executeGraphQL(GET_BIKES_QUERY)`.
  - Maps raw UI API edges/nodes into a clean `Bike` domain type with fields: `id`, `name`, `model`, `brand`, `price`, `displayPrice`, and `imageUrl`.
  - Returns `{ bikes, loading, error }` for consumption by UI components, keeping data-fetching logic completely separate from rendering.

### Server-Side Validation — Record-Triggered Flow

A **Record-Triggered Flow** named `Bike_Order_Validate_Submitted` (API name: `Bike_Order_Validate_Submitted`) acts as the server-side guardrail for order submissions:

- **Trigger:** on create or update of `Bike_Order__c`, only when the record is updated to meet the entry condition `Status__c = "Submitted"`.
- **Logic:** if `Account__c` is blank at submission time, the Flow blocks the save with the user-facing message: `You must select an Account before submitting the order.`
- If `Account__c` is populated, the save proceeds normally.
- The Flow does not create extra records, does not manage stock, and does not invoke Apex — it is a pure declarative validation layer.

---

## Features

### Bike Catalog

- **Search & Filter:** real-time filtering by name/model text and by brand using a dropdown. Filters work together.
- **Product Table:** displays bike image, name, model, brand, and formatted price per row.
- **Add to Order:** each row has an "Add to order" button that adds the item to the live Draft Order panel, with quantity controls.

### Order Creation

- **Draft Order Panel:** a floating sidebar on the Catalog page shows items in progress, a quantity control per line, an account lookup field, and the running total.
- **Account Lookup:** searches Salesforce `Account` records in real time; the selected account is stored on the order.
- **GraphQL Mutations:** submitting the draft creates a `Bike_Order__c` record (and associated line items) via the GraphQL UI API.
- **Flow Validation:** if an order is submitted without an Account, the Salesforce Flow blocks the record save and surfaces the validation error back to the UI.

### Orders View

- A list of all `Bike_Order__c` records for the current context, showing order number, status badge, account name, total value, and creation date.
- Status is displayed as a styled badge (e.g., `Draft`, `Submitted`).

### Design System

- Full light and dark theme support.
- Responsive layouts tailored for desktop and mobile use cases.
- Tailwind CSS-based component library with consistent design tokens.

---

## Design System & Theming

### Design Philosophy

The app uses a **corporate-tech aesthetic**: clean whites and light grays in light mode; deep navy/slate backgrounds in dark mode. The goal is to feel native to a professional B2B tool, while being visually distinctive from generic Salesforce Lightning styling.

### Design Tokens

Tokens are configured via Tailwind's theme extension and CSS custom properties in `global.css`. They are organized semantically, not by raw hex values:

**Colors:**

| Token                          | Purpose                                                      |
| ------------------------------ | ------------------------------------------------------------ |
| `bg-body`                      | Page-level background                                        |
| `bg-surface`                   | Cards, tables, panels                                        |
| `color-primary`                | Main CTAs, buttons, active nav links (blue)                  |
| `color-accent`                 | Highlights, badges, secondary actions (amber/secondary blue) |
| `color-border` / `color-muted` | Borders, secondary text, subtle UI dividers                  |
| `color-success`                | Positive status indicators                                   |
| `color-error`                  | Validation errors, destructive actions                       |
| `color-warning`                | Caution states                                               |

**Spacing:** 4-point scale (multiples of 4px), mapped directly to Tailwind's default spacing scale (`p-4` = 16px, `p-2` = 8px, etc.).

**Border Radius:**

- `rounded-md` for form controls and inputs.
- `rounded-lg` for cards and elevated panels.

**Shadows:** card-level elevation using `shadow-sm` (default) and `shadow-md` for hover and active states.

**Typography:**

- Page titles: `text-2xl font-bold` or `text-3xl font-bold`.
- Section titles / card headings: `text-lg font-semibold`.
- Body text: `text-sm` or `text-base` with `text-muted` for secondary content.

### Dark Mode Implementation

Dark mode uses Tailwind's **`darkMode: 'class'`** strategy:

1. A toggle button in `Header.tsx` switches between light and dark themes.
2. On toggle, a `.dark` class is added to or removed from the root `<html>` element.
3. The user's preference is persisted to `localStorage` so it survives page reloads.
4. On first load, if no preference is stored, the app falls back to the **device/system preference** via `prefers-color-scheme`.
5. All components use `dark:` Tailwind variants alongside base classes, ensuring every surface, text, border, and interactive element adapts correctly.

For a deeper breakdown of the color palette and theming decisions, see [`walkthrough.md`](./walkthrough.md) in the repository.

---

## Responsive Layouts

The app is built and tested across mobile, tablet, and desktop breakpoints.

### Catalog and Orders — Table to Card Switch

- **Desktop (≥ `md`):** the Bike Catalog and Orders views render as standard table layouts with a fixed header row and data rows, optimized for wide screens where multiple columns fit comfortably.
- **Mobile (< `md`):** tables switch to **card-style layouts** where each record becomes a stacked card. This is implemented using `md:hidden` / `md:flex` (and equivalent) patterns to swap between table rows and card blocks depending on breakpoint.

### Filters and Side Panels

- **Mobile:** filter inputs (search, brand dropdown) stack **vertically**, one per row, for comfortable touch interaction.
- **Desktop:** filters arrange as a horizontal **grid/columns**, keeping all filter controls visible at a glance without requiring scrolling.

### Overall Layout

- The `Header` is always full-width with a nav bar that collapses gracefully.
- The Catalog page's Draft Order panel is positioned as a fixed sidebar on desktop and transitions to an inline/bottom panel on smaller screens.
- All paddings, gaps, and font sizes use responsive Tailwind utilities to ensure comfortable reading and interaction at every viewport size.

---

## Screenshots

> Screenshots are stored in `./docs/screenshots`.

### Catalog – Light Mode (Desktop)

![Catalog Light Mode](./docs/screenshots/Catalog%20%E2%80%93%20Light%20Mode.png)

### Catalog – Dark Mode (Desktop)

![Catalog Dark Mode](./docs/screenshots/Catalog%20%E2%80%93%20Dark%20Mode.png)

### Orders – Light Mode (Desktop)

![Orders Light Mode](./docs/screenshots/Orders%20%E2%80%93%20Light%20Mode.png)

### Orders – Dark Mode (Desktop)

![Orders Dark Mode](./docs/screenshots/Orders%20%E2%80%93%20Dark%20Mode.png)

---

## Getting Started

### Prerequisites

- **Node.js** v18+ and **npm** v9+.
- A **Salesforce org** with:
  - Multi-Framework uiBundle support enabled (Agentforce 360 / SF Multi-Framework runtime).
  - **GraphQL API** enabled (available in orgs with the appropriate feature flag or API version).
  - Custom objects `Bike__c`, `Bike_Order__c` (and optionally `Bike_Order_Item__c`) created and populated with sample data.
  - The `Bike_Order_Validate_Submitted` Flow deployed and activated.
- **Salesforce CLI** (`sf`) installed and authenticated to the target org.

### Setup

1. **Clone the repository:**

   ```
   git clone <repo-url>
   cd <repo-directory>
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Authenticate with Salesforce:**

   ```
   sf org login web --alias my-org
   sf config set target-org my-org
   ```

   Ensure the authenticated user has access to the relevant custom objects and the GraphQL API.

4. **Build the uiBundle:**

   ```
   npm run build
   ```

   This compiles the React app into a deployable uiBundle artifact.

5. **Deploy to Salesforce:**

   ```
   sf project deploy start
   ```

   Deploy the uiBundle and any associated metadata (objects, flows, permissions) to the org.

6. **Open the app:**
   - Via the **App Launcher** inside your Salesforce org, search for the app name.
   - Or navigate to the configured **Experience Cloud site** where the uiBundle is embedded.

### Iterative Development

For iterative builds during development, run:

```
npm run build -- --watch
```

and redeploy as needed. TypeScript type errors are surfaced at build time.

---

## Development & Branching

The project follows a **feature-branch workflow** to keep logical changes isolated and pull requests clean:

| Branch                               | Purpose                                                                                                                                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fix/graphql-order-mutations-uiapi`  | Fixes to the GraphQL mutation pattern, migrating from the legacy `RecordCreateInput` / `recordCreate` approach to the correct `<ObjectApiName>Create` + `<ObjectApiName>CreateInput` UI API pattern. |
| `feat/app-tailwind-design`           | Full design system implementation: Tailwind config, design tokens, light/dark theme toggle, and responsive layouts.                                                                                  |
| `feat/orders-dashboard` _(upcoming)_ | Planned analytics and KPI dashboard on top of `Bike_Order__c` data.                                                                                                                                  |

Logic fixes and UI/design refinements are kept in separate branches so that each PR has a clear, reviewable scope.

---

## Future Work

- **Orders Dashboard:** add an analytics view with KPIs (total revenue, orders by status, top models) and charts, built on top of the existing `GET_ORDERS_QUERY` GraphQL data and the current Tailwind design system.
- **Order Detail View:** a drill-down page for individual `Bike_Order__c` records showing line items, status history, and account details.
- **Agentforce Integration:** surface the catalog and order flow as tools available to an Agentforce Agent, enabling natural-language B2B ordering workflows.
- **Pagination and Performance:** implement cursor-based pagination for large `Bike__c` catalogs via GraphQL `after` / `first` arguments.
- **Enhanced Validation:** extend the Flow to handle additional business rules (stock limits, pricing tiers) without touching Apex.

---

## License / Credits

This project is a **demo and portfolio application**, created to showcase modern Salesforce development patterns using React, the GraphQL UI API, and a custom Tailwind-based design system — all without Apex.

Feel free to use it as a reference or starting point for your own Salesforce uiBundle projects.

---

_Built with React · Salesforce Multi-Framework uiBundle · GraphQL UI API · Tailwind CSS_
