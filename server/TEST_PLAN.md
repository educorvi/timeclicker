# Backend Test Plan

## Scope and approach

The plan covers the HTTP API, Keycloak authentication and authorization, PostgreSQL persistence, task synchronization, statistics, migrations, and operational behavior. Use three test layers:

- **Unit tests:** controllers, authentication, error handling, and synchronization with mocked dependencies.
- **Integration tests:** repositories and queries against a disposable PostgreSQL database with migrations applied.
- **API tests:** the built Express application over HTTP, with Keycloak verification stubbed except for a small optional end-to-end suite against a test realm.

Priorities are **P0** (security or data integrity), **P1** (core behavior), and **P2** (secondary or operational behavior). Each test must use isolated fixtures and leave the database clean.

## Common fixtures

- Users `user-a` and `user-b`, plus `orga-user` with the `orga` realm role.
- One open task, one closed task, and one task for which `note_mandatory` is true.
- Completed, running (`to = null`), and cross-midnight activities owned by both users.
- Activities exactly on filter boundaries and activities older/newer than one year.
- Valid, expired, malformed, and missing bearer tokens.

## Test cases

### Startup and public endpoints

- [ ] **BE-001 (P1, API):** Start with valid database and Keycloak configuration; migrations run and the server listens on the configured port.
- [ ] **BE-002 (P1, unit):** Start without database credentials; startup fails with a clear configuration error and no server is opened.
- [ ] **BE-003 (P1, unit):** Start without required Keycloak variables; startup exits before accepting requests.
- [ ] **BE-004 (P2, API):** `GET /api/` returns HTTP 200, the server message, and the package version.
- [ ] **BE-005 (P1, API):** `GET /api/auth` returns only the configured Keycloak URL, realm, and client identifier; secrets are never exposed.
- [ ] **BE-006 (P2, API):** `GET /api/swagger.json` returns valid OpenAPI JSON containing every registered route and security definition.
- [ ] **BE-007 (P2, API):** An unknown non-API route serves the client fallback, while an unknown `/api` route does not disclose a stack trace.

### Authentication and error handling

- [ ] **BE-010 (P0, API):** Every secured route rejects a missing authorization header with HTTP 401 and the standard error body.
- [ ] **BE-011 (P0, unit/API):** Valid `Bearer` tokens are verified and attach the token plus organization-role status to the request.
- [ ] **BE-012 (P0, unit/API):** Invalid, malformed, incorrectly signed, and wrong-realm tokens return HTTP 401 without reaching a controller.
- [ ] **BE-013 (P0, unit/API):** Expired tokens return HTTP 401 and cannot proceed after token rejection.
- [ ] **BE-014 (P1, API):** TSOA type/parameter failures return HTTP 422 with `message` and field details.
- [ ] **BE-015 (P1, unit/API):** Unexpected exceptions return HTTP 500 without internal exception details; unknown non-error values pass to the next handler.
- [ ] **BE-016 (P2, API):** Authorization header casing and the supported bearer-token format behave consistently; unsupported schemes are rejected.

### User provisioning

- [ ] **BE-020 (P1, integration):** A first authenticated request creates one user from the token subject, name, and email.
- [ ] **BE-021 (P1, integration):** Later requests for the same subject reuse the existing user and do not create duplicates.
- [ ] **BE-022 (P1, integration):** Concurrent first requests for the same subject do not fail or create inconsistent user data.
- [ ] **BE-023 (P2, characterization):** Define and test whether changed token name/email claims update the stored user or preserve the original values.

### Tasks API and synchronization

- [ ] **BE-030 (P1, API):** `GET /api/tasks?open=all` and the omitted-query default return every task ordered by title.
- [ ] **BE-031 (P1, API):** `open=true` returns only open tasks and `open=false` returns only closed tasks, both ordered by title.
- [ ] **BE-032 (P1, API):** An unsupported `open` value returns HTTP 422.
- [ ] **BE-033 (P1, API):** `GET /api/tasks/{taskId}` returns the requested task; an unknown ID returns HTTP 404 and no data.
- [ ] **BE-034 (P1, unit/integration):** A synchronization inserts new remote tasks and updates title, mandatory-note flag, and open status for existing tasks.
- [ ] **BE-035 (P1, integration):** A task absent from the latest remote response is marked closed without deleting its activities.
- [ ] **BE-036 (P1, unit):** A missing task endpoint skips synchronization, and a network error or invalid response is logged without stopping the server.
- [ ] **BE-037 (P2, unit):** Synchronization runs once at startup and is scheduled hourly without overlapping uncontrolled executions.
- [ ] **BE-038 (P1, contract):** Reject or safely handle malformed task payloads, duplicate IDs, missing fields, and unexpected response shapes.

### Activities API

- [ ] **BE-040 (P0, API):** `GET /api/activities` returns only the authenticated user's activities, including related task/user data, ordered by start time ascending.
- [ ] **BE-041 (P1, API):** `from` and `to` filters are inclusive and work separately and together, including exact-boundary timestamps and timezone offsets.
- [ ] **BE-042 (P1, API):** Invalid date query values return HTTP 422; a range where `from > to` follows the agreed validation behavior.
- [ ] **BE-043 (P1, API):** Creating an activity with a valid task persists timestamps, notes, private note, break minutes, user, and task, then returns HTTP 201.
- [ ] **BE-044 (P1, API):** Updating an owned activity changes that row without creating a second activity and returns HTTP 201.
- [ ] **BE-045 (P0, API):** A user cannot update another user's activity, including attempts to submit another activity ID with altered ownership fields.
- [ ] **BE-046 (P1, API):** Creating or updating with an unknown task returns HTTP 400 and leaves the database unchanged.
- [ ] **BE-047 (P0, validation):** Define and enforce valid activity invariants: `from <= to`, nonnegative break duration, break not longer than elapsed time, and sensible maximum values.
- [ ] **BE-048 (P1, validation):** Define whether a closed task may receive new activity and enforce the decision.
- [ ] **BE-049 (P1, validation):** A task marked `note_mandatory` rejects an empty/whitespace note if this is a backend rule.
- [ ] **BE-050 (P1, API):** Nullable start/end timestamps behave as intended for running or incomplete entries.
- [ ] **BE-051 (P1, API):** Additional body properties cannot set `user`, `task`, or other server-owned relationship fields.
- [ ] **BE-052 (P1, API):** Deleting an owned activity succeeds and removes only that row.
- [ ] **BE-053 (P1, API):** Deleting an unknown activity returns HTTP 404.
- [ ] **BE-054 (P0, API):** Deleting another user's activity returns HTTP 401/403 according to the API contract and leaves it intact.
- [ ] **BE-055 (P1, API):** Repeating a delete is safe: the first request succeeds and the next returns HTTP 404.
- [ ] **BE-056 (P1, concurrency):** Concurrent updates/deletes of one activity have a documented deterministic outcome and never corrupt related rows.

### Organization endpoints

- [ ] **BE-060 (P0, API):** A normal authenticated user cannot access either organization endpoint; an organization-role user can.
- [ ] **BE-061 (P1, API):** `GET /api/orga/users` returns all and only persisted users without leaking token or credential data.
- [ ] **BE-062 (P1, API):** `GET /api/orga/activities` returns activities across users with task/user relations.
- [ ] **BE-063 (P0, API):** Every organization activity has `private_note` redacted, including when filters are used.
- [ ] **BE-064 (P1, API):** User, task, from, and to filters work independently and in combination; repeated query parameters map to arrays correctly.
- [ ] **BE-065 (P1, API):** Organization date filters are inclusive and handle timezone offsets and exact boundaries.
- [ ] **BE-066 (P1, API):** Unknown user/task filters return an empty list and cannot alter the generated query unexpectedly.

### Statistics

- [ ] **BE-070 (P0, integration/API):** Both statistics endpoints include only the authenticated user's activities.
- [ ] **BE-071 (P1, integration):** Hours per task groups by task and computes `(end - start) - breakMins` correctly for integer and fractional hours.
- [ ] **BE-072 (P1, integration):** Hours per task ignores incomplete activities and returns stable task IDs, titles, and numeric values for empty and populated datasets.
- [ ] **BE-073 (P1, integration):** The heatmap groups completed activities by calendar date, sums net hours, counts activities, and sorts dates ascending.
- [ ] **BE-074 (P1, integration):** The heatmap includes the exact one-year boundary and excludes older activities; freeze the application clock to make this deterministic.
- [ ] **BE-075 (P1, timezone):** Heatmap date grouping matches the documented business timezone around UTC midnight and daylight-saving transitions.
- [ ] **BE-076 (P1, validation):** Invalid data such as break time exceeding duration cannot produce negative statistics once activity invariants are enforced.

### Database and migrations

- [ ] **BE-080 (P0, migration):** Apply every migration in order to a blank PostgreSQL database; the resulting schema matches the current entities.
- [ ] **BE-081 (P0, migration):** Upgrade a representative database from each supported release while preserving users, tasks, activities, contract data, and working hours.
- [ ] **BE-082 (P1, migration):** Migration failure rolls back the whole migration transaction and startup does not accept traffic on a partial schema.
- [ ] **BE-083 (P1, integration):** Primary keys, required fields, UUID defaults, numeric conversions, and foreign keys enforce the expected constraints.
- [ ] **BE-084 (P1, integration):** Deleting a user or task cascades to its activities as declared, and no orphaned activity remains.
- [ ] **BE-085 (P2, migration):** Test supported down migrations separately, documenting any intentionally lossy conversions.

### Operational, security, and performance checks

- [ ] **BE-090 (P1, API):** The 1001st request from one trusted client IP within 15 minutes is rate-limited; standard headers are present and legacy headers are absent.
- [ ] **BE-091 (P1, security):** Proxy-header handling cannot let an internet client spoof IP addresses and bypass rate limits in the production proxy topology.
- [ ] **BE-092 (P1, security):** CORS behavior matches an explicit production origin policy, including preflight and credential handling.
- [ ] **BE-093 (P1, security):** Fuzz path, query, and JSON inputs for SQL injection, oversized bodies, malformed JSON, UUID edge cases, and reflected data.
- [ ] **BE-094 (P2, performance):** Measure activities and organization list latency at expected data volume; define pagination before unbounded responses exceed the target.
- [ ] **BE-095 (P2, performance):** Verify statistics query latency with realistic row counts and confirm useful indexes through query plans.
- [ ] **BE-096 (P2, resilience):** Database unavailability during startup and request handling produces controlled failures and useful logs without exposing credentials.
- [ ] **BE-097 (P2, observability):** Successful startup/synchronization and failed authentication, synchronization, migration, and database operations produce actionable logs without tokens or private notes.

## Recommended execution order

1. Run formatting, TSOA generation, and TypeScript compilation.
2. Run unit tests without external services.
3. Start a disposable PostgreSQL container, apply migrations, and run repository/query integration tests.
4. Run API tests against the built application with isolated database fixtures and stubbed token verification.
5. Run optional Keycloak contract tests, migration-upgrade tests, security scans, and performance tests in scheduled CI.

## Exit criteria

- All P0 and P1 tests pass; no known cross-user data access, private-data leak, or migration/data-integrity defect remains.
- Every fixed defect gains a regression test.
- Generated routes and OpenAPI output are current, and the server builds from a clean checkout.
- Flaky tests are quarantined only with an owner and tracking issue; the main suite is deterministic and parallel-safe.
- P2 failures have an explicit risk acceptance or follow-up issue before release.
