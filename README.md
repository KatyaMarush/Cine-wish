# 🎬 Cine-wish

A movie browsing application with category filtering and persistent wishlist functionality — built with a focus on clean architecture, type safety, and server-side rendering readiness.

**[Live Demo](https://cine-wish.vercel.app/)** 

---

## Overview

Cine-wish lets users explore movies by genre, add titles to a personal wishlist, and manage their watchlist across sessions. The goal was to build something that feels like a production app — not a tutorial — with decisions I'd make on a real client project.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 18 | Component model fits the filtering/list architecture cleanly |
| Language | TypeScript | Strict typing across API responses, state, and component props |
| Styling | SCSS modules | Scoped styles, no class conflicts, variables for design tokens |
| Data fetching | REST (TMDB API) | Real external API — handles auth, rate limits, and error states |
| Rendering | SSR-ready structure | Components designed to hydrate from server-rendered HTML |
| State | Local state + Context | No Redux overhead needed at this scale — intentional choice |

---

## Architecture Decisions

### Component structure
Separated concerns strictly: `pages/` for routing, `components/` for UI primitives, `features/` for domain logic (wishlist, filtering). Each layer has a single responsibility.

### TypeScript strictness
All API responses are typed end-to-end. No `any`. The TMDB response types are defined in `src/types/api.ts` and validated at the boundary — runtime errors surface early, not in production.

### Client-side data fetching
Data fetching is handled on the client through custom hooks. Components request data directly from the TMDB API and render loading/error states in the SPA flow.

### Persistent wishlist
Wishlist state is persisted to `localStorage` with a custom hook (`useWishlist`) that abstracts the storage layer. Swapping to an API-backed store later requires changing only the hook internals.

---

## What I Learned

**The interesting challenge:** Category filtering with a real API means dealing with pagination, loading states, and stale data simultaneously. I solved this with a reducer pattern that tracks `status: 'idle' | 'loading' | 'success' | 'error'` alongside the data — keeping UI states explicit instead of derived from multiple booleans.

**What I'd add with more time:**
- Optimistic UI updates for wishlist add/remove
- React Query for server state management and caching
- E2E tests with Playwright for the filtering flows
- Storybook for the component library

---

## Running locally

```bash
git clone https://github.com/KatyaMarush/Cine-wish.git
cd Cine-wish
npm install

# Add your TMDB API key
cp .env.example .env.local
# REACT_APP_TMDB_API_KEY=your_key_here

npm start
```

---

## About

Built by [Katya Marushevskaia](https://github.com/KatyaMarush) — Senior React & TypeScript engineer, open to freelance projects.
📬 marushevskyk@gmail.com
