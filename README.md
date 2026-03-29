# Cine-wish

A movie browsing app with category carousels and a persistent wishlist, built with React, TypeScript, and SCSS.

**[Live Demo](#)** · **[Case study](#what-i-learned)**

---

## Overview

Cine-wish lets users explore movies, open detail pages, and keep a wishlist in `localStorage`. The focus is on clear structure, typed API boundaries, and a cohesive UI.

---

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| UI | React 19 | Components, hooks, and routing fit the app well |
| Language | TypeScript | Types for TMDB responses, props, and hooks |
| Styling | SCSS | Shared variables and component-level styles |
| Data | TMDB REST API | Real-world auth, errors, and rate limits |
| Rendering | Client-side (SPA) | Vite + React; deep links work via SPA fallback on static hosts |
| State | Context + hooks | Wishlist and data fetching without extra global libraries |

---

## Architecture

- **`pages/`** — route-level screens  
- **`components/`** — reusable UI  
- **`src/api/`** — TMDB calls via a small wrapper with retries  
- **`context/`** — wishlist state  
- **`types/`** — shared TypeScript types for API data  

---

## What I learned

**Challenge:** Combining loading and error states with a live API means explicit status handling instead of several boolean flags.

**Next steps:** optimistic wishlist updates, React Query for caching, E2E tests (e.g. Playwright), Storybook for components.

---

## Running locally

```bash
git clone https://github.com/KatyaMarush/Cine-wish.git
cd Cine-wish
npm install
```

Create a `.env` in the project root:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
```

Get a key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

```bash
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:5173`).

Other scripts:

- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally

---

## Deploying (Vercel)

Import the repo in [Vercel](https://vercel.com) and set **`VITE_TMDB_API_KEY`** in the project’s Environment Variables. The included `vercel.json` rewrites client routes to `index.html` so React Router works on refresh.

---

## About

Built by [Katya Marushevskaia](https://github.com/KatyaMarush).

📬 marushevskyk@gmail.com
