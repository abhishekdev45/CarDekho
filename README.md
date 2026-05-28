# CarDekho — AI-Powered Car Recommendation App

A full-stack web application that helps users discover and compare cars through an interactive onboarding flow. Answer a few questions about your needs and get personalized car recommendations with side-by-side comparisons.

<!-- Replace with your actual deployed URL -->
**Live Demo:** [car-dekho-assignment.vercel.app](https://car-dekho-assignment.vercel.app) _(update after deployment)_

---

## Features

- **Smart Onboarding Flow** — Step-by-step questionnaire to capture budget, use-case, and priorities
- **Persona-Based Recommendations** — Scoring engine matches user profile to the best-fit cars
- **Recommendation Cards** — Each result includes match score, highlights, and plain-language explanation
- **Side-by-Side Comparison** — Compare up to 3 cars across specs, price, and features
- **Responsive UI** — Works on desktop and mobile

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| React Router DOM | 7 | Client-side routing |
| Tailwind CSS | 4 | Utility-first styling |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | 5 | REST API server |
| CORS | 2.8 | Cross-origin support |
| Nodemon | 3 | Dev auto-restart |

---

## Project Structure

```
CarDekho/
├── src/                        # React frontend
│   ├── pages/                  # Route-level page components
│   │   ├── LandingPage.jsx
│   │   ├── OnboardingPage.jsx
│   │   ├── RecommendationsPage.jsx
│   │   └── ComparePage.jsx
│   ├── components/
│   │   ├── layout/             # Header, navigation
│   │   ├── onboarding/         # Question cards, option buttons
│   │   ├── recommendations/    # RecommendationCard, ComparisonTable, PersonaBadge
│   │   └── ui/                 # Generic Button, Card
│   ├── context/                # OnboardingContext (global state)
│   ├── hooks/                  # useRecommendations and other custom hooks
│   ├── services/               # API call layer
│   └── utils/                  # Shared helpers
├── server/                     # Express backend
│   ├── controllers/            # Request handlers
│   ├── routes/                 # cars.js, recommendations.js
│   ├── utils/                  # scoringEngine.js
│   ├── data/                   # cars.json fixture data
│   └── index.js                # Server entry point
├── vite.config.js              # Vite config (proxy → :3001)
└── package.json                # Scripts & root deps
```

---

## Local Setup

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **npm** v9 or higher (comes with Node)

### 1. Clone the repository

```bash
git clone https://github.com/abhishekdev45/car-dekho-assignment.git
cd car-dekho-assignment
```

### 2. Install dependencies

```bash
# Root (frontend + concurrently)
npm install

# Backend
cd server && npm install && cd ..
```

### 3. Start the development servers

```bash
npm start
```

This runs both servers concurrently:

| Server | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| Backend (Express) | http://localhost:3001 |

> The Vite dev server proxies `/api/*` requests to the backend automatically — no extra config needed.

### 4. Build for production

```bash
npm run build       # Builds frontend to /dist
npm run preview     # Preview the production build locally
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server health check |
| GET | `/api/cars` | Fetch all cars |
| POST | `/api/recommendations` | Get personalized recommendations |

### POST `/api/recommendations`

**Request body:**
```json
{
  "budget": 1500000,
  "useCase": "family",
  "priorities": ["safety", "fuel_efficiency"],
  "transmission": "automatic"
}
```

**Response:**
```json
{
  "persona": "Family-First Buyer",
  "recommendations": [
    {
      "car": { "id": "...", "name": "...", "price": 0 },
      "score": 92,
      "explanation": "Best match because..."
    }
  ]
}
```

---

## Scripts

| Command | Description |
|---|---|
| `npm start` | Run frontend + backend concurrently |
| `npm run dev` | Frontend only (Vite) |
| `npm run server` | Backend only (Nodemon) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Deployment

### Frontend — Vercel / Netlify
1. Connect your GitHub repo
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=<your-backend-url>`

### Backend — Render / Railway
1. Set root directory: `server`
2. Set start command: `node index.js`
3. Set `PORT` environment variable if needed (defaults to `3001`)

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push and open a Pull Request

---

## License

MIT
