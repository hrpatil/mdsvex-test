# Components

Svelte components are the building blocks of your application. Learn how to create and use them effectively.

## Basic Structure

A Svelte component is a `.svelte` file that contains markup, styles, and logic:

```svelte
<script>
	let count = 0;

	function increment() {
		count++;
	}
</script>

<button onclick={increment}>
	Clicks: {count}
</button>

<style>
	button {
		background-color: #333;
		color: white;
		padding: 8px 16px;
		border: none;
		border-radius: 4px;
	}
</style>
```

## Reactive Variables

In Svelte 5, use `$state` to declare reactive variables:

```svelte
<script>
	let count = $state(0);
</script>
```

When `count` changes, the UI updates automatically.

## Props

Accept data from parent components using `let`:

```svelte
<script>
	let { name, age } = $props();
</script>

<p>{name} is {age} years old</p>
```

## Slots

Create flexible components with slots:

```svelte
<!-- Button.svelte -->
<button>
	<slot />
</button>

<!-- Usage -->
<Button>Click me</Button>
```

Named slots allow multiple content areas:

```svelte
<!-- Card.svelte -->
<div class="card">
	<header><slot name="header" /></header>
	<main><slot /></main>
	<footer><slot name="footer" /></footer>
</div>

<!-- Usage -->
<Card>
	<div slot="header">Title</div>
	Content here
	<div slot="footer">Footer</div>
</Card>
```

## Events

Handle events with event directives:

```svelte
<script>
	function handleClick() {
		console.log('Clicked!');
	}
</script>

<button onclick={handleClick}>Click me</button>
```

Forward events from child components:

```svelte
<button onmousemove onclick onsubmit>
	<slot />
</button>
```

## Lifecycle

Svelte components have a lifecycle with effects and callbacks available through the `svelte` module.
