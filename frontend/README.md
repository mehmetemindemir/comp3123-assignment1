# COMP3123 Frontend

React app scaffolded with Vite. Run commands from this folder.

## Setup
```bash
cd frontend
npm install
npm run dev
```

## Scripts
- `npm run dev` — start Vite dev server (defaults to http://localhost:3000)
- `npm run build` — production build
- `npm run preview` — preview the built app locally

## Notes
- Update API URLs to match your backend (default: http://localhost:8090/gbc-service/comp3123). Override with `VITE_API_BASE` in a `.env` file.
- Login/Signup pages post to the backend via `src/api.js` and store the JWT in `localStorage` (key `comp3123_token`).
- Employee management page (`/employees`) performs CRUD and filtering; it requires the stored JWT.
- UI uses Tailwind CSS plus lightweight shadcn-style components under `src/components/ui`.
