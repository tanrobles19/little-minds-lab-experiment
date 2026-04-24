# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Little Minds Lab — a PWA-enabled, mobile-first educational app for toddlers/preschoolers built with Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, and shadcn/ui. Bilingual: English and Spanish.

## Commands

```bash
nvm use 22               # Required Node.js version (pinned in .nvmrc)
npm run dev              # Dev server at localhost:3000 (PWA disabled, hot reload)
npm run build            # Production build (generates service worker)
npm start                # Serve production build
npm run lint             # ESLint (flat config, core-web-vitals + typescript)
npx shadcn@latest add <name>  # Add new shadcn/ui component
```

Dev and build scripts use `--webpack` flag (required for PWA plugin compatibility).

## Architecture

### Routing & i18n

All pages live under `src/app/[lang]/`. The middleware (`src/middleware.ts`) detects the browser's `Accept-Language` header and redirects `/` to `/en` or `/es`.

- **Dictionary files**: `src/dictionaries/{en,es}.json` — ALL user-facing strings
- **Server Components**: `const dict = await getDictionary(lang as Locale);`
- **Client Components**: receive translated strings as props from parent Server Components (never import dictionaries directly)
- **New text**: add keys to BOTH `en.json` and `es.json`
- **New locale**: add to `locales` array in `src/lib/dictionaries.ts`, create matching JSON file
- **New page**: create `src/app/[lang]/<route>/page.tsx` (always under `[lang]`)

### Server vs Client Component Split

Page files (`page.tsx`) are Server Components that load dictionaries and pass strings as props to interactive Client Components. Each learning activity has this pattern:

```
page.tsx (Server) → loads dictionary → renders Grid/Game component (Client)
```

### Educational Game Components

Interactive learning components in `src/components/` follow a consistent pattern:

- **State machine**: items cycle through states (`idle` → `playing` → `correct`/`wrong`)
- **Audio playback**: `new Audio('/filename.m4a').play()` — audio files in `public/`
- **Shuffle & selection**: items are shuffled, one is randomly selected as the target
- **Completion trigger**: when all items are learned/cleared, fires `<Celebration>` (confetti + sound)
- **Touch-optimized**: large touch targets (44x44px min), `touch-manipulation` to eliminate 300ms delay

Components: `NumberGrid`, `AnimalGrid`, `ColorGrid`, `HumanBody` (SVG body diagram), `ToyBoxGame` (drag-drop with collision detection).

### Styling

- **Tailwind CSS v4**: CSS-based config (no `tailwind.config.ts`), uses `@theme` directive in `globals.css`
- **Colors**: oklch color space with CSS variables
- **Mobile-first**: default styles target mobile, enhance with `sm:` / `md:` / `lg:` / `xl:`
- **Safe areas**: `safe-top`, `safe-bottom`, `safe-x`, `safe-y` classes for notched devices
- **Touch targets**: use `tap-target` class (44x44px minimum)
- **3D button effect**: `border-b-[Xpx] border-r-[Ypx]` removed on active state
- **Frosted glass**: `bg-white/80 backdrop-blur-sm border border-slate-200`
- **Import alias**: `@/*` maps to `./src/*`

### PWA

Service worker is auto-generated on `npm run build` (disabled in dev). Generated files (`sw.js`, `workbox-*.js`) are gitignored. Test offline: build, start, then toggle offline in DevTools > Application.

## Critical: Next.js 16 Breaking Changes

Read `node_modules/next/dist/docs/` before using unfamiliar APIs.

1. **`params` and `searchParams` are Promises** — must `await` them:
   ```typescript
   const { lang } = await params;  // CORRECT
   // const { lang } = params;     // WRONG — type error
   ```

2. **`priority` on `next/image` is deprecated** — use `preload` instead

3. **Static params**: use `generateStaticParams()` returning `locales.map(lang => ({ lang }))`
