# Configuration

Learn how to configure SvelteKit for your specific needs and deployment requirements.

## SvelteKit Configuration

SvelteKit is configured through the `svelte.config.js` file in your project root.

### Basic Configuration

```javascript
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),

		// Paths
		paths: {
			base: '',
			assets: ''
		},

		// CSP configuration
		csp: {
			mode: 'auto',
			directives: {
				'script-src': ['self']
			}
		},

		// Environment variables
		env: {
			dir: process.cwd(),
			publicPrefix: 'PUBLIC_'
		}
	}
};

export default config;
```

## Adapters

Adapters determine how your app is deployed:

### Auto Adapter (Default)

```javascript
import adapter from '@sveltejs/adapter-auto';
```

Automatically detects your deployment platform.

### Static Adapter

For static sites:

```javascript
import adapter from '@sveltejs/adapter-static';

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		})
	}
};
```

### Node Adapter

For Node.js servers:

```javascript
import adapter from '@sveltejs/adapter-node';

export default {
	kit: {
		adapter: adapter({
			out: 'build',
			precompress: false,
			envPrefix: ''
		})
	}
};
```

### Vercel Adapter

For Vercel deployment:

```javascript
import adapter from '@sveltejs/adapter-vercel';

export default {
	kit: {
		adapter: adapter({
			runtime: 'nodejs18.x'
		})
	}
};
```

## Paths Configuration

Configure base paths and asset paths:

```javascript
export default {
	kit: {
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/my-app' : '',
			assets: 'https://cdn.example.com'
		}
	}
};
```

## Preprocessing

Configure preprocessors for your Svelte components:

```javascript
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';

export default {
	preprocess: [
		vitePreprocess(),
		sveltePreprocess({
			scss: {
				includePaths: ['src']
			},
			postcss: true,
			typescript: true
		})
	]
};
```

## Environment Variables

### Public Variables

Variables prefixed with `PUBLIC_` are available in the browser:

```bash
# .env
PUBLIC_API_URL=https://api.example.com
```

```javascript
import { PUBLIC_API_URL } from '$env/static/public';
```

### Private Variables

Server-only variables:

```bash
# .env
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
```

```javascript
import { DATABASE_URL } from '$env/static/private';
```

## CSP Configuration

Content Security Policy configuration:

```javascript
export default {
	kit: {
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'unsafe-inline'],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', 'https:'],
				'font-src': ['self'],
				'connect-src': ['self'],
				'media-src': ['self'],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['self'],
				'frame-ancestors': ['none'],
				'upgrade-insecure-requests': true
			}
		}
	}
};
```

## Vite Configuration

Configure Vite through `vite.config.js`:

```javascript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],

	server: {
		port: 3000,
		host: true
	},

	build: {
		target: 'es2020'
	},

	optimizeDeps: {
		include: ['lodash']
	}
});
```

## TypeScript Configuration

Configure TypeScript in `tsconfig.json`:

```json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"moduleResolution": "bundler"
	}
}
```
