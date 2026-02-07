<p align="center">
  <img src="https://img.icons8.com/emoji/96/hot-beverage.png" alt="BeanLine" width="80"/>
</p>

<h1 align="center">BeanLine — Frontend</h1>

<p align="center">
  <strong>Beautiful, Real-Time Coffee Shop Queue Dashboard</strong><br/>
  Built with React 18 &bull; Vite &bull; Framer Motion
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Framer%20Motion-11-FF0055?logo=framer&logoColor=white" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/Router-React%20Router%206-CA4245?logo=reactrouter&logoColor=white" alt="React Router"/>
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" alt="Docker"/>
</p>

---

## 📋 Overview

BeanLine Frontend is a **role-based dashboard** for a smart coffee shop queue system. Each view is tailored to a specific role — Cashier, Queue Monitor, Barista, and Manager — with smooth animations and real-time data updates.

---

## 🖥️ Pages & Features

### ☕ Cashier (`/cashier`)
- Place new orders with drink type, customer type, and loyalty tier
- Quick-fill with random customer names
- Bulk order simulation (generate N random orders at once)
- Instant feedback with estimated wait time and priority reason

### 📋 Queue (`/queue`)
- Live view of all orders sorted by priority score
- Emergency order indicators for near-timeout orders
- Auto-refreshing with real-time queue updates

### 👨‍🍳 Barista (`/barista`)
- View all 3 baristas and their current assignments
- One-click order completion per barista
- Live status indicators (BUSY / IDLE)

### 📊 Manager (`/manager`)
- Key metrics: avg wait time, max wait time, timeout rate
- Active alerts for orders exceeding thresholds
- Simulation runner with pre-built test scenarios
- Detailed simulation results with per-order breakdowns

---

## 🎨 UI Features

| Feature | Implementation |
|---|---|
| **Page Transitions** | Framer Motion `AnimatePresence` with fade/slide |
| **Card Animations** | Staggered entrance with spring physics |
| **Loading States** | Custom animated loader component |
| **Error Handling** | Dismissable error banners with auto-clear |
| **Responsive Layout** | CSS Modules with mobile-friendly design |
| **Navigation** | Sidebar with role-based icons |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **npm 9+**

### Run Locally

```bash
# Clone the repository
git clone https://github.com/kundan1729/Coffee-Queue-frontend.git
cd Coffee-Queue-frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app opens at **http://localhost:5173**.

> Make sure the [backend](https://github.com/kundan1729/Coffee-Queue-backend) is running on `http://localhost:8080` or set the `VITE_API_BASE_URL` env variable.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Backend API base URL |

Create a `.env` file or pass it inline:

```bash
VITE_API_BASE_URL=http://your-api-server:8080 npm run dev
```

---

## 🐳 Docker

### Build & Run

```bash
# Build (pass your backend URL)
docker build --build-arg VITE_API_BASE_URL=http://your-backend:8080 -t beanline-frontend .

# Run
docker run -p 3000:80 beanline-frontend
```

### Pull from Docker Hub

```bash
docker pull kd23/beanline-frontend
docker run -p 3000:80 kd23/beanline-frontend
```

The app will be served at **http://localhost:3000**.

> **Note**: `VITE_API_BASE_URL` is baked in at build time since Vite statically replaces `import.meta.env` during the build. To change the backend URL, rebuild the image with the new `--build-arg`.

### Docker Details

Multi-stage build:
1. **Build stage** — `node:20-alpine` runs `npm ci` + `vite build`
2. **Serve stage** — `nginx:alpine` serves the static assets with SPA routing

Final image size: **~25 MB**

---

## 📁 Project Structure

```
src/
├── App.jsx                         # Router setup with 4 role-based routes
├── main.jsx                        # React DOM entry point
├── index.css                       # Global styles
├── api/
│   ├── client.js                   # Axios instance with base URL & interceptors
│   └── orders.js                   # API methods (orders, barista, metrics, etc.)
├── components/
│   ├── AnimatedCard/               # Reusable animated wrapper component
│   ├── ErrorBanner/                # Dismissable error notification
│   ├── Layout/                     # Sidebar navigation + page outlet
│   ├── Loader/                     # Animated loading spinner
│   ├── OrderCard/                  # Order display card
│   └── StatCard/                   # Metric stat display card
└── pages/
    ├── Cashier/                    # Order creation + bulk simulation
    ├── Queue/                      # Live priority queue view
    ├── Barista/                    # Barista status + order completion
    └── Manager/                    # Metrics, alerts, and simulation
```

---

## 📡 API Integration

The frontend communicates with the backend through these endpoints:

| Action | Method | Endpoint |
|---|---|---|
| Create Order | `POST` | `/api/orders` |
| Get Queue | `GET` | `/api/orders/queue` |
| Barista Status | `GET` | `/api/barista/status` |
| All Baristas | `GET` | `/api/barista/all` |
| Complete Order | `POST` | `/api/baristas/{id}/complete` |
| Metrics | `GET` | `/api/manager/metrics` |
| Alerts | `GET` | `/api/manager/alerts` |
| Run Simulation | `POST` | `/api/manager/simulation` |

Full API contract: [API.md](./API.md)

---

## 🛠️ Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## 🔗 Related

- **Backend**: [Coffee-Queue-backend](https://github.com/kundan1729/Coffee-Queue-backend) — Spring Boot API & Priority Engine
- **Docker Hub**: [`kd23/beanline-frontend`](https://hub.docker.com/r/kd23/beanline-frontend)

---

## 📄 License

This project is for educational and demonstration purposes.
