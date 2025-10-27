# Project Structure

Understanding the SvelteKit project structure is essential for building scalable applications.

## Overview

A typical SvelteKit project has the following structure:

```
my-app/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   ├── stores/
│   │   └── utils/
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte
│   │   └── api/
│   ├── app.html
│   ├── app.css
│   └── app.d.ts
├── static/
├── tests/
├── package.json
├── svelte.config.js
├── vite.config.js
└── tsconfig.json
```

## Source Directory (`src/`)

The `src` directory contains all your application source code.

### Routes (`src/routes/`)

The routes directory uses file-based routing:

- `+page.svelte` - Creates a page
- `+layout.svelte` - Shared layout for pages
- `+error.svelte` - Error boundary
- `+loading.svelte` - Loading state
- `+page.js` - Page data loading
- `+layout.js` - Layout data loading

### Library (`src/lib/`)

Store reusable components, utilities, and stores:

- `components/` - Reusable Svelte components
- `stores/` - Svelte stores for state management
- `utils/` - Utility functions
- `types/` - TypeScript type definitions

### App Files

- `app.html` - HTML template
- `app.css` - Global styles
- `app.d.ts` - TypeScript declarations

## Static Directory

The `static` directory contains static assets:

- Images, fonts, and other media
- `robots.txt`, `favicon.ico`
- Any files that should be served as-is

## Configuration Files

### `svelte.config.js`

Main SvelteKit configuration:

```javascript
import adapter from '@sveltejs/adapter-auto';

export default {
	kit: {
		adapter: adapter()
	}
};
```

### `vite.config.js`

Vite bundler configuration:

```javascript
import { sveltekit } from '@sveltejs/kit/vite';

export default {
	plugins: [sveltekit()]
};
```

## Best Practices

1. **Organize by feature** - Group related files together
2. **Use the lib directory** - For reusable code
3. **Keep routes simple** - Move complex logic to lib
4. **Follow naming conventions** - Use `+` prefix for special files

## File Naming Conventions

- `+page.svelte` - Page component
- `+layout.svelte` - Layout component
- `+error.svelte` - Error boundary
- `+page.js` - Page load function
- `+layout.js` - Layout load function
- `+page.server.js` - Server-only page load
- `+layout.server.js` - Server-only layout load
