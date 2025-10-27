# Routing

SvelteKit's filesystem-based router makes it easy to create and organize your application's routes.

## Route Structure

Routes are determined by the directory structure of your `src/routes` directory. Each `.svelte` file in this directory becomes a route.

```
src/routes/
├── +page.svelte          → /
├── about.svelte          → /about
├── blog/
│   ├── +page.svelte      → /blog
│   └── [slug].svelte     → /blog/:slug
└── api/
    └── posts/
        └── +server.js    → POST /api/posts
```

## Dynamic Routes

Create dynamic routes by wrapping a segment in square brackets:

```
src/routes/posts/[id].svelte → /posts/123
```

The parameter is available via the `page` store:

```svelte
<script>
	import { page } from '$app/stores';
	const { id } = $page.params;
</script>

<h1>Post {id}</h1>
```

## Rest Parameters

Catch multiple segments with rest parameters:

```
src/routes/files/[...path].svelte → /files/a/b/c
```

The path is available as an array in `$page.params.path`.

## Layout Nesting

Layouts can be nested to share UI across multiple routes:

```
src/routes/
├── +layout.svelte
└── blog/
    ├── +layout.svelte
    └── [slug].svelte
```

## Server Routes

Create API endpoints with `+server.js` files:

```javascript
export async function GET() {
	return new Response('Hello!');
}

export async function POST({ request }) {
	const data = await request.json();
	return new Response(JSON.stringify({ success: true }));
}
```

## Error Handling

Create a `+error.svelte` file to handle errors in your route:

```svelte
<script>
	import { page } from '$app/stores';
</script>

<h1>{$page.status}</h1><p>{$page.error?.message}</p>
```
