# Data Loading

SvelteKit provides powerful data loading capabilities to fetch and prepare data before rendering your pages.

## Load Functions

A `load` function in `+page.js`, `+page.server.js`, or `+layout.js` runs before the component renders:

```javascript
// src/routes/posts/+page.server.js
export async function load() {
	const posts = await fetchPosts();
	return { posts };
}
```

The returned data is available in the component:

```svelte
<script>
	let { data } = $props();
</script>

{#each data.posts as post (post.id)}
	<article>
		<h2>{post.title}</h2>
		<p>{post.excerpt}</p>
	</article>
{/each}
```

## Server vs Client Loading

### Server Loading (`+page.server.js`)

Use server load functions to:

- Access databases
- Use environment variables
- Keep secrets safe

```javascript
export async function load() {
	const posts = await db.query('SELECT * FROM posts');
	return { posts };
}
```

### Client Loading (`+page.js`)

Use client load functions to:

- Access the client-side page store
- Use client-only data sources

```javascript
export async function load({ url }) {
	return {
		url: url.toString()
	};
}
```

## Route Parameters

Access route parameters in load functions:

```javascript
export async function load({ params }) {
	const post = await fetchPost(params.id);
	return { post };
}
```

## Error Handling

Throw errors in load functions to trigger error pages:

```javascript
export async function load({ params }) {
	const post = await fetchPost(params.id);

	if (!post) {
		error(404, 'Post not found');
	}

	return { post };
}
```

## Reloading Data

Force a reload of data with `invalidate()`:

```svelte
<script>
	import { invalidate } from '$app/navigation';

	async function refresh() {
		await invalidate('app:posts');
	}
</script>

<button onclick={refresh}>Refresh</button>
```
