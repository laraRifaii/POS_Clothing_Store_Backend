# POS System: Backend API

REST API for a clothing-store point-of-sale system. Built with **NestJS 11**, **Prisma 7** and a local **SQLite** database. It is used by the [desktop frontend](https://github.com/laraRifaii/POS_Clothing_Store_Frontend) (Electron + React).

## Features

- Role-based access control with three roles: `CASHIER`, `MANAGER`, `ADMIN`, plus a granular permissions layer
- Product catalog with SKU lookup, categories, low-stock listing and stock adjustment
- Sales with line items, discounts and payment types (`CASH`, `CARD`, `TRANSFER`), written inside database transactions
- Refunds: `FULL`, `PARTIAL` and `EXCHANGE`, also transactional, linked back to the original sale items
- Sales reports: date-range report, daily sales and profit by category (cost price is stored on each sale item)
- Store settings (name, address, phone, email, logo upload)
- Request validation with `class-validator` (unknown fields are rejected)

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | NestJS 11 (TypeScript) |
| ORM / DB | Prisma 7 with the better-sqlite3 adapter, SQLite |
| Validation | class-validator, class-transformer |
| Passwords | bcrypt |
| Uploads | Multer (served from `/uploads`) |

## Getting started

### Prerequisites

- Node.js 20.19+ (22 LTS recommended) and npm

### Setup

```bash
git clone https://github.com/laraRifaii/POS_Clothing_Store_Backend.git
cd POS_Clothing_Store_Backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

The API listens on `http://127.0.0.1:5000` (set `PORT` in `.env` to change it).

> `npx prisma db seed` creates default admin account(s) for first login. **Change those passwords immediately**, and never run the seed against a database that holds real data.

### Environment variables

| Variable | Description | Example |
| --- | --- | --- |
| `DATABASE_URL` | SQLite file location | `file:./prisma/dev.db` |
| `PORT` | HTTP port (optional) | `5000` |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run start:dev` | Start in watch mode |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run the compiled build |
| `npm run lint` | Lint and fix |
| `npm run test` / `npm run test:e2e` | Unit / end-to-end tests |
| `npx prisma migrate dev` | Create and apply a migration during development |
| `npx prisma studio` | Browse the database in a web UI |

## API overview

| Area | Endpoints |
| --- | --- |
| Auth and users | `POST /auth/signin`, `POST /auth/logout`, `POST /auth/signup`, `GET /auth/users`, `GET/PUT/DELETE /auth/users/:id`, `PUT /auth/users/:id/toggle-active` |
| Products | `GET/POST /products`, `GET /products/categories`, `GET /products/low-stock`, `GET /products/sku/:sku`, `GET/PATCH/DELETE /products/:id`, `PATCH /products/:id/stock` |
| Sales | `GET/POST /sales`, `GET /sales/:id`, `GET /sales/daily`, `GET /sales/reports`, `GET /sales/reports/category-profit` |
| Refunds | `GET/POST /refunds`, `GET /refunds/stats`, `GET /refunds/:id` |
| Store settings | `GET/POST/PATCH/DELETE /store-info`, `PATCH /store-info/logo` |

## Data model

`User` → `Sale` → `SaleItem` → `Product`, and `Sale` → `Refund` → `RefundItem` → `SaleItem`, plus a single-row `StoreInfo` table. The full schema is in `prisma/schema.prisma`.

## Project structure

```
src/
├── common/           # multer config, Prisma exception filter
├── domain/
│   ├── auth/         # sign-in, users, roles, permissions, guards
│   ├── products/
│   ├── sales/
│   ├── refund/
│   └── settings/     # store info and logo
└── prisma/           # Prisma module and service
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

## Author

Lara Rifaii
