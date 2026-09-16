# Event Planning API (Backend)

REST API for the Event Planning Application — handles authentication, events, tags, and RSVPs.

---

## 1. Engineering Decisions

### Tech Stack

- **Runtime/Framework:** Node.js + Express + TypeScript
- **Database:** PostgreSQL
- **Query builder:** Knex.js (no ORM — no Prisma/TypeORM), by requirement
- **Auth:** JWT access + refresh tokens, passwords hashed with bcrypt
- **Caching/Ephemeral storage:** Redis (used for email verification codes)
- **API Documentation:** Swagger/OpenAPI

### Why Knex over an ORM

Knex was chosen over alternatives like Kysely for its mature migration tooling (`knex migrate:make`) and because it keeps generated SQL visible and composable rather than abstracting it away — important given query correctness (filtering, pagination, joins) is a core evaluation point here, not an implementation detail to hide.

### Why PostgreSQL

Chosen for two reasons: prior familiarity with Postgres meant faster, more confident implementation under time constraints, and it offers native UUID generation (`pgcrypto`'s `gen_random_uuid()`) and native enum types (used for `event_type` and `rsvp_status`), which MySQL doesn't support as cleanly.

### Authentication architecture

- **Access token:** short-lived JWT, returned in the response body and held in React state on the client (not persisted to `localStorage`, to reduce exposure to XSS-based token theft).
- **Refresh token:** longer-lived, stored in an **`httpOnly` cookie** — inaccessible to client-side JavaScript, which mitigates XSS exfiltration of the refresh token specifically. The access token is deliberately kept out of a cookie so it isn't automatically sent on every request (avoiding CSRF exposure on the access token itself); the refresh endpoint is the only one relying on the cookie, and is protected accordingly.
- This split (access token in memory, refresh token in an `httpOnly` cookie) is a standard mitigation against the two main token storage risks — XSS reading `localStorage`, and CSRF triggered by ambient cookies — accepting the trade-off that the access token is lost on a full page refresh and must be re-fetched via the refresh endpoint.
- **Email verification** is required after signup before an account can log in (or before certain actions are permitted, depending on how strict you made it) — a verification code/token is generated, stored in **Redis with a TTL** (rather than a database table), and emailed to the user. Using Redis here means expiry is handled natively by the key's TTL instead of a manual "check `expires_at` and clean up stale rows" pattern, and it keeps high-churn, short-lived data out of the relational schema entirely.
- **Two-Factor Authentication (2FA)** is implemented as an additional login step, gated behind the user's primary password check.

### Schema design

- **UUID primary keys** on all tables, generated at the database layer via `gen_random_uuid()`. Chosen over auto-increment integers to avoid leaking sequential information through public-facing resource IDs.
- **`event_tags`** is a pure many-to-many junction table between `events` and `tags`, using a composite primary key (`event_id`, `tag_id`).
- **`rsvps`** links `users` and `events` with a `status` column (`yes`/`no`/`maybe`), enforced as a native Postgres enum, with a **unique constraint on (`event_id`, `user_id`)** so a user has exactly one RSVP per event — changing a response is an upsert, not a new row.
- **`type`** and RSVP `status` are native Postgres enums rather than free-text strings, so invalid values are rejected at the database layer, not just in application code.

### Authorization

- Mutating endpoints (`PUT`/`DELETE` on an event) currently check whether the requesting user has the **`admin` role**, not whether they are the event's `creator_id`. This is a deviation from the brief as written — the spec calls for "only the event creator can edit or delete their events," which implies an ownership check, not a role check. As implemented, a non-admin creator cannot edit their own event, and (unless additionally restricted) an admin could edit/delete events they didn't create. Documented here explicitly rather than glossed over, since it's a meaningful gap from the stated requirement and worth being upfront about if asked.

### Validation

- Request bodies are validated at the route/controller layer before touching the database — required fields, string lengths, and enum values are checked server-side regardless of what the frontend already validated.
- Validation failures return structured, field-level error responses rather than raw stack traces or generic 500s.

### Filtering & Pagination

- Event listing supports server-side pagination (`LIMIT`/`OFFSET`) and filtering by tag and visibility, built dynamically from query parameters.
- **Sorting by "popularity" is defined as the count of `yes` RSVPs**, descending. The brief lists "popularity" as a sort option without defining it; counting `yes` responses was chosen.

### Error Handling

- A centralized Express error-handling middleware normalizes thrown errors into consistent JSON responses, so callers never see raw exceptions or inconsistent error shapes across endpoints.

---

## 2. Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)
- Redis (or Docker) — used for email verification codes
- npm
- An SMTP provider or transactional email service (for email verification), e.g. a Mailtrap sandbox for local dev

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

**Option A — Docker Compose (recommended):**

```bash
docker compose up -d
```

Starts Postgres on `localhost:5440` and Redis on `localhost:6379` with credentials matching `.env.example`.

**Option B — Local Postgres + Redis install:**

```bash
createdb event_planning_dev
# and ensure a local Redis instance is running on its default port
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/event_planning_dev
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
PORT=8000
NODE_ENV=development
LOG_LEVEL=fatal

# Redis
REDIS_URL=redis://localhost:6379

# Email (verification)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
EMAIL_FROM=noreply@example.com
```

### 4. Run migrations and seed data

```bash
npx run db:migrate
npx run db:seed:run
```

### 5. Start the server

```bash
npm run dev
# API running on http://localhost:8000
```

### API Documentation

Swagger UI is available once the server is running:

```
http://localhost:8000/docs
```

---

## 3. Assumptions

- **Email uniqueness plus verification is the identity check at signup** — a user is required to verify their email before [logging in / performing certain actions], via a token sent to their inbox.
- **Access tokens are not persisted across a hard page refresh** by design — losing the in-memory token on refresh and silently re-fetching a new one via the refresh-token cookie is treated as expected behavior, not a bug.
- **Events have a single date/time, not a recurring schedule.**
- **Delete is a hard delete** — removing an event cascades to delete its associated tags and RSVPs.
- **"Popularity" (for sorting) is defined as count of `yes` RSVPs**, not total RSVP volume — see reasoning above. This is an assumption, not a spec requirement, since the brief doesn't define the term.
- **RSVP is not capacity-limited** — no maximum attendee count or waitlist; any authenticated, verified user may RSVP Yes/No/Maybe.
- **Timestamps are stored as `TIMESTAMPTZ`**, but no per-user timezone preference is stored — display formatting is left to the client.
- **Private events have no invitation mechanism in this submission** — `type: private` currently only controls whether an event is excluded from public listing/search results. There is no way for the creator to invite specific users, and no access check beyond role. This was a deliberate simplification, not an oversight — implementing partial/ad-hoc access (e.g. a shareable link with no real invitation state) seemed worse than clearly scoping it out and documenting the intended design.
- **Mutation authorization is role-based (admin), not ownership-based** — see the Authorization section above. This is called out again here because it's the assumption most likely to be challenged: the brief specifies creator-only edit/delete, and the current implementation checks role instead. If pressed, the honest answer is that this was either a simplification under time pressure or a deliberate design choice to centralize event management under an admin role — be prepared to state which one actually happened and why.

### Not implemented (documented as future work)

- **Unit testing** — not included in this submission. This is an honest gap rather than a scoping choice: I have limited prior hands-on experience writing unit tests, and given the time available I prioritized finishing the required and several optional features (refresh tokens, email verification, 2FA, Swagger docs) over building out test coverage. With more time, I'd start with the auth flows and the RSVP/tag filtering queries, since they carry the most business logic risk.
- **Rate limiting** — login, email verification, and 2FA endpoints currently have no request throttling. These are the highest-value targets for rate limiting since they're the most likely to be brute-forced or abused (e.g. repeated verification email requests, repeated 2FA code attempts). I'd add this via a middleware like `express-rate-limit`, keyed by IP and/or account, with stricter limits on the 2FA code-verification endpoint specifically.
- **Caching** — Redis is already used for email verification codes, but not yet for response caching. The clearest candidate is the public event listing endpoint (read-heavy, tolerant of brief staleness) — since Redis is already a dependency, this would be a natural extension rather than new infrastructure. I'd cache with a short TTL, invalidating on event create/update/delete.
- **Private event invitations** — the intended design is that the event creator (not a separate "admin" role — ownership implies invite rights) invites specific users by email. This would create pending invitation records (`event_id`, `invited_email`, `status`, a unique `token`, `expires_at`), send the invite asynchronously via a job queue rather than synchronously in the request cycle, and extend the private-event access check to "creator OR accepted invitee" instead of just `creator_id`. Not implemented in this submission due to time constraints.
- **In-app SSE notifications and the three-state event lifecycle** (`upcoming` → `happening` → `completed`) — also designed conceptually but not implemented; see architecture notes in project discussion for the reasoning behind each (SSE over WebSockets for one-directional push, delayed jobs over polling cron for the lifecycle transitions).
