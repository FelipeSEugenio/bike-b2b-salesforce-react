# 🚴 Bike B2B Sales App — React + GraphQL UI API

> A production-style Salesforce application built with React, TypeScript, and the Salesforce GraphQL UI API — **zero Apex required.**

🇧🇷 Português: [README-ptbr.md](./README-ptbr.md)

![Salesforce](https://img.shields.io/badge/Salesforce-Multi--Framework-00A1E0?style=for-the-badge&logo=salesforce&logoColor=white)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![GraphQL](https://img.shields.io/badge/GraphQL-UI_API-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Dark_Mode-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

---

## 🧠 Project Overview

The **Bike B2B Sales App** is a full-featured Salesforce application that runs as a **React uiBundle** inside the **Salesforce Multi-Framework / Agentforce 360** runtime. Built as a **portfolio-grade project**, it demonstrates what a modern, framework-native UI looks like on Salesforce — replacing traditional Apex-driven patterns with declarative GraphQL data access and a custom design system.

Sales representatives and B2B buyers can:

- 🔍 **Browse** a live product catalog with real-time search and brand filtering
- 🛒 **Build** draft orders with per-line quantity controls and a floating order panel
- 🔗 **Link** orders to Salesforce Accounts via a live lookup
- 📊 **Track** orders through their lifecycle with a status dashboard
- ✅ **Submit** orders through server-side Flow validation — no Apex needed

---

## 💼 Business Scenario

A bicycle distributor needs a Salesforce-based solution to modernize their B2B sales operations and move away from manual spreadsheet processes.

Their sales team needs to:

- Browse an internal product catalog in real time
- Build purchase orders on behalf of client accounts
- Submit orders with built-in data validation
- Monitor order statuses at a glance via a centralized dashboard

This project simulates that full workflow inside a Salesforce org, using only the platform's native GraphQL UI API and declarative automation — with no custom Apex backend.

---

## ⚡ Tech Stack

| Layer           | Technology                                           |
| --------------- | ---------------------------------------------------- |
| **Frontend**    | React (TypeScript)                                   |
| **Runtime**     | Salesforce Multi-Framework uiBundle                  |
| **Data Access** | Salesforce GraphQL UI API via `@salesforce/sdk-data` |
| **Styling**     | Tailwind CSS (custom design tokens, dark mode)       |
| **Validation**  | Salesforce Record-Triggered Flow                     |
| **Build Tool**  | Vite / npm                                           |

---

## 🏗️ Architecture

### Salesforce Multi-Framework uiBundle

The app is deployed as a **uiBundle** to a Salesforce org and exposed via the App Launcher or an Experience Cloud site. The Multi-Framework runtime handles bootstrapping, authentication context, and SDK injection — the React app consumes platform-provided SDK APIs directly.

### 🔌 Data Layer — GraphQL UI API (No Apex)

All data access flows through the **Salesforce GraphQL UI API** via `@salesforce/sdk-data`. There is no Apex controller at any point in the data flow.

```
React Components
      │
      ▼
  Custom Hooks  (useBikeCatalog, useOrders)
      │
      ▼
  graphqlClient.ts  ←  createDataSDK()
      │
      ▼
  Salesforce GraphQL UI API
      │
      ▼
  Bike__c  /  Bike_Order__c  /  Account
```

- **`src/api/graphqlClient.ts`** — single typed gateway for all GraphQL operations. Initializes the SDK, executes queries/mutations, unwraps `response.data`, and surfaces typed errors.
- **`src/api/queries.ts`** — centralizes all query and mutation strings (`GET_BIKES_QUERY`, `SEARCH_ACCOUNTS_QUERY`, `GET_ORDERS_QUERY`, order mutations via `Bike_Order__cCreate`).
- **`src/services/bikeService.ts`** — exposes `useBikeCatalog`, mapping raw UI API edges/nodes into clean `Bike` domain types and returning `{ bikes, loading, error }`.

### 🛡️ Server-Side Validation — Record-Triggered Flow

A **Record-Triggered Flow** (`Bike_Order_Validate_Submitted`) acts as the server-side guardrail for order submissions:

| Condition                                                   | Result                                         |
| ----------------------------------------------------------- | ---------------------------------------------- |
| `Status__c = "Submitted"` AND `Account__c` is **blank**     | ❌ Save blocked with user-facing error message |
| `Status__c = "Submitted"` AND `Account__c` is **populated** | ✅ Save proceeds normally                      |

Pure declarative validation — no Apex, no extra records, no side effects.

---

## ✨ Features

### 🚴 Bike Catalog

- **Real-time search & filter** — filter by name/model text and brand dropdown simultaneously
- **Product table** — bike image, name, model, brand, and formatted price per row
- **Add to order** — one-click addition to the live Draft Order panel with quantity controls

### 🛒 Order Creation

- **Draft Order Panel** — floating sidebar on desktop showing live line items, quantity controls, account lookup, and running total
- **Account Lookup** — live search against Salesforce `Account` records; selection stored on the order
- **GraphQL Mutations** — submitting the draft creates a `Bike_Order__c` record via the GraphQL UI API
- **Flow Validation** — submission without an Account is blocked by the Record-Triggered Flow, with the error surfaced back to the UI

### 📊 Orders Dashboard

- **KPI cards** — at-a-glance totals for orders by status (Draft, Submitted, etc.)
- **Order list** — `Bike_Order__c` records with order number, status badge, account name, total value, and creation date
- **Status badges** — styled visual indicators per order state
- **Light & dark mode** — full theme support across all dashboard components

### 🎨 Design System

- Full **light and dark theme** with `localStorage` persistence and system preference fallback
- **Responsive layouts** — table-to-card switch at `md` breakpoint for mobile-first compatibility
- **Tailwind CSS design tokens** — semantic color palette, 4-point spacing scale, consistent elevation and typography

---

## 🖼️ Screenshots

### 🗂️ Catalog — Light Mode

![Catalog Light Mode](./docs/screenshots/Catalog%20%E2%80%93%20Light%20Mode.png)

### 🌙 Catalog — Dark Mode

![Catalog Dark Mode](./docs/screenshots/Catalog%20%E2%80%93%20Dark%20Mode.png)

### 📋 Orders — Light Mode

![Orders Light Mode](./docs/screenshots/Orders%20%E2%80%93%20Light%20Mode.png)

### 🌙 Orders — Dark Mode

![Orders Dark Mode](./docs/screenshots/Orders%20%E2%80%93%20Dark%20Mode.png)

### 📊 Dashboard — Light Mode

![Dashboard Light Mode](./docs/screenshots/Dashboard%20-%20Light%20Mode.png)

### 🌙 Dashboard — Dark Mode

![Dashboard Dark Mode](./docs/screenshots/Dashboard%20-%20Dark%20Mode.png)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm** v9+
- A **Salesforce org** with:
  - Multi-Framework uiBundle support enabled (Agentforce 360 / SF Multi-Framework runtime)
  - GraphQL API enabled (appropriate feature flag / API version)
  - Custom objects `Bike__c`, `Bike_Order__c` created and populated with sample data
  - `Bike_Order_Validate_Submitted` Flow deployed and activated
- **Salesforce CLI** (`sf`) installed and authenticated

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd <repo-directory>

# 2. Install dependencies
npm install

# 3. Authenticate with your org
sf org login web --alias my-org
sf config set target-org my-org

# 4. Build the uiBundle
npm run build

# 5. Deploy to Salesforce
sf project deploy start
```

Then open the app via the **App Launcher** in your org or navigate to the configured **Experience Cloud site**.

### Iterative Development

```bash
npm run build -- --watch
```

TypeScript type errors are surfaced at build time. Redeploy with `sf project deploy start` after each build.

---

## 🔭 Future Work

- [ ] **Agentforce Integration** — embed an AI-powered assistant to surface order insights and recommendations
- [ ] **Advanced Analytics** — charts and trend visualizations on the Orders Dashboard
- [ ] **Order Line Items** — expand `Bike_Order_Item__c` support with per-product breakdown in the UI
- [ ] **Experience Cloud** — deploy as a full Experience Cloud site for external B2B buyers

---

## 👨‍💻 Author

**Felipe Eugênio** — Salesforce Developer Jr  
🇧🇷 São Paulo, Brazil | [LinkedIn](https://www.linkedin.com/in/felipe-de-siqueira-eugenio/) | [Trailhead](https://www.salesforce.com/trailblazer/felipeseugenio)

---

_Built with React · Salesforce Multi-Framework uiBundle · GraphQL UI API · Tailwind CSS_
