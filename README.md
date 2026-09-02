# Trading Journal

Minimal Next.js + TypeScript + Tailwind foundation (Phase 1).

Install

npm install

Run dev

npm run dev

Build

npm run build

Start

npm start

Environment

Copy .env.example to .env.local and edit as needed.

## Database

This project uses Prisma with PostgreSQL. Before running migrations or the seed script, ensure you have a PostgreSQL database and set the DATABASE_URL environment variable. You can start from the included .env.example and update the values:

cp .env.example .env
# edit .env and set DATABASE_URL

Install Prisma (if you haven't already) and generate the client, then run migrations and seed:

npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed

Required environment variables:
- DATABASE_URL (example shown in .env.example)

Notes:
- The seed script is typescript and uses ts-node. If you prefer JS, compile or adjust accordingly.
- Prisma Client instantiation is handled in src/lib/prisma.ts using a safe pattern for Next.js development to avoid excessive connections.
