# TODO App

A modern TODO application built with SvelteKit 5 and Convex.

## Features

- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Filter by completed status
- Admin dashboard for overview
- Real-time data sync with Convex
- Built-in authentication

## Tech Stack

- **Frontend**: SvelteKit with Svelte 5 runes
- **Styling**: TailwindCSS v4 with shadcn-svelte
- **Backend/Database**: Convex (local development supported)
- **Authentication**: Convex (session-based)
- **Language**: TypeScript
- **Package Manager**: Bun

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Run `bun install`
4. Run `bun run dev` (uses local Convex by default)

## Project Structure

```
src/
├── convex/         # Convex backend (schema, queries, mutations)
│   ├── auth.ts     # Auth mutations (signUp, signIn, signOut)
│   ├── authed/     # Authenticated client functions
│   ├── admin/      # Admin-only functions
│   └── private/    # Server-to-server functions
├── lib/            # Shared components, services, stores
│   ├── components/ # UI components and layouts
│   ├── services/   # Effect v4 services (Convex)
│   ├── stores/     # Auth store (auth.svelte.ts)
│   └── wrappers/   # Auth and Convex client wrappers
└── routes/         # SvelteKit pages
```

## Patterns

- **authed/**: Client-facing functions protected by session token
- **private/**: Backend-only functions protected by bridge key
- **admin/**: Admin-only functions with role check
- **Effect v4**: Backend services use Effect for type-safe error handling
- **Svelte 5 runes**: All components use `$state`, `$derived`, `$props()`
- **shadcn-svelte**: UI component library with Tailwind v4

## Acknowledgments

This template was inspired by [bendavis](https://github.com/bmdavis419)'s [my-sveltekit-template](https://github.com/davis7dotsh/my-sveltekit-template).

> **Note:** The Effect v4 runtime (`src/lib/runtime.ts`) is included as a ready-to-use foundation for Effect-based backend logic, but is not actively used anywhere in this template. It's kept here as a convenience for projects that want to leverage Effect.
