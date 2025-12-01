# COMP3123 Full Stack App

This repository contains the COMP3123 backend (Node/Express + MongoDB) and frontend React grouped under `backend/` and `frontend/`.

## Folders
- `backend/` — Express API, MongoDB models, auth, employee CRUD, search, and photo upload. Run commands from here for the API.
- `frontend/` — React app with login/signup, employee management UI, search, photo upload, and Dockerized static build.
- `data/` — MongoDB persistent volume when running via Docker Compose.

## Running with Docker Compose (API + frontend + MongoDB + Mongo Express)
From repo root:
```bash
docker-compose build
docker-compose up -d
```
- Frontend: http://localhost:3002
- Backend: http://localhost:8090/gbc-service/comp3123 (or as configured in env)
- Mongo Express: http://localhost:8081

## Local development
Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## API base
Frontend reads `VITE_API_BASE` from `frontend/.env`. Defaults are set to talk to the backend at the current host (port 8092 locally) or `gbc-api.meddemir.com` in prod.

## Photo uploads
Employee profile photos are stored under `backend/uploads` and served at `${CONTEXT_PATH}/uploads`. Upload limit: 2MB. Frontend compresses images before upload.

## Notes
- Auth: JWT bearer tokens stored in `localStorage` (key `comp3123_token`).
- Search: department/position search via `/emp/employees/search`.
- Data persistence: Mongo volume at `data/mongo` when using Docker Compose.
