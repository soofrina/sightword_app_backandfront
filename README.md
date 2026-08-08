# Sight Word App

Monorepo combining the frontend and backend of the Sight Word App.

## Structure

| Path        | Description                                           |
| ----------- | ----------------------------------------------------- |
| `frontend/` | React + TypeScript client (CRACO, Tailwind, Storybook) |
| `backend/`  | NestJS + TypeScript API (Docker / docker-compose)      |

## Getting started

Each project is self-contained with its own `package.json`, dependencies, and
scripts. See the README inside each folder for detailed setup.

### Frontend

```bash
cd frontend
yarn install
yarn start
```

### Backend

```bash
cd backend
yarn install
yarn start:dev
```

## Origins

This repository was created by merging two previously separate repositories:

- `project-sight-words/sw-frontend` → `frontend/`
- `project-sight-words/sw-backend` → `backend/`
