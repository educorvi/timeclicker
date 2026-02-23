# Timeclicker
[![CI](https://github.com/educorvi/timeclicker/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/educorvi/timeclicker/actions/workflows/ci.yml)
[![CodeQL](https://github.com/educorvi/timeclicker/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)](https://github.com/educorvi/timeclicker/actions/workflows/github-code-scanning/codeql)
[![Deploy to Server](https://github.com/educorvi/timeclicker/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/educorvi/timeclicker/actions/workflows/deploy.yml)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

Timeclicker is a tool to log how many hours are used on which project.

## Interface
Timeclicker has a WebUI with German and English language support for entering your hours.
![Screenshot of the UI](./readme_files/ui.png)
It also has a so called "orga" view for filtering and listing hours of all users.
This list can also be downloaded (or accessed via the API) for further processing, e. g. automatic invoice creation.

## Integration
### Tasks
The tasks that the users can work on are pulled from a configurable endpoint. The following format is expected:
```json
[
  {
    "id": "someId",
    "title": "Work on documentation",
    "note": false
  },
  {
    "id": "anotherID",
    "title": "Prepare talk",
    "note": false
  },
  {
    "id": "thisIdIsUnique",
    "title": "Meetings",
    "note": true
  }
]
```
- id: A unique ID
- title: The tasks title
- note: Is it mandatory for a user to specify a note? Useful for more broad tasks to let the user specify, what they did.

### Users
For user authentication and management this projects connects to Keycloak.


## Setup
In both directories `client` and `server` copy the file `.env.template` to `.env` and configure the settings to your wishes. `DB_PORT` and `DB_HOST` can be omitted for the docker variant.
### Docker
You can use the docker-compose file to start the Timeclicker and a database by running:
```bash
docker compose --env-file server/.env up
```
### Manual
```bash
yarn install
yarn run build
cd server
node dist/src/index.js
```

## Testing
Timeclicker includes comprehensive test suites for both frontend and backend code.

### Running Tests

#### Unit Tests
Run all unit tests (frontend and backend):
```bash
yarn test
```

Run backend tests only:
```bash
cd server
yarn test
```

Run frontend tests only:
```bash
cd client
yarn test
```

Run tests in watch mode:
```bash
cd server  # or cd client
yarn test:watch
```

Run tests with coverage:
```bash
cd server  # or cd client
yarn test:coverage
```

#### E2E Tests
Run end-to-end tests with Playwright:
```bash
yarn test:e2e
```

Run E2E tests in UI mode:
```bash
yarn test:e2e:ui
```

View test report:
```bash
yarn test:e2e:report
```

### Test Structure
- **Backend tests**: Located in `server/src/__tests__/`
  - Unit tests for controllers, models, and utilities
  - Uses Vitest for testing
- **Frontend tests**: Located in `client/src/__tests__/`
  - Unit tests for Vue components, stores, and utilities
  - Uses Vitest and Vue Test Utils
- **E2E tests**: Located in `e2e/`
  - End-to-end tests using Playwright
  - Tests navigation, API endpoints, and user workflows

## Other relevant information
### Create a link that opens the activity editor with a task already selected
The link should have the following path:

`/?action=createTask&taskID=yourID`

e.g.: https://clicker.educorvi.de/?action=createTask&taskID=yourID
