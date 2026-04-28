# Claude-Boilerplate-Testing

A full-stack blog platform built with Node.js, Express, MongoDB, and React.

## Project Structure

```text
.
├── backend/              # Express + MongoDB API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   └── routes/
│   ├── tests/
│   ├── package.json
│   ├── server.js
│   └── .env.example
├── frontend/             # Vite + React client
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
└── CLAUDE.md             # Current project instructions
```

## Backend

The backend lives in [backend](backend) and exposes a REST API for blog posts.

### Features
- Create posts
- Read all posts
- Read a single post by ID
- Update posts
- Delete posts
- MongoDB-backed persistence
- Unit and integration tests

### Run the backend

```bash
cd backend
npm install
npm start
```

### Test the backend

```bash
cd backend
npm test
```

## Frontend

The frontend lives in [frontend](frontend) and provides a React interface for managing posts.

### Features
- Create posts from a form
- Edit existing posts
- Delete posts
- View post list and loading/error states
- Responsive layout

### Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies API requests from `/api` to the backend at `http://localhost:3000`.

## Environment Variables

Backend environment settings are defined in [backend/.env.example](backend/.env.example).

Common values:
- `PORT=3000`
- `MONGO_URI=mongodb://localhost:27017/blog`
- `NODE_ENV=development`

## Development Flow

1. Start MongoDB locally.
2. Start the backend from [backend](backend).
3. Start the frontend from [frontend](frontend).
4. Open the frontend in your browser and manage posts through the UI.

## Notes

- Do not commit real `.env` files or credentials.
- Backend tests use Jest and mongodb-memory-server.
- Frontend currently uses the backend API directly through `fetch`.
