# endback

**Repo:** [github.com/zYasuo/endback](https://github.com/zYasuo/endback) · branch `dl-speaks`: [endback/tree/dl-speaks](https://github.com/zYasuo/endback/tree/dl-speaks)

Backend set up as a **hub**: one API that will host and serve multiple projects. Right now only **DL-speaks** is connected (the dictionary front for studying English). The plan is to plug in more apps over time.

## What's in here

- **Auth** — `POST /api/v1/auth/signin` and `POST /api/v1/auth/signup` (JWT, Argon2).
- **Dictionary** — `GET /api/v1/dictionary/:language/:word`: fetches the word from an external API (e.g. Free Dictionary API), persists to Postgres, caches in Redis, and adds it to "recent words".
- **Words** — `GET /api/v1/words/recent` (list of recently searched words) and `POST /api/v1/words/favorite` (add to favorites; requires JWT).

Stack: NestJS 11, Prisma (PostgreSQL), Redis (cache), JWT, class-validator/class-transformer, Axios for the dictionary API.

## Run in development

1. **Postgres and Redis** — via Docker:

   ```bash
   npm run docker:up
   ```

2. **Environment variables** — copy `.env.example` to `.env` and adjust. Minimal example:

   ```env
   PORT=3000
   NODE_ENV=development

   DATABASE_URL=postgresql://endback:endback_secret@localhost:5432/endback_db
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # External dictionary API (e.g. Free Dictionary API)
   DICTIONARY_API_URL=https://api.dictionaryapi.dev/api/v2/entries
   ```

   If you run Postgres and Redis with Docker Compose, use host `postgres` and `redis` in `DATABASE_URL` and Redis config when running the API inside the compose setup too.

3. **Prisma** — create DB and run migrations:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start the API**:

   ```bash
   npm install
   npm run start:dev
   ```

API runs at `http://localhost:3000` (or whatever `PORT` you set). Base path: **`/api/v1`**.

## Scripts

| Command | Description |
|--------|--------------|
| `npm run start:dev` | Dev server with watch |
| `npm run build` | Build |
| `npm run start` | Run production build |
| `npm run docker:up` | Start Postgres + Redis (docker compose) |
| `npm run docker:down` | Stop containers |
| `npm run docker:logs` | Compose logs |
| `npm run lint` | ESLint |

## Projects using this hub

- **[DL-speaks](https://github.com/zYasuo/dl-speaks)** — dictionary front for studying English at home (Next.js). Set `BACKEND_URL` to this API.

---

One backend, multiple projects. For now: DL-speaks; more to come later.
