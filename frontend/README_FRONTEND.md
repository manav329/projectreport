# TerraSpectra Frontend

React + Vite frontend for TerraSpectra, consisting of a rice-leaf diagnosis page and an experimental farm-risk dashboard, talking to a separate FastAPI backend.

## Prerequisites

- Node.js 18+ and npm.
- The backend must be running separately on `http://localhost:8000` before this frontend can do anything useful (predictions and the dashboard both call it) — see the [repo root README](../README.md) or GUIDE.md for backend setup instructions rather than duplicating them here.

## Setup

First time only:

```bash
cd frontend
npm install
```

## Running the dev server

```bash
npm run dev -- --port 5173
```

Then open http://localhost:5173 in a browser.

## Available npm scripts

- `npm run dev`: Starts the development server using Vite.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs the linter (oxlint) to check code quality.
- `npm run preview`: Locally previews the production build.

## Environment variables

- `VITE_MAPBOX_TOKEN` (optional) — if set, the dashboard uses Mapbox tiles; if unset, it falls back to free MapLibre demo tiles automatically. Copy `frontend/.env.example` to `frontend/.env` and fill it in if you have a token.

## Troubleshooting

- If `npm run dev -- --port 5173` fails with a PowerShell parsing error around `&&`, note that commands in this README are written for a bash-style shell (Git Bash, WSL, macOS/Linux terminal) — in native Windows PowerShell, chain commands with `;` instead of `&&`, or run each command on its own line.
- If the Diagnose or Dashboard pages show network errors, check that the backend is actually running and reachable at http://localhost:8000/health before assuming the frontend is broken.

## Project structure

Key folders under `src/`:
- `assets/`: Static assets like images and styling.
- `components/`: Reusable React components used across multiple pages.
- `pages/`: Top-level React page components (e.g., Diagnosis, Dashboard).
- `services/`: API client logic and utilities for communicating with the backend.
