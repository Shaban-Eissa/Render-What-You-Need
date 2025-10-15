# Dashboard Component Injection

An Angular demo app that showcases dynamic component injection for a customizable dashboard. Users can select which widgets to render at runtime; the app fetches real data, styles with Tailwind CSS. Built with Angular v19 features like new control flow (`@if`, `@for`) and `input()`.

## What it demonstrates

- Dynamic component injection: dashboard renders widget components based on user selection at runtime
- Real data: weather (Open‑Meteo), tasks (JSONPlaceholder), news (Hacker News), and trending repos (GitHub search)
- Modern Angular patterns:
  - Angular v19 control flow (`@if`, `@for`) instead of `*ngIf`/`*ngFor`
  - `input()` for strongly‑typed inputs
  - Standalone components
  - Facade service for UI/data state
- Tailwind CSS for quick, responsive UI

## Quick start

```bash
npm install
ng serve
```

Open `http://localhost:4200/` in your browser.

## How to use

1. Explore the dashboard widgets (Weather, Tasks, Sales mini‑chart, News, GitHub repos).
2. Click “Customize” to open the modal.
3. Toggle widget tiles to add/remove from the dashboard.


## Architecture

- `DashboardFacade` (`src/app/services/dashboard-facade.service.ts`)
  - Owns UI state (`showSettings`, loading/error), selected widgets, and fetched data signals
  - Loads all data in parallel via `DashboardDataService`
  - Persists selection to `localStorage`
- `DashboardDataService` (`src/app/services/dashboard-data.service.ts`)
  - Fetches weather, tasks, news, repos and generates sales series
- `DashboardComponent` (`src/app/components/dashboard.component.ts`)
  - Renders the page, opens the Customize modal, and dynamically injects selected widget components
  - Delegates state and data to the facade
- Widget components (`src/app/widgets/*`)
  - Standalone, accept inputs via `input()` and render Tailwind‑styled UI

## Folder structure (high‑level)

- `src/app/components/dashboard.component.ts` — page + dynamic injection
- `src/app/services/dashboard-facade.service.ts` — facade state and actions
- `src/app/services/dashboard-data.service.ts` — data fetching
- `src/app/widgets/*` — widget components

## Ideas to extend

- Drag‑and‑drop reordering and layout persistence


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

**Built with ❤️ using Angular, Tailwind CSS**
