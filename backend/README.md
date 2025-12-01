# COMP3123 Assignment 1 REST API

Node.js + Express service that demonstrates authentication and employee management for the COMP3123 course assignment. It exposes REST endpoints for user registration, login, and protected CRUD operations on employees backed by MongoDB. The entire backend now lives under the `backend/` folder—run all commands from there.

## Tech Stack
- Node.js 20, Express 5, Mongoose 8
- JSON Web Tokens for authentication
- MongoDB for persistence
- Docker/Docker Compose for containerized deployment

## Prerequisites
- Node.js ≥ 18 and npm
- MongoDB instance (local or cloud) if running without Docker
- Docker & Docker Compose (optional, for containerized workflow)

## Setup
0. From the repo root, switch into the backend workspace:
   ```bash
   cd backend
   ```
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in `backend/` (see `.env` in the repo for an example) and provide:

   | Variable      | Description                                                                                   | Example                                                   |
   |---------------|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------|
   | `MONGODB_URI` | Connection string for MongoDB (include credentials if required).                              | `mongodb://admin:password@localhost:27017/comp3123`       |
   | `PORT`        | Port the API listens on.                                                                      | `8090`                                                    |
   | `JWT_SECRET`  | Secret used to sign JSON Web Tokens. Use a long random string.                                | _generated secret_                                        |
   | `CONTEXT_PATH`| Base path prefix for all routes.                                                              | `/gbc-service/comp3123`                                   |

   If `CONTEXT_PATH` is changed, update any client URLs to match the new base path.

## Running the Service

### Local development
```bash
npm run dev
```
Runs the server with `nodemon` and hot-reloads on file changes.

### Local production build
```bash
npm start
```
Starts the API using the compiled dependencies in your current environment.

### Docker
Build and run the production image locally:
```bash
cd backend
docker build --target prod -t comp3123-api:local .
docker run --rm -p 8090:8090 --env-file .env comp3123-api:local
```

### Docker Compose (API + MongoDB + Mongo Express)
```bash
cd backend
docker-compose up -d
```
Brings up the API, a MongoDB instance, and Mongo Express UI. Visit `http://localhost:8081` for the Mongo Express dashboard (credentials defined in `docker-compose.yml`).

When using Compose, the API is reachable at `http://localhost:8090/gbc-service/comp3123`.

## API Overview

- **Base URL:** `http://localhost:8090/gbc-service/comp3123`
- **Content-Type:** `application/json`
- **Authentication:** JWT bearer tokens. Signup and login are public; every `/emp` endpoint requires `Authorization: Bearer <token>`.

### Auth flow
1. Signup a user.
2. Login with the same credentials to receive a JWT.
3. Include the JWT in the `Authorization` header when accessing employee endpoints.

### Example requests

```bash
# Signup
curl -X POST http://localhost:8090/gbc-service/comp3123/user/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"matt","email":"matt@example.com","password":"secret123"}'

# Login
curl -i -X POST http://localhost:8090/gbc-service/comp3123/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"matt@example.com","password":"secret123"}'

# Fetch employees (requires token from login response)
curl http://localhost:8090/gbc-service/comp3123/emp/employees \
  -H "Authorization: Bearer <jwt token>"
```

### Endpoints

| Method | Path                                             | Description                            | Auth |
|--------|--------------------------------------------------|----------------------------------------|------|
| POST   | `/user/signup`                                   | Register a new user                    | No   |
| POST   | `/user/login`                                    | Login with username or email + password| No   |
| GET    | `/emp/employees`                                 | List all employees                     | Yes  |
| POST   | `/emp/employees`                                 | Create a new employee                  | Yes  |
| GET    | `/emp/employees/:eid`                            | Fetch a single employee by id          | Yes  |
| PUT    | `/emp/employees/:eid`                            | Update an employee                     | Yes  |
| DELETE | `/emp/employees?eid=<id>`                        | Delete an employee                     | Yes  |
| GET    | `/health`                                        | Health check (no auth)                 | No   |

### Employee payload
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.doe@example.com",
  "position": "Developer",
  "salary": 90000,
  "date_of_joining": "2023-04-01",
  "department": "Engineering"
}
```

## Project Structure
```
backend/
  src/
    config/        # Database connection
    controllers/   # Request handlers for auth and employees
    middleware/    # Auth + error handling middleware
    models/        # Mongoose models
    routes/        # Express routers
    utils/         # Utility helpers (e.g., password hashing)
```

## Troubleshooting
- Ensure MongoDB is reachable via the `MONGODB_URI`.
- A `401 Unauthorized` indicates a missing/invalid Bearer token.
- Validation errors are returned with `status:false` and an `errors` array from `express-validator`.

## Further Work
- Add automated tests.
- Add pagination/filtering on employee list.
- Serve API documentation (e.g., Swagger) for easier consumption.
