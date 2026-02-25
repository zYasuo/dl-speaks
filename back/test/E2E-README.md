# Testing (back)

## Commands

| Command | Description |
|--------|-------------|
| `npm run test:unit` | Run **unit tests** (`*.spec.ts` in `src/`). No app or infra (DB/Redis/Bull). |
| `npm test` | Alias for unit tests (same as `test:unit`). |
| `npm run test:e2e` | Run **E2E tests** (`*.e2e-spec.ts` in `test/`). Boots Nest app and uses real DB. |
| `npm run test:watch` | Unit tests in watch mode. |
| `npm run test:cov` | Unit tests with coverage report. |

**Unit:** one `*.spec.ts` file next to the code (e.g. `get-word.use-case.ts` + `get-word.use-case.spec.ts`). Mocks with `jest.fn()`; no server.

**E2E:** one `*.e2e-spec.ts` in `test/<domain>/`. Uses `supertest` against the real API; requires `DATABASE_URL` (and Redis when the module uses it).

---

# End-to-End (E2E) Tests — Design Guidelines

## Where tests live

```
back/
  test/
    jest-e2e.json          # Jest config for e2e
    setup-e2e.ts           # Global timeout and setup
    tsconfig.json          # TS config for test/ (Jest types)
    E2E-README.md          # This document
    helpers/               # Shared mocks and modules for e2e
      auth-e2e.module.ts
      dictionary-e2e.module.ts
      dictionary-api-mock.ts   # Mock for dictionary API, Tatoeba client
      sentence-queue.e2e-mock.ts  # Mock queue for sentence sync (no Bull/Redis)
      redis-e2e-mock.module.ts
    auth/
      auth.e2e-spec.ts     # Auth: signup, signin (/auth)
    user/
      user.e2e-spec.ts     # User resource: POST /users (profile when added)
    dictionary/
      dictionary.e2e-spec.ts  # GET /dictionary/:language/:word (mock API)
      words.e2e-spec.ts       # GET /words/recent, POST /words/favorite (auth)
    daily-goal/            # Example: future e2e for daily-goal
      ...
```

**Rule:** one `*.e2e-spec.ts` per flow or controller, under a folder named after the **domain** (user, daily-goal, dictionary, etc.).

## Design guidelines

### 1. Real app + real HTTP

- Use `Test.createTestingModule({ imports: [ApiV1Module] })` (or a smaller module) to bootstrap the same module tree as the API.
- Use **supertest** against `app.getHttpServer()` to send real HTTP requests (GET, POST, etc.).
- Do **not** mock controllers or use cases in e2e; the goal is to assert the full flow (HTTP in → controller → use case → repository → HTTP out).

### 2. Isolate by domain when possible

- **Auth/User e2e:** use `AuthE2eModule` (`test/helpers/auth-e2e.module.ts`), which only imports Config + Database + Auth. No Redis or BullMQ required.
- **Database:** use a real test database. Set `DATABASE_URL` to a test Postgres (e.g. CI or Docker).
- **Full API e2e:** use `ApiV1Module` and, to avoid Redis, use `overrideModule(RedisModule).useModule(RedisE2eMockModule)`.
- **Dictionary/words e2e:** override `DICTIONARY_CLIENT`, `TATOEBA_CLIENT`, `getQueueToken(SENTENCE_QUEUE_NAME)` (mock queue), `SentenceProcessor` and `SentenceScheduler` (no-op) so the suite does not call external APIs nor run Bull jobs. Use mocks from `helpers/dictionary-api-mock.ts` and `helpers/sentence-queue.e2e-mock.ts`.

This keeps behavior realistic while only bringing up the infra needed per suite.

### 3. Mirror production bootstrap

In e2e, apply the same setup as `main.ts`:

- `app.setGlobalPrefix("api/v1")`
- `app.useGlobalFilters(new GlobalHttpExceptionFilter())`

So routes and error shape match production.

### 4. File structure and naming

- **Outer describe:** domain/feature (e.g. `"User / Auth (e2e)"`).
- **Inner describe:** route or group (e.g. `"POST /api/v1/auth/signup"`).
- **it:** one expected behavior; use **should** (e.g. `"should return 409 when signing up with the same email twice"`).

Example:

```ts
describe("User / Auth (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AuthE2eModule],  // or ApiV1Module for full API e2e
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api/v1");
    app.useGlobalFilters(new GlobalHttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /api/v1/auth/signup", () => {
    it("should ...", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/v1/auth/signup")
        .send({ ... })
        .expect(201);
      expect(res.body).toMatchObject({ ... });
    });
  });
});
```

### 5. Test data and cleanup

- Prefer **unique data per test** (e.g. email with timestamp or random suffix) to avoid clashes across tests or re-runs.
- If you need a clean DB between tests, use Prisma against the test DB in `beforeEach`/`afterEach`, or run migrations and use a fresh DB per suite.

### 6. How to run

```bash
cd back
npm run test:e2e
```

(See **Commands** at the top of this README for `test:unit` and others.)

**Requirements:**

- **DATABASE_URL** pointing to a running Postgres (dev or test).
- For auth/user e2e, Redis is not needed (AuthE2eModule). For other modules that use Redis, either run Redis or use an equivalent mock.

## Summary

| What | Where / How |
|------|-------------|
| **Unit** | `npm run test:unit` — `src/**/*.spec.ts` |
| **E2E** | `npm run test:e2e` — `test/<domain>/*.e2e-spec.ts` |
| E2E Jest config | `back/test/jest-e2e.json` |
| App module | `AuthE2eModule` for auth-only; `ApiV1Module` for full API |
| External infra | Redis mock in `helpers/` when the flow does not need Redis |
| Database | Real, via `DATABASE_URL` (E2E only) |
| HTTP client | `supertest` on `app.getHttpServer()` |
| Bootstrap | Same global prefix and exception filter as `main.ts` |

Following this keeps new e2e (e.g. daily-goal, dictionary) consistent and easy to maintain.
