---
name: CoFounder AI Next.js Migration
description: The project was migrated from a single index.html (5118 lines) to Next.js 14 App Router in May 2026
type: project
---

Migration from single `index.html` to Next.js 14 App Router structure completed successfully (build: ✓, dev server: HTTP 200).

**Why:** App was 431KB single-file, needed proper routing, shared auth, sidebar, Supabase connection across pages.

**How to apply:** The project now lives at `/Users/morten/Desktop/Co-Founder/CODE/`. Run with `npm run dev`. Old `index.html` backup still exists in root.

**Stack:** Next.js 14.2 + TypeScript + Tailwind + Supabase JS
**No JSX transform yet** — all components still use `React.createElement` syntax (migration was structural, not stylistic)

**Route structure:**
- `/` → LandingPage (redirects logged-in users to /dashboard)
- `/login` → AuthPage
- `/onboarding` → Onboarding
- `/(app)/dashboard` → DashboardPage/CockpitPage (auth-guarded)
- `/(app)/businessplan` → MarktanalysePage
- `/(app)/finanzierung` → FoerderPage
- `/(app)/rechtliches` → GewerbePage
- `/(app)/dokumente` → DokumentePage
- `/(app)/chat` → ChatPage
- `/(app)/account` → AccountPage
- `/(app)/geschaeftsidee` → GeschaeftsideePage

**Shared infrastructure (src/lib/):**
- `supabase.ts` — single Supabase client, exports `supabase` and `SUPABASE_URL`
- `auth.tsx` — `AuthProvider`, `useAuth` hook, context
- `aiFetch.ts` — rate-limit (429) handler
- `db.ts` — all Supabase DB operations
- `constants.ts` — BUNDESLAENDER, BRANCHEN, GEWERBE_CHECKLISTS
- `roadmap.ts` — generateIntelligentRoadmap()
- `useUserData.ts` — shared hook for onboarding profile data

**Icons:** Custom SVG components in `src/components/icons.tsx` (not lucide-react package)
**Logo:** Extracted from base64 → `public/logo.png`
**Supabase keys:** In `.env.local` (not committed)
**ESLint:** `ignoreDuringBuilds: true` set because @typescript-eslint plugin not installed
