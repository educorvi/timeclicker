# Frontend Test Plan

## 1. Purpose

This plan defines the frontend quality strategy for the Timeclicker Vue application in `client/`. It covers user-visible behavior, integration with the Timeclicker API and Keycloak, responsive behavior, accessibility, localization, and PWA behavior.

The plan is intended for both implementation of automated tests and repeatable manual release testing. It does not cover server-side persistence or authorization logic except where those behaviors are observable through the browser.

## 2. Current State

The client currently provides build, type-check, lint, and preview scripts, but no unit, component, or browser test framework is configured. The existing CI workflow runs the workspace build on Node.js 20, 22, and 24.

Recommended additions:

- Vitest and Vue Test Utils for unit and component tests.
- Mock Service Worker (MSW) for deterministic API responses and failures.
- Playwright for browser-level workflows, responsive checks, downloads, and accessibility scans.
- `@axe-core/playwright` for automated accessibility checks.

Until those tools are added, the cases marked for automation also serve as the manual regression checklist.

## 3. Quality Goals

- A user can authenticate and create, view, edit, and delete their own time entries without losing data.
- Displayed durations and totals remain correct across breaks, month boundaries, time zones, and daylight-saving changes.
- Organization data is available only to organization users and never exposes private notes.
- All supported routes remain usable in English and German on mobile and desktop.
- API and authentication failures produce an understandable error state without leaving the interface falsely successful or indefinitely loading.
- Critical workflows are keyboard accessible and meet WCAG 2.2 AA expectations.

## 4. Scope

### In scope

- Application bootstrap and Keycloak authentication states.
- Navigation and route rendering.
- Activity list, month/year selection, totals, creation, editing, deletion, and task deep links.
- Statistics charts and tooltips.
- Organization filters, table, note expansion, total calculation, and JSON export.
- Settings, language selection, and persistence.
- About, changelog, licenses, server version, and API documentation views.
- Loading, empty, error, and stale-cache states.
- Responsive layouts, browser compatibility, accessibility, localization, and PWA assets.

### Out of scope

- Direct testing of database migrations and server repositories.
- Keycloak's own login UI, account recovery, and identity-provider internals.
- Correctness of generated Swagger content beyond successful rendering and authenticated requests.
- Load testing of server endpoints. Frontend performance budgets are still included.

## 5. Risks and Priorities

| Priority | Risk                                                                             | Required coverage                                 |
| -------- | -------------------------------------------------------------------------------- | ------------------------------------------------- |
| P0       | Activity data is lost, saved with incorrect times, or changed for the wrong user | Component and end-to-end CRUD tests               |
| P0       | Authentication or token refresh blocks access or leaks protected data            | Component and end-to-end auth-state tests         |
| P0       | Organization data or private notes are exposed to unauthorized users             | End-to-end role and response tests                |
| P1       | Totals differ between table, card, organization, and statistics views            | Unit, component, and end-to-end calculation tests |
| P1       | Local time is shifted by UTC conversion or daylight-saving changes               | Unit and browser tests with fixed time zones      |
| P1       | API failure leaves stale data, a spinner, or a false success state               | Component and end-to-end error tests              |
| P1       | Mobile controls or activity cards are unusable                                   | Responsive end-to-end tests                       |
| P2       | Translation, chart, download, changelog, license, or PWA behavior regresses      | Component and release regression tests            |

## 6. Test Environments

### Automated component environment

- Node.js 20 as the primary CI runtime; retain build validation on all currently supported CI versions.
- `jsdom` for components that do not require real browser layout.
- Fixed system time and explicit time zone per test.
- Mock Keycloak and all HTTP calls; no live identity provider or shared API.

### Automated browser environment

- Production client build served locally.
- Deterministic API fixture server or MSW.
- A Keycloak test realm, or a browser test authentication adapter that reproduces Keycloak callbacks, profiles, roles, logout URLs, and token refresh.
- Chromium on every pull request.
- Firefox and WebKit in nightly and pre-release regression runs.
- Viewports: 390 x 844 mobile, 768 x 1024 tablet boundary, and 1440 x 900 desktop.
- Time zones: `Europe/Berlin` by default and `UTC` for date-conversion comparison.

### Manual staging environment

- Production-like API, database, and dedicated Keycloak realm.
- HTTPS and service worker enabled.
- Test accounts that cannot access production data.

## 7. Test Data

Use stable IDs and reset data before every browser test.

| Fixture             | Data                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------ |
| Standard user       | `user-1`, English locale, no `orga` role                                             |
| Organization user   | `orga-1`, German locale, `orga` realm role                                           |
| Open task           | `task-open`, note optional                                                           |
| Mandatory-note task | `task-note`, note required                                                           |
| Closed task         | `task-closed`, available on an existing activity but absent from the new-entry list  |
| Normal activity     | 09:00-17:00, 30-minute break, expected net duration 7 h 30 min                       |
| Boundary activity   | Last day of one month crossing a DST transition where supported                      |
| Text fixture        | Long task name, German characters, HTML-like text, and emoji in notes                |
| Statistics          | Multiple tasks, an empty day, one-hour value, fractional hours, and an empty dataset |

Private notes must use a recognizable sentinel such as `PRIVATE-NOT-FOR-ORGA` so accidental disclosure is easy to detect.

## 8. Automated Test Layers

### Unit tests

Test pure calculations and state transitions without rendering:

- Duration formatting for zero, minutes, fractional hours, multi-day values, and missing endpoints.
- Month options, supported years, locale selection, and fallback to English.
- Breakpoint mapping immediately below, at, and above 576, 768, 992, 1200, and 1400 pixels.
- Activity payload construction using local date/time values.
- Date range construction for each month, leap years, UTC, and Europe/Berlin DST boundaries.
- Keycloak store transitions, profile load, authorization header update, interval cleanup, refresh success, and refresh failure.
- Organization filter serialization with zero, one, and multiple task/user IDs.
- Statistics parsing of decimal strings and tooltip HTML sanitization.

### Component tests

Mount components with Pinia, router, i18n, BootstrapVueNext, fixed time, and mocked HTTP:

- Activity editor validation, initialization, closed-task editing, emitted events, success, and failure.
- Overview loading, empty, table/card switch, totals, editing, delete confirmation, and request ranges.
- Navigation visibility for unauthenticated, standard, and organization users.
- Tag search, add, duplicate prevention, removal, and no-results state.
- Organization filters, note expansion, data refresh, and export payload.
- Statistics chart rendering, resize behavior, empty data, tooltip interaction, and cleanup.
- Settings persistence and reload message.
- About and API documentation loading and cleanup.
- Error toast content and repeated-error behavior.

### End-to-end tests

Use accessible roles and user-visible labels rather than CSS selectors. Intercept requests only where the test is explicitly about a client-side response; retain a smaller staging suite against the real API and Keycloak.

## 9. Functional Test Cases

### Authentication and shell

| ID      | Pri | Scenario and expected result                                                                                                                                                            | Automation      |
| ------- | --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| AUTH-01 | P0  | While auth configuration and SSO status are unresolved, a spinner is shown and protected route content is absent.                                                                       | Component, E2E  |
| AUTH-02 | P0  | An unauthenticated user sees the login prompt; activating SSO calls Keycloak login with `openid profile email`.                                                                         | Component       |
| AUTH-03 | P0  | An authenticated user sees route content and their profile name; API requests carry the current token.                                                                                  | Component, E2E  |
| AUTH-04 | P0  | A failed auth-config request uses valid cached `authData`; without a cache it shows an error and no broken login action.                                                                | Component, E2E  |
| AUTH-05 | P0  | Successful refresh replaces the request token; failed refresh clears the interval, shows one actionable error, and returns to login.                                                    | Unit, Component |
| AUTH-06 | P1  | Logout navigates to the URL returned by Keycloak.                                                                                                                                       | E2E             |
| AUTH-07 | P0  | The organization link appears only when the loaded profile has the `orga` realm role. Direct `/orga` access by a standard user is rejected by the API and exposes no organization data. | Component, E2E  |
| NAV-01  | P1  | Activities, Statistics, Settings, About, API docs, logo navigation, active state, and browser back/forward work.                                                                        | E2E             |
| NAV-02  | P1  | The collapsed mobile menu opens, exposes all permitted links, and supports keyboard navigation.                                                                                         | E2E             |

### Activities

| ID     | Pri | Scenario and expected result                                                                                                                                             | Automation     |
| ------ | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| ACT-01 | P0  | The current month loads with correctly bounded ISO `from`/`to` parameters, chronologically ordered entries, and the correct net total.                                   | Component, E2E |
| ACT-02 | P1  | Changing month or year issues one request for the selected range and replaces, rather than appends, the visible entries.                                                 | Component      |
| ACT-03 | P1  | No activities produces the localized empty state; a failed request removes the spinner and shows an error toast.                                                         | Component, E2E |
| ACT-04 | P0  | A valid entry can be created with task, date, start, end, break, public note, and private note; one POST is sent and the refreshed entry is visible.                     | Component, E2E |
| ACT-05 | P0  | Required task/date/time fields block submission, an end before the start shows the localized validation error, and a mandatory-note task requires a note.                | Component, E2E |
| ACT-06 | P1  | Task search supports keyboard selection, long names, and no-match behavior without losing entered form values.                                                           | Component, E2E |
| ACT-07 | P0  | Editing pre-populates every value, retains a referenced closed task, sends the existing ID, and refreshes the list after success.                                        | Component, E2E |
| ACT-08 | P1  | Canceling or closing an editor resets unsaved changes; a failed save keeps the modal and entered values available for retry.                                             | Component, E2E |
| ACT-09 | P0  | Delete requires confirmation; cancel preserves the entry; confirm sends the correct ID and refreshes only after success.                                                 | Component, E2E |
| ACT-10 | P1  | `/?action=createTask&taskID=task-open` opens the editor with the task selected and removes the query from history. Missing and unknown task IDs fail safely.             | Component, E2E |
| ACT-11 | P1  | At widths below 768 px activities render as cards; at and above 768 px they render as a table. Both show identical net durations, task data, and edit/delete capability. | Component, E2E |
| ACT-12 | P0  | Entries around midnight, month end, leap day, and DST changes retain the date and wall-clock times entered by the user after save and reload.                            | Unit, E2E      |
| ACT-13 | P1  | Concurrent create/edit/delete actions cannot be submitted twice and expose a clear pending state.                                                                        | E2E            |

### Statistics

| ID      | Pri | Scenario and expected result                                                                                                      | Automation     |
| ------- | --- | --------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| STAT-01 | P1  | Hours-per-task decimals are parsed, sorted consistently, labeled, and rendered without horizontal overflow.                       | Component, E2E |
| STAT-02 | P1  | The year heatmap places dates correctly and represents zero, fractional, and maximum hours with a usable legend.                  | Component      |
| STAT-03 | P1  | Pointer and keyboard interaction expose localized task/date and hour details; untrusted task text cannot inject markup or script. | Component, E2E |
| STAT-04 | P2  | Empty datasets render stable empty charts or an explicit empty state without invalid scales or console errors.                    | Component      |
| STAT-05 | P2  | Resize re-renders both charts without duplicate SVG nodes or listeners; unmount disconnects the observer.                         | Component      |
| STAT-06 | P1  | Failure of either statistics request produces a localized error and no misleading partial chart.                                  | Component, E2E |

### Organization view

| ID      | Pri | Scenario and expected result                                                                                                                                                    | Automation     |
| ------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| ORGA-01 | P0  | An organization user loads tasks, users, and current-month activities; a standard user cannot view any results.                                                                 | E2E            |
| ORGA-02 | P1  | Changing either date sends start-of-day/end-of-day bounds and refreshes results. Invalid or reversed ranges are rejected before a request.                                      | Component, E2E |
| ORGA-03 | P1  | Adding/removing multiple task and user filters sends repeated query values and returns only matching rows. Search is case-insensitive and selected values cannot be duplicated. | Component, E2E |
| ORGA-04 | P1  | Sorting by user, task, duration, start, and end is stable and reflects the displayed values.                                                                                    | E2E            |
| ORGA-05 | P1  | Public notes expand and collapse. Private notes never appear in the DOM, table, expanded content, network response fixture, or export.                                          | Component, E2E |
| ORGA-06 | P1  | The displayed total and row durations consistently subtract breaks according to the agreed business rule.                                                                       | Unit, E2E      |
| ORGA-07 | P1  | Download produces `timeclicker.json`, valid UTF-8 JSON, the currently filtered records, stable date serialization, and no private notes.                                        | E2E            |
| ORGA-08 | P1  | Failures loading tasks, users, or activities produce a localized error and retain a recoverable page state.                                                                     | Component      |

### Settings, About, and API docs

| ID       | Pri | Scenario and expected result                                                                                                                                         | Automation     |
| -------- | --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| SET-01   | P1  | German and English selection is stored, the reload notice appears only after a change, and a reload applies translated labels and date formats.                      | Component, E2E |
| SET-02   | P2  | An unsupported browser locale falls back to English and persists that fallback.                                                                                      | Unit           |
| ABOUT-01 | P2  | Client/server versions load; server failure does not break changelog, license, or navigation behavior.                                                               | Component      |
| ABOUT-02 | P2  | Changelog Markdown renders expected links and headings without allowing executable HTML.                                                                             | Component      |
| ABOUT-03 | P2  | Licenses render metadata and text; an unavailable license file shows the localized not-found state.                                                                  | Component      |
| DOC-01   | P2  | Swagger UI replaces the spinner, loads the configured specification, receives the current access token, and removes temporary authorization data on navigation away. | Component, E2E |

## 10. Non-Functional Coverage

### Accessibility

- Run axe on login, activity overview, activity editor, statistics, organization filters/table, settings, About modals, and API docs; allow no serious or critical violations.
- Complete activity CRUD and organization filtering using keyboard only.
- Verify visible focus, logical focus order, focus trapping/restoration in modals, Escape behavior where allowed, and that errors are announced.
- Verify every input has an associated label and icon-only edit/delete buttons have accessible names.
- Verify charts have a text alternative or accessible summary and do not depend on color alone.
- Check normal and large-text contrast in light and dark color-scheme preferences.
- Test at 200% zoom and 320 CSS-pixel width without loss of content or two-dimensional page scrolling, except intrinsically wide API documentation.

### Localization

- Run the P0 browser suite in English and German.
- Detect missing translation keys, raw key names, clipped navigation labels, and untranslated validation/errors.
- Verify plural forms for zero, one, and multiple minutes/hours.
- Verify locale-specific dates and times while API timestamps remain ISO formatted.

### Security and privacy

- Render task names, user names, public notes, profile data, changelog content, licenses, and chart tooltip values as untrusted input.
- Confirm no access token, private note, or auth configuration appears in logs, error toasts, downloaded organization data, or persisted storage beyond explicitly required Keycloak/Swagger state.
- Verify cached auth configuration cannot introduce executable content and is replaced after a successful API response.
- Verify direct navigation does not substitute UI role checks for server authorization.

### Performance and resilience

- On a representative desktop, target LCP below 2.5 seconds and CLS below 0.1 for the authenticated activity route under a warm local API.
- With 1,000 activities, month switching, table sorting, filter changes, and organization export should remain responsive and avoid duplicate requests.
- Simulate slow, offline, 401, 403, 404, 429, and 500 responses for each API family.
- Verify stale responses cannot overwrite results from a more recent month or filter selection.
- Verify repeated route entry does not leak resize observers, event listeners, or token-refresh intervals.

### PWA and browser behavior

- Validate manifest name, colors, icons, maskable icons, and installability in Chromium.
- Confirm navigation requests use the application fallback while `/api/*` failures are not replaced by cached HTML.
- Confirm a deployed update activates according to the `autoUpdate` policy without corrupting an in-progress entry; document the chosen user experience if reload is required.
- Verify offline behavior is explicit: previously cached static UI may load, but protected API data must not be represented as current unless an offline-data policy is introduced.

## 11. Manual Exploratory Charters

- Enter and edit time quickly across several tasks, including mistakes, cancellation, retries, double-clicks, and browser refreshes.
- Compare desktop table and mobile cards for the same month, paying particular attention to duration and break totals.
- Change browser time zone and cross the Europe/Berlin daylight-saving boundary while creating and viewing entries.
- Exercise long names, long notes, empty notes, German characters, emoji, and HTML-like text throughout the UI and export.
- Use screen reader and keyboard navigation for login, new entry, delete confirmation, filter selection, and profile navigation.
- Throttle and interrupt the network during authentication, save, delete, filter, chart, About, and API docs operations.

## 12. Execution and CI Policy

### Pull requests

- Existing type-check and production build.
- Unit and component suites.
- Chromium P0 smoke suite: auth shell, one activity CRUD journey, role protection, responsive activity rendering, and one API-error journey.
- Axe scans of the login and activity routes.
- No retries used to hide a consistent failure; retain trace, screenshot, video, console output, and failed network requests as artifacts.

### Nightly

- Full component and end-to-end suites in Chromium, Firefox, and WebKit.
- English and German locale runs.
- Mobile, tablet boundary, and desktop viewports.
- UTC and Europe/Berlin date suites.
- PWA, download, slow-network, accessibility, and 1,000-row performance scenarios.

### Release candidate

- Full automated regression against staging with real API and Keycloak.
- Manual exploratory charters and install/update checks.
- Verify no unresolved P0/P1 defect and review all quarantined tests.

## 13. Entry and Exit Criteria

### Entry criteria

- Acceptance criteria and API contract are available for the change.
- Test fixtures and isolated accounts exist.
- Client production build, API, and authentication adapter/realm are deployable.
- Date, time zone, role, and locale are controllable in the test environment.

### Exit criteria

- All P0 and P1 cases affected by the change pass.
- No open critical/high accessibility or security issue.
- No unexplained browser console error or failed request in a passing critical journey.
- At least 90% pass rate for P2 regression cases, with failures triaged and explicitly accepted before release.
- Changed business logic has unit or component coverage; changed user journeys have browser coverage.

## 14. Defect Reporting

Every defect should include test ID, build/commit, browser and viewport, locale, time zone, user role, fixture IDs, reproduction steps, expected and actual behavior, network response, console output, and screenshot/trace where relevant.

Severity:

- Critical: privacy/security exposure, cross-user mutation, authentication bypass, or unrecoverable data loss.
- High: critical workflow blocked, incorrect saved time/total, or organization access failure without a workaround.
- Medium: degraded secondary workflow, browser-specific failure, accessibility barrier, or misleading recoverable state.
- Low: cosmetic, wording, or minor layout issue with no workflow impact.

## 15. Decisions Required Before Automation

These expectations must be agreed before encoding them as assertions:

- Whether equal start/end times are valid and whether overnight entries are supported.
- Minimum/maximum break duration and whether a break may equal or exceed the gross activity duration.
- Whether all displayed durations, including organization rows and exports, are gross or net of breaks.
- Whether organization route access should be blocked client-side in addition to server authorization.
- Whether partial statistics data should render when only one endpoint fails.
- Whether cached auth configuration has an expiry or versioning rule.
- Expected offline and service-worker update behavior while an entry form contains unsaved data.
