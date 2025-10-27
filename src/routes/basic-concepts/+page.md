# Basic Concepts

Understanding these fundamental concepts will help you build better SvelteKit applications.

## Routing

SvelteKit uses a filesystem-based router. Each file in the `src/routes` directory corresponds to a route in your application.

### Route Parameters

Dynamic routes are created by wrapping a filename in square brackets:

- `src/routes/posts/[slug].svelte` → `/posts/hello-world`
- `src/routes/users/[id]/settings.svelte` → `/users/123/settings`

### Layout Routes

Create a `+layout.svelte` file to define a layout for all routes in a directory. Layouts can be nested.

## Pages and Components

### Pages (`+page.svelte`)

A `+page.svelte` file in any directory creates a route. This file exports a default Svelte component.

### Layouts (`+layout.svelte`)

Layouts are Svelte components that wrap other components. They receive a `data` prop and a `children` slot.

```svelte
<script>
	import { page } from '$app/stores';
	let { children } = $props();
</script>

<nav>Navigation here</nav>
<main>
	{@render children()}
</main>
```

## Server and Client Code

### Server Code (`+page.server.js`)

Functions in a file named `+page.server.js` run only on the server. Use this to:

- Query databases
- Access environment variables
- Handle sensitive operations

### Client Code

Code in `.svelte` files runs in the browser. Use this to:

- Handle user interactions
- Manage client state
- Update the DOM

## Loading Data

The `load` function in a `+page.server.js` or `+page.js` file runs before the component renders:

```javascript
export async function load() {
	const posts = await fetchPosts();
	return { posts };
}
```

The data is then available in your component.
