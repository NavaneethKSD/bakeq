# BakeQ

Full-stack MERN web app for bakery **pre-order + rush-hour queue management**.

BakeQ helps busy snack/bakery outlets reduce evening crowding by letting customers pre-order online while staff pack orders ahead of time using a fast, tablet-friendly dashboard.

## Features

**Customer**
- Select outlet → browse menu → add to cart → place order (name + phone)
- Order number generation + total bill + status
- Track order status by order number

**Staff (rush-hour optimized)**
- Card-based order list (mobile/tablet friendly)
- Outlet filter + order-number search
- **Large buttons** for fast status updates
- Color-coded statuses:
  - Pending = yellow
  - Packing = orange
  - Packed = green
  - Completed = gray

## Tech Stack

- Frontend: React (Vite), React Router, TailwindCSS, Axios
- Backend: Node.js, Express, MongoDB Atlas, Mongoose, dotenv, cors

## Repo Structure

- `client/` — React app
- `server/` — Express API

## Setup

### 1) Backend

1. Copy env template:
	- `server/.env.example` → `server/.env`
2. Set `MONGODB_URI` to your MongoDB Atlas connection string.

Install + run:

```bash
cd server
npm install
npm run dev
```

Optional: seed demo outlets/products:

```bash
cd server
npm run seed
```

Server runs on `http://localhost:5000`.

### 2) Frontend

1. Copy env template:
	- `client/.env.example` → `client/.env`
2. Set `VITE_API_BASE_URL` (for local dev: `http://localhost:5000`).

Install + run:

```bash
cd client
npm install
npm run dev
```

Client runs on `http://localhost:5173`.

## API Endpoints

### Outlets
- `GET /api/outlets`

### Products
- `GET /api/products` (optional query: `outletId`)

### Orders
- `POST /api/orders`
- `GET /api/orders` (optional query: `outletId`, `status`, `orderNumber`)
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`

## Notes

- Real-time updates (Socket.IO), QR pickup, analytics, inventory, and PWA are intentionally left for future scope.
- This codebase is structured to be scalable and interview-ready (models/controllers/routes + centralized error handling).