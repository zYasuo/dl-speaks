# dl-speaks

Monorepo: **Next.js** (front), **NestJS** (backend), and **shared** (Zod schemas and types).

---

## Prerequisites

- **Node.js** 20+ and **npm**
- **Docker** and **Docker Compose** (recommended for Postgres and Redis used by the backend)

---

## 1. Installation

Always install from the **repository root** so the monorepo can link workspaces:

```bash
cd dl-speaks
npm install
```

Do not run `npm install` only inside `back/`, `front/`, or `shared/` — dependencies are hoisted to the root and packages are linked from there.

---

## 2. Environment variables

### Backend (`back/`)

Copy the example and adjust if needed:

```bash
cd back
cp .env.example .env
```

Edit `.env` (port, `DATABASE_URL`, `REDIS_HOST`, etc.). With Docker for Postgres/Redis, use the values from `.env.example` (e.g. `localhost` for local development).

### Front (`front/`)

If there is a `.env.example` in `front/`, copy it to `.env` and set variables (e.g. backend API URL).

---

## 3. Development

### Recommended order

1. **Start infra (Postgres + Redis)** — in the backend folder, with Docker:

   ```bash
   cd back
   npm run docker:up
   ```

2. **Build shared** (first time, or whenever you change something in `shared/`):

   ```bash
   # From repo root
   npm run build:shared
   ```

3. **Run backend migrations** (Prisma), if you haven’t yet:

   ```bash
   cd back
   npx prisma migrate dev
   ```

4. **Backend** (one terminal):

   ```bash
   cd back
   npm run start:dev
   ```

5. **Front** (another terminal):

   ```bash
   cd front
   npm run dev
   ```

Open the front (e.g. `http://localhost:3000`). The backend API runs on the port set in backend’s `.env` (e.g. `3001`).

### Quick reference

| Where    | Command              | What it does                          |
|----------|----------------------|----------------------------------------|
| Root     | `npm run build:shared` | Build the shared package               |
| Root     | `npm run build`      | Full build (shared → backend → front)  |
| `back/`  | `npm run docker:up`  | Start Postgres + Redis                 |
| `back/`  | `npm run start:dev`  | Backend in watch mode                  |
| `front/` | `npm run dev`        | Front in dev mode                      |

---

## 4. Best practices

- **Always run `npm install` at the root** — avoids duplicate lockfiles and broken workspace links.
- **Changed something in `shared/`?** Run `npm run build:shared` (at root) before running the backend or front again.
- **Production build:** at root, run `npm run build` (builds shared, then backend, then front in order).
- **Backend in production:** from `back/`, after building, use `npm run start:prod` (it uses `tsconfig-paths` to resolve `@shared`).

---

## 5. Monorepo structure

```
dl-speaks/
├── back/          # Backend — NestJS (API, Prisma, Redis)
├── front/         # Front — Next.js app
├── shared/        # Shared — Zod schemas and types (src/ → dist/)
├── package.json   # Workspaces and build scripts
└── tsconfig.base.json
```

**shared** is compiled to `shared/dist/`. Backend and front import it via the `@shared/*` alias (pointing at that `dist/`).

---

## 6. Root scripts

| Script              | Description                              |
|---------------------|------------------------------------------|
| `npm run build`     | Full build (shared, backend, front)      |
| `npm run build:shared` | Build shared only                     |
| `npm run build:back`   | Build backend only                    |
| `npm run build:front`  | Build front only                     |

For day-to-day development, use each app’s scripts (`start:dev` in backend, `dev` in front) as in **Development** above.

---

## 7. Per-app details

- **[back/README.md](back/README.md)** — Backend: API (Nest, Prisma, Redis, BullMQ), hexagonal architecture (ports & adapters), endpoints, Docker, scripts.
- **[front/README.md](front/README.md)** — Front: Next.js app, screens, `BACKEND_URL` env, scripts.
- **shared/** — Schemas and types only; see [shared/README.md](shared/README.md) if needed.
