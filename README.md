# Trading Journal — Phase 1 MVP

Next.js + TypeScript + Tailwind + Prisma/PostgreSQL trading journal with auth, accounts, trades, dashboard stats, and a light daily journal.

## Demo login

After seeding:

- **Email:** `demo@example.com`
- **Password:** `demo-password`

## Prerequisites

- Node.js 18+ (Node 24 OK)
- npm
- PostgreSQL 14+ (recommended via Docker)

## 1. Database setup

### Option A — Docker Compose (recommended)

```powershell
docker compose up -d
```

This starts Postgres on `localhost:5432` with:

- user / password / db: `trading` / `trading` / `trading_journal`

### Option B — Existing Postgres

Create a database and set `DATABASE_URL` accordingly (see `.env.example`).

### Option C — No Docker (Windows / scoop)

```powershell
scoop install postgresql
# Initialize and start Postgres per scoop docs, then create DB trading_journal
```

Then set `DATABASE_URL` in `.env`.

## 2. Environment

```powershell
copy .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://trading:trading@localhost:5432/trading_journal?schema=public"
NEXTAUTH_SECRET="replace-with-a-long-random-string"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secret (PowerShell):

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

Or: `openssl rand -base64 32`

## 3. Install, migrate, seed

```powershell
npm install
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
```

For local schema iteration you can use `npx prisma migrate dev` instead of `deploy`.

## 4. Run

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with the demo credentials.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` / `start` | Production build & serve |
| `npm test` | Smoke tests (auth helpers, trade validation, dashboard stats) |
| `npm run prisma:migrate` | Create/apply migrations (dev) |
| `npm run prisma:deploy` | Apply migrations |
| `npm run prisma:seed` | Seed demo user + sample data (bcrypt-hashed password) |
| `npm run db:up` / `db:down` | Docker Compose Postgres up/down |

## What's included (Phase 1)

- Register / login / logout (NextAuth credentials + JWT session)
- Protected journal routes via middleware
- User-scoped CRUD: trading accounts, trades
- Strategies & tags (list + create APIs; used on trade form)
- Dashboard aggregates: total trades, win rate, P&L + recent activity
- Light daily journal
- Calendar stub (“coming soon”)
- Prisma migration + bcrypt seed

## Out of scope

Calendar features, AI, screenshot uploads, production deploy.
