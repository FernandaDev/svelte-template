Project guidelines:

- use bun for the package manager
- when installing new packages, use `bun add` instead of manually editing the package.json file
- use modern svelte and sveltekit patterns and primitives
- avoid `as any` at all costs, try to infer types from functions as much as possible
- when defining convex actions, queries, and mutations that are exposed to the client use the `authed` setup in `src/convex/authed`
- when defining convex actions, queries, and mutations that are called from the backend use the `private` setup in `src/convex/private`
- use effect v4 for all backend code
- use the convex service for calling convex queries, actions, and mutations from the backend
- use tailwindcss for styling whenever possible, only resort to custom css if needed
- every svelte component should have `lang="ts"`
- after making changes to convex, run `bun run convex:gen` to generate the new api
- run `bun run lint` to check for linting errors, `bun run format`, and `bun run check` to check for errors after making changes

### Svelte 5 Runes

- Use Svelte 5 runes syntax (`$state`, `$derived`, `$props()`)
- **Derived values**: When using `$derived(() => { ... })`, call the function in templates: `{derivedValue()}`
- Use `$state<T>()` for typed state when type inference is insufficient

### TypeScript

- Strict mode enabled - always type props and returns
- Define interfaces for component props: `interface Props { ... }`
- Destructure with defaults in `$props()`: `let { foo = 'default' }: Props = $props();`
- Use `import type` for type-only imports
- Use `import type { ... }` for importing types from modules

### Imports

- Group imports in this order: external libs, then internal modules (`$lib/`, `$app/`, `@convex/`)

### Components

- File naming: kebab-case for routes (e.g., `user-profile/+page.svelte`), PascalCase for components
- Component props: define interface Props, destructure with defaults in `$props()`
- Use `$props()` rest pattern for forwarding props: `let { ...restProps }: Props = $props();`
- When creating a clickable div, don't forget to use all of these properties: 'onclick', 'onkeypress', 'role', 'tabindex', 'aria-label'
- When adding a text use the `Label` component instead of using default CSS values like '<p>', '<h1>', '<h2>', '<h3>', <label>

### Legacy APIs - NEVER USE

- **NEVER use `<svelte:component>`** - Components are now dynamic by default in Svelte 5, just use the component variable directly
- **NEVER use `<slot>`** - Use snippets instead with `{#snippet name()}` and `{@render name()}`
- **NEVER use `<svelte:fragment>`** - Use named snippet props instead
- **NEVER use `let:` directives** - Pass data to snippets as parameters instead

### Snippets API (Svelte 5 replacement for slots)

- Use `{#snippet name()}` to define reusable chunks of markup
- Use `{@render name()}` to render snippets
- Pass snippets as props: `{#snippet row(item)}<td>{item.name}</td>{/snippet}`
- Implicit children snippet: content inside component tags automatically becomes the `children` prop
- Example:

  ```svelte
  {#snippet header()}
  	<th>fruit</th>
  	<th>qty</th>
  {/snippet}

  <Table {header}>
  	{#snippet row(d)}
  		<td>{d.name}</td>
  		<td>{d.qty}</td>
  	{/snippet}
  </Table>
  ```

### App-Specific Patterns

#### Convex Auth Namespaces

Three authorization tiers for Convex functions:

- **`authed/`**: Client-facing functions. Uses `authedQuery`/`authedMutation`/`authedAction` from `helpers.ts`. Validates session token, injects `ctx.user`. Used for CRUD operations the current user can perform.
- **`admin/`**: Admin-only functions. Uses `adminQuery`/`adminMutation` from `helpers.ts`. Validates session token AND checks `user.role === 'admin'`. Injects `ctx.admin` with the user document.
- **`private/`**: Server-to-server functions. Uses `privateQuery`/`privateMutation`/`privateAction` from `helpers.ts`. Protected by `CONVEX_PRIVATE_BRIDGE_KEY` API key guard. Called from SvelteKit server-side via the `ConvexPrivateService` Effect wrapper.

#### User Identity Pattern

- Auth functions live in `auth.ts` (`signUp`, `signIn`, `signOut`)
- Session validation lives in `authed/_shared.ts` (`findUserBySession`, `findUserByEmail`)
- `ensureUser` updates the `updatedAt` timestamp on each mutation
- Types `AuthedQueryCtx`, `AuthedMutationCtx` extend Convex ctx with `user`

#### Data Access in SvelteKit Pages

- Use `useQuery(api.authed.todos.getTodos, { sessionToken })` for reactive data fetching
- Use `useConvexClient().mutation(api.authed.todos.createTodo, { sessionToken, ... })` for writes
- Get session token from auth store: `getAuthContext().sessionToken`
- Handle loading state with `{#if !query.data}` + Skeleton components
- Handle empty state with a friendly message and CTA button

#### Auth Flow in Routes

- Root layout (`+layout.svelte`): minimal, just CSS + favicon
- App layout (`app/+layout.svelte`): composes `AuthWrapper > ConvexWrapper > EnsureUser > AuthenticatedLayout > children`
- `AuthWrapper` shows `SignIn` component when not authenticated
- `EnsureUser` calls `ensureUser` mutation on mount to update the user record
- `AuthenticatedLayout` provides sidebar + header + main content area

#### When Making Changes

1. Add/modify schema in `schema.ts`, then regenerate with `bun run convex:gen` (requires running dev server)
2. Add Convex functions in the appropriate namespace (`authed/`, `admin/`, `private/`)
3. Add SvelteKit pages under `src/routes/app/`
4. Use shadcn-svelte components from `$lib/components/ui/`
5. Run `bun run lint` and `bun run check` to verify
