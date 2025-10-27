# Installation

Learn how to install and set up SvelteKit for your development environment.

## Prerequisites

Before installing SvelteKit, make sure you have the following installed on your system:

- **Node.js** (version 18 or higher)
- **npm**, **yarn**, or **pnpm** package manager
- A code editor (VS Code recommended)

## Creating a New Project

The easiest way to start a new SvelteKit project is using the `create-svelte` command:

```bash
npm create svelte@latest my-app
cd my-app
npm install
npm run dev
```

### Interactive Setup

The create-svelte command will ask you several questions:

1. **Which Svelte app template?** - Choose from skeleton, demo, or library
2. **Add type checking with TypeScript?** - Recommended for larger projects
3. **Select additional options** - ESLint, Prettier, Playwright, Vitest

## Manual Installation

If you prefer to set up SvelteKit manually:

```bash
npm install @sveltejs/kit @sveltejs/adapter-auto vite
```

## Project Structure

After installation, your project will have this structure:

```
my-app/
├── src/
│   ├── lib/
│   ├── routes/
│   ├── app.html
│   └── app.css
├── static/
├── package.json
├── svelte.config.js
└── vite.config.js
```

## Development Server

Start the development server with:

```bash
npm run dev
```

Your app will be available at `http://localhost:5173`.

## Next Steps

Now that you have SvelteKit installed, you can:

- Explore the [project structure](/project-structure)
- Learn about [routing](/routing)
- Start building [components](/components)
