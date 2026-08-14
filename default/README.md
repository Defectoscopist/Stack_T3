# SHOP — Fashion E‑commerce Store (T3 Stack)

A full-featured fashion e‑commerce web application built with the
[T3 Stack](https://create.t3.gg/): **Next.js 15 (App Router) + TypeScript (strict) + tRPC v11 + Prisma 6 (MySQL) + NextAuth v5 + Zod + Tailwind CSS v4**.

> ✨ Demo pet‑project: the admin dashboard is readable by any logged‑in user, but only
> an `ADMIN` can modify products/orders/users.

---

## ✨ Features

- **Catalog** — home page, shop, category pages filtered by `sex`, product detail with **variants (color/size)**, price, stock, ratings and reviews.
- **Cart** — client‑side cart (localStorage) with quantity controls and order summary.
- **Checkout & Orders** — address form, order creation (server‑computed totals, stock decrement in a transaction), order tracking + cancel/return.
- **Reviews** — users can review products (one review per product), average rating, recent reviews carousel.
- **Wishlist** — save products for later.
- **Authentication** — NextAuth v5 with **GitHub / Google / VK / Yandex** (providers are enabled only when their credentials are present).
- **Admin dashboard** — dashboard stats, product/category/brand/variant CRUD, order status management, user role management.
- **Tests** — Vitest unit tests + Playwright E2E smoke tests.
- **CI** — GitHub Actions pipeline: `lint → typecheck → unit → e2e → build`.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router), React 19 |
| Language | TypeScript (strict mode) |
| API | [tRPC v11](https://trpc.io/) + [React Query](https://tanstack.com/query) + `superjson` |
| ORM / DB | [Prisma 6](https://www.prisma.io/) + MySQL 8 |
| Auth | [NextAuth.js v5](https://next-auth.js.org/) (OAuth) |
| Validation | [Zod](https://zod.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + `prettier-plugin-tailwindcss` |
| Forms | `react-hook-form` + `@hookform/resolvers` |
| Tests | [Vitest](https://vitest.dev/) (unit), [Playwright](https://playwright.dev/) (E2E) |
| CI | GitHub Actions |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js ≥ 20** and npm (the repo pins `npm@11.6.2` via `packageManager`).
- **MySQL 8** — either a local instance or Docker. A helper script `./start-database.sh`
  can start a MySQL container (read its header for Windows/WSL instructions).

### 1. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in at least:

```bash
# NextAuth — required
AUTH_SECRET="<generate with: npx auth secret>"

# Database — required (MySQL connection string)
DATABASE_URL="mysql://root:password@localhost:3306/fdvdsdfvd"

# OAuth providers — OPTIONAL (each pair is enabled only when both are set)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
VK_CLIENT_ID=""
VK_CLIENT_SECRET=""
YANDEX_CLIENT_ID=""
YANDEX_CLIENT_SECRET=""
```

> All OAuth variables are optional — the app builds and runs without them; only
> the providers you configure will appear on the sign‑in screen.

### 2. Install dependencies

```bash
npm install
```

This also runs `postinstall` → `prisma generate` (generates the Prisma client into `generated/`).

### 3. Set up the database

```bash
npm run db:push     # push the Prisma schema to MySQL
npm run db:seed     # seed demo categories/brands/products
```

> Prefer migrations for shared environments: `npm run db:migrate` applies
> the committed migrations in `prisma/migrations`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server (Turbo) |
| `npm run build` | Production build (runs lint + typecheck) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint check |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check` | `next lint && tsc --noEmit` |
| `npm test` | Run Vitest unit tests |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:coverage` | Vitest with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Playwright in UI mode |
| `npm run db:push` | Push Prisma schema to DB |
| `npm run db:migrate` | Apply committed migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |

---


## 🧪 Testing

### Unit tests (Vitest)
- Located next to the code: `src/**/*.test.ts` (schemas + services).
- They run **without a database** — services are tested with a mocked Prisma client.
```bash
npm test                # run once
npm run test:coverage   # with coverage
```

### E2E tests (Playwright)
- Located in `e2e/` (`e2e/smoke.spec.ts`). Playwright starts the dev server itself (`webServer`).
- First time, install the browser:
```bash
npx playwright install chromium
```
- Then run:
```bash
npm run test:e2e
```
> Current specs are DB‑agnostic smoke tests (header/footer/navigation). For
> DB‑backed scenarios, spin up a MySQL service and apply migrations first.

---

## 🔄 CI/CD

GitHub Actions workflow `.github/workflows/ci.yml` runs automatically on every push
to `main` and on every Pull Request:

1. **Lint** — `npm run lint`
2. **Typecheck** — `npm run typecheck`
3. **Unit tests** — `npm test` (Vitest)
4. **E2E tests** — Playwright (Chromium); on failure a `playwright-report` artifact is uploaded
5. **Build** — `npm run build` (runs after lint/typecheck/unit pass)

All jobs use a dummy `DATABASE_URL` so `prisma generate` succeeds during `npm ci`
without a real database.

---

## 📁 Project Structure

```
.
├── .github/workflows/ci.yml      # CI pipeline
├── e2e/                          # Playwright specs
├── prisma/
│   ├── schema.prisma             # DB schema (User, Product, Order, Cart, …)
│   ├── migrations/               # SQL migrations
│   └── seed.ts                   # Demo data seeder
├── generated/prisma/             # Generated Prisma client (do not edit)
└── src/
    ├── app/                      # Next.js App Router (pages + components)
    │   ├── _components/          # Shared UI components (Header, Footer, cards…)
    │   ├── admin/                # Admin dashboard
    │   ├── cart/ checkout/ order/ product/ shop/ wishlist/ profile/
    │   ├── category/ categories/
    │   ├── api/                  # NextAuth + tRPC HTTP handlers
    │   └── layout.tsx, page.tsx  # Root layout & home page
    ├── env.js                    # Env var validation (zod, @t3-oss/env-nextjs)
    ├── lib/                      # Static category definitions
    ├── server/
    │   ├── api/routers/          # tRPC routers (product, cart, order, admin…)
    │   ├── auth/                 # NextAuth config
    │   ├── schemas/              # Zod input/output schemas
    │   └── services/             # Business logic (Prisma + typed errors)
    ├── styles/globals.css
    └── trpc/                     # tRPC client/server setup
```

---

## 🗄️ Data Model (highlights)

- **User** — roles `USER` / `ADMIN`, relations: cart, orders, reviews, wishlist, addresses.
- **Product / Category / Brand** — catalog with variants.
- **ProductVariant** — color/size/price/stock + images; order items & cart items reference a variant.
- **Cart / CartProduct** — per‑user cart (server‑side procedures exist; the UI currently uses localStorage).
- **Order / OrderItem** — frozen price at purchase, status workflow
  `PENDING → DELIVERING → COMPLETED / CANCELLED / RETURNING → RETURNED`.
- **Review** — one review per user per product (unique constraint).
- **WishlistItem** — unique per (user, product).

---

## 🔐 Admin access

- `/admin` is readable by **any authenticated user** (demo decision).
- **Modifications** (create/edit/delete products, categories, brands, variants;
  change order status; change user roles) require the `ADMIN` role.
- To grant yourself admin: `npm run db:studio` → **User** → set your account `role = ADMIN`.

---

## ☁️ Deployment

### Vercel
1. Push this repo to GitHub, import it in [Vercel](https://vercel.com/).
2. Add the environment variables from `.env` in the project settings.
3. Point `DATABASE_URL` to a reachable MySQL instance (or a managed provider).
4. Vercel builds with `npm run build` — set `SKIP_ENV_VALIDATION=1` if needed
   (e.g. for Docker builds), and run `npm run db:migrate` on your DB first.

### Docker
```bash
docker build -t shop .
docker run -p 3000:3000 --env-file .env shop
```

> The app is image-optimized with `next/image` `unoptimized: true`, so it runs on
> platforms that don't provide a Next.js image optimizer.

---

## 📝 License

Private project — no license specified.

