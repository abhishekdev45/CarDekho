# Car Advisor — Project Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the CarDekho car recommendation advisor web app with a fully configured frontend (React + Vite + Tailwind + React Router) and backend (Express), leaving all business logic for later phases.

**Architecture:** Frontend (React SPA) runs on Vite dev server (port 5173); backend Express API runs on port 3001; Vite proxies `/api` requests to Express so both run from one terminal with no CORS issues. Static JSON files in `server/data/` serve as the data layer for now.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, React Router 6, Express 4, Node.js, Concurrently, Nodemon

---

## File Map

**Frontend (create):**
- `vite.config.js` — Vite config with `/api` proxy
- `tailwind.config.js` — Tailwind content paths + custom theme tokens
- `postcss.config.js` — PostCSS with Tailwind + Autoprefixer plugins
- `src/main.jsx` — React entry point with BrowserRouter
- `src/App.jsx` — Root component with all Routes
- `src/index.css` — Tailwind directives + base layer styles
- `src/layouts/MainLayout.jsx` — Shared header/footer wrapper using Outlet
- `src/components/layout/Header.jsx` — Sticky site header with logo + nav
- `src/components/ui/Button.jsx` — Reusable button (variant + size props)
- `src/components/ui/Card.jsx` — Reusable card wrapper (hover optional)
- `src/pages/LandingPage.jsx` — Full homepage: hero + features + CTA
- `src/pages/OnboardingPage.jsx` — Placeholder for multi-step form
- `src/pages/RecommendationsPage.jsx` — Placeholder for results screen
- `src/pages/ComparePage.jsx` — Placeholder for compare screen
- `src/services/carsApi.js` — Fetch helpers for `/api/cars`

**Backend (create):**
- `server/index.js` — Express entry point, middleware, route mounting, health check
- `server/routes/cars.js` — GET `/` and GET `/:id` routes
- `server/controllers/carsController.js` — Reads cars.json, returns responses
- `server/data/cars.json` — 5 sample cars (static data layer)
- `server/utils/response.js` — `sendSuccess` / `sendError` helpers

**Modify:**
- `package.json` — Add all deps + `dev`, `server`, `start` scripts

---

## Task 1: Initialize Vite + React Project

**Files:**
- Create: `package.json`, `src/main.jsx`, `src/App.jsx`, `index.html`, `vite.config.js`

- [ ] **Step 1: Initialize Vite project in the current directory**

Run from `e:\CarDekho` in PowerShell:
```powershell
npm create vite@latest . -- --template react
```
When prompted about existing files — select **Yes, remove existing files and continue**.

Expected: `✔ Done.` — `package.json`, `src/`, `index.html`, `public/`, `vite.config.js` appear.

- [ ] **Step 2: Install base Vite dependencies**

```powershell
npm install
```
Expected: `node_modules/` created, no errors.

- [ ] **Step 3: Commit initial scaffold**

```powershell
git init
git add .
git commit -m "chore: initialize vite react project"
```

---

## Task 2: Install All Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install frontend runtime dependency**

```powershell
npm install react-router-dom
```
Expected: `react-router-dom` appears in `dependencies`.

- [ ] **Step 2: Install Tailwind CSS**

```powershell
npm install -D tailwindcss postcss autoprefixer
```
Expected: three entries appear in `devDependencies`.

- [ ] **Step 3: Install backend and dev tooling**

```powershell
npm install express cors
npm install -D concurrently nodemon
```
Expected: `express`, `cors` in `dependencies`; `concurrently`, `nodemon` in `devDependencies`.

- [ ] **Step 4: Commit updated dependencies**

```powershell
git add package.json package-lock.json
git commit -m "chore: install frontend and backend dependencies"
```

---

## Task 3: Update package.json Scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Replace the scripts section in package.json**

Open `package.json` and replace its `"scripts"` block with:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "server": "nodemon server/index.js",
  "start": "concurrently \"npm run dev\" \"npm run server\""
},
```

- [ ] **Step 2: Commit updated scripts**

```powershell
git add package.json
git commit -m "chore: add npm scripts for concurrent frontend and backend"
```

---

## Task 4: Configure Tailwind CSS

**Files:**
- Create: `tailwind.config.js`, `postcss.config.js`
- Modify: `src/index.css`, `index.html`

- [ ] **Step 1: Initialize Tailwind config files**

```powershell
npx tailwindcss init -p
```
Expected: `tailwind.config.js` and `postcss.config.js` created.

- [ ] **Step 2: Write tailwind.config.js with custom theme**

Replace the generated `tailwind.config.js` with:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Replace src/index.css with Tailwind directives**

Replace the entire content of `src/index.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
  body {
    @apply bg-neutral-50 text-neutral-800;
  }
}
```

- [ ] **Step 4: Add Inter font to index.html**

In `index.html`, insert these three lines inside `<head>`, just before `</head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 5: Update the page title**

In `index.html`, change `<title>Vite + React</title>` to:
```html
<title>CarDekho — Find Your Perfect Car</title>
```

- [ ] **Step 6: Commit Tailwind configuration**

```powershell
git add tailwind.config.js postcss.config.js src/index.css index.html
git commit -m "chore: configure tailwind css with custom theme and inter font"
```

---

## Task 5: Configure Vite Proxy

**Files:**
- Modify: `vite.config.js`

- [ ] **Step 1: Replace vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
```

- [ ] **Step 2: Commit vite config**

```powershell
git add vite.config.js
git commit -m "chore: configure vite proxy to forward /api to express"
```

---

## Task 6: Create Folder Structure

**Files:**
- Create: all subdirectories

- [ ] **Step 1: Create frontend subdirectories**

```powershell
New-Item -ItemType Directory -Force -Path src/components/ui
New-Item -ItemType Directory -Force -Path src/components/layout
New-Item -ItemType Directory -Force -Path src/pages
New-Item -ItemType Directory -Force -Path src/data
New-Item -ItemType Directory -Force -Path src/utils
New-Item -ItemType Directory -Force -Path src/hooks
New-Item -ItemType Directory -Force -Path src/services
New-Item -ItemType Directory -Force -Path src/layouts
```

- [ ] **Step 2: Create backend subdirectories**

```powershell
New-Item -ItemType Directory -Force -Path server/routes
New-Item -ItemType Directory -Force -Path server/controllers
New-Item -ItemType Directory -Force -Path server/data
New-Item -ItemType Directory -Force -Path server/utils
```

- [ ] **Step 3: Commit folder structure (Git tracks files not dirs — create .gitkeep files for empty dirs)**

```powershell
New-Item -ItemType File -Force -Path src/data/.gitkeep
New-Item -ItemType File -Force -Path src/utils/.gitkeep
New-Item -ItemType File -Force -Path src/hooks/.gitkeep
git add src/data/.gitkeep src/utils/.gitkeep src/hooks/.gitkeep
git commit -m "chore: create project folder structure"
```

---

## Task 7: Set Up Express Backend

**Files:**
- Create: `server/utils/response.js`, `server/index.js`

- [ ] **Step 1: Create response utility**

Write `server/utils/response.js`:
```js
const sendSuccess = (res, data, message = 'Success') => {
  res.json({ success: true, message, data })
}

const sendError = (res, message = 'Internal server error', status = 500) => {
  res.status(status).json({ success: false, message, data: null })
}

module.exports = { sendSuccess, sendError }
```

- [ ] **Step 2: Create Express entry point**

Write `server/index.js`:
```js
const express = require('express')
const cors = require('cors')

const carsRouter = require('./routes/cars')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/cars', carsRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

module.exports = app
```

- [ ] **Step 3: Commit server entry point**

```powershell
git add server/index.js server/utils/response.js
git commit -m "feat: add express server with health check endpoint"
```

---

## Task 8: Create Static Car Data

**Files:**
- Create: `server/data/cars.json`

- [ ] **Step 1: Write cars.json with 5 sample cars**

Write `server/data/cars.json`:
```json
[
  {
    "id": "maruti-swift",
    "name": "Maruti Suzuki Swift",
    "brand": "Maruti Suzuki",
    "category": "hatchback",
    "price": { "min": 649000, "max": 999000 },
    "fuelTypes": ["petrol", "cng"],
    "transmission": ["manual", "automatic"],
    "seating": 5,
    "mileage": 23.2,
    "imageUrl": "/images/swift.jpg",
    "tags": ["budget", "city", "fuel-efficient", "popular"],
    "pros": ["Excellent fuel efficiency", "Easy to drive in city", "Low maintenance cost"],
    "cons": ["Small boot space", "Limited rear headroom"],
    "idealFor": ["first-time-buyers", "city-commuters", "budget-buyers"]
  },
  {
    "id": "hyundai-creta",
    "name": "Hyundai Creta",
    "brand": "Hyundai",
    "category": "suv",
    "price": { "min": 1099000, "max": 2099000 },
    "fuelTypes": ["petrol", "diesel"],
    "transmission": ["manual", "automatic"],
    "seating": 5,
    "mileage": 17.0,
    "imageUrl": "/images/creta.jpg",
    "tags": ["family", "suv", "premium", "popular"],
    "pros": ["Premium interiors", "Strong road presence", "Feature-rich"],
    "cons": ["Higher price", "Average fuel efficiency"],
    "idealFor": ["families", "highway-drivers", "status-seekers"]
  },
  {
    "id": "tata-nexon",
    "name": "Tata Nexon",
    "brand": "Tata",
    "category": "suv",
    "price": { "min": 799000, "max": 1499000 },
    "fuelTypes": ["petrol", "diesel", "electric"],
    "transmission": ["manual", "automatic"],
    "seating": 5,
    "mileage": 19.5,
    "imageUrl": "/images/nexon.jpg",
    "tags": ["safe", "compact-suv", "value", "5-star-safety"],
    "pros": ["5-star safety rating", "Spacious for its size", "Modern features"],
    "cons": ["Smaller service network", "Resale value still improving"],
    "idealFor": ["safety-conscious", "value-seekers", "young-families"]
  },
  {
    "id": "honda-city",
    "name": "Honda City",
    "brand": "Honda",
    "category": "sedan",
    "price": { "min": 1199000, "max": 1599000 },
    "fuelTypes": ["petrol"],
    "transmission": ["manual", "automatic"],
    "seating": 5,
    "mileage": 18.4,
    "imageUrl": "/images/city.jpg",
    "tags": ["premium", "sedan", "professional", "refined"],
    "pros": ["Refined performance", "Premium cabin quality", "Strong resale value"],
    "cons": ["Higher maintenance cost", "Less ground clearance than SUVs"],
    "idealFor": ["professionals", "highway-drivers", "premium-buyers"]
  },
  {
    "id": "maruti-ertiga",
    "name": "Maruti Suzuki Ertiga",
    "brand": "Maruti Suzuki",
    "category": "mpv",
    "price": { "min": 879000, "max": 1299000 },
    "fuelTypes": ["petrol", "cng"],
    "transmission": ["manual", "automatic"],
    "seating": 7,
    "mileage": 20.3,
    "imageUrl": "/images/ertiga.jpg",
    "tags": ["family", "7-seater", "mpv", "practical"],
    "pros": ["7 seats for large families", "Efficient CNG option", "Practical boot space"],
    "cons": ["Not sporty", "Basic interiors in base trim"],
    "idealFor": ["large-families", "budget-buyers", "practical-buyers"]
  }
]
```

- [ ] **Step 2: Commit car data**

```powershell
git add server/data/cars.json
git commit -m "feat: add static car data with 5 sample cars"
```

---

## Task 9: Create Car Controller and Routes

**Files:**
- Create: `server/controllers/carsController.js`, `server/routes/cars.js`

- [ ] **Step 1: Create cars controller**

Write `server/controllers/carsController.js`:
```js
const cars = require('../data/cars.json')
const { sendSuccess, sendError } = require('../utils/response')

const getAllCars = (req, res) => {
  sendSuccess(res, cars, 'Cars fetched successfully')
}

const getCarById = (req, res) => {
  const car = cars.find(c => c.id === req.params.id)
  if (!car) return sendError(res, 'Car not found', 404)
  sendSuccess(res, car, 'Car fetched successfully')
}

module.exports = { getAllCars, getCarById }
```

- [ ] **Step 2: Create cars router**

Write `server/routes/cars.js`:
```js
const express = require('express')
const router = express.Router()
const { getAllCars, getCarById } = require('../controllers/carsController')

router.get('/', getAllCars)
router.get('/:id', getCarById)

module.exports = router
```

- [ ] **Step 3: Verify routes respond correctly**

Start the server in one terminal:
```powershell
node server/index.js
```
In a second terminal:
```powershell
curl http://localhost:3001/api/health
```
Expected: `{"status":"ok","timestamp":"..."}` 

```powershell
curl http://localhost:3001/api/cars
```
Expected: JSON array with 5 car objects.

```powershell
curl http://localhost:3001/api/cars/tata-nexon
```
Expected: JSON object for Nexon only.

```powershell
curl http://localhost:3001/api/cars/does-not-exist
```
Expected: `{"success":false,"message":"Car not found","data":null}` with HTTP 404.

Stop the server with Ctrl+C.

- [ ] **Step 4: Commit routes and controller**

```powershell
git add server/routes/cars.js server/controllers/carsController.js
git commit -m "feat: add cars controller and routes with static data"
```

---

## Task 10: Create Frontend API Service

**Files:**
- Create: `src/services/carsApi.js`

- [ ] **Step 1: Write the API service module**

Write `src/services/carsApi.js`:
```js
const BASE_URL = '/api'

export const fetchAllCars = async () => {
  const res = await fetch(`${BASE_URL}/cars`)
  if (!res.ok) throw new Error('Failed to fetch cars')
  const json = await res.json()
  return json.data
}

export const fetchCarById = async (id) => {
  const res = await fetch(`${BASE_URL}/cars/${id}`)
  if (!res.ok) throw new Error(`Car not found: ${id}`)
  const json = await res.json()
  return json.data
}
```

- [ ] **Step 2: Commit API service**

```powershell
git add src/services/carsApi.js
git commit -m "feat: add frontend api service for cars endpoints"
```

---

## Task 11: Create Reusable UI Components

**Files:**
- Create: `src/components/ui/Button.jsx`, `src/components/ui/Card.jsx`, `src/components/layout/Header.jsx`

- [ ] **Step 1: Create Button component**

Write `src/components/ui/Button.jsx`:
```jsx
const variantClasses = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200',
  ghost: 'hover:bg-neutral-100 text-neutral-700',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium rounded-xl
        transition-colors duration-200 focus:outline-none focus:ring-2
        focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50
        disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Create Card component**

Write `src/components/ui/Card.jsx`:
```jsx
export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-neutral-100
        ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Create Header component**

Write `src/components/layout/Header.jsx`:
```jsx
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white border-b border-neutral-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary-600">Car</span>
            <span className="text-2xl font-bold text-neutral-800">Dekho</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/advisor"
              className="text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors"
            >
              Find My Car
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Commit UI components**

```powershell
git add src/components/
git commit -m "feat: add Button, Card, and Header reusable components"
```

---

## Task 12: Create MainLayout

**Files:**
- Create: `src/layouts/MainLayout.jsx`

- [ ] **Step 1: Write MainLayout**

Write `src/layouts/MainLayout.jsx`:
```jsx
import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-neutral-100 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-500">
          © 2026 CarDekho Advisor · Helping you find your perfect car
        </div>
      </footer>
    </div>
  )
}
```

- [ ] **Step 2: Commit layout**

```powershell
git add src/layouts/MainLayout.jsx
git commit -m "feat: add MainLayout with sticky header and footer"
```

---

## Task 13: Create Placeholder Pages

**Files:**
- Create: `src/pages/OnboardingPage.jsx`, `src/pages/RecommendationsPage.jsx`, `src/pages/ComparePage.jsx`

- [ ] **Step 1: Write OnboardingPage placeholder**

Write `src/pages/OnboardingPage.jsx`:
```jsx
export default function OnboardingPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-neutral-800 mb-4">
        Let's Find Your Perfect Car
      </h1>
      <p className="text-neutral-500">Multi-step onboarding form — coming in next phase.</p>
    </div>
  )
}
```

- [ ] **Step 2: Write RecommendationsPage placeholder**

Write `src/pages/RecommendationsPage.jsx`:
```jsx
export default function RecommendationsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-neutral-800 mb-4">
        Your Recommendations
      </h1>
      <p className="text-neutral-500">Personalized results — coming in next phase.</p>
    </div>
  )
}
```

- [ ] **Step 3: Write ComparePage placeholder**

Write `src/pages/ComparePage.jsx`:
```jsx
export default function ComparePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-neutral-800 mb-4">
        Compare Cars
      </h1>
      <p className="text-neutral-500">Side-by-side comparison — coming in next phase.</p>
    </div>
  )
}
```

- [ ] **Step 4: Commit placeholder pages**

```powershell
git add src/pages/
git commit -m "feat: add placeholder pages for onboarding, recommendations, compare"
```

---

## Task 14: Create Landing Page

**Files:**
- Create: `src/pages/LandingPage.jsx`

- [ ] **Step 1: Write the full Landing Page**

Write `src/pages/LandingPage.jsx`:
```jsx
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const features = [
  {
    icon: '🎯',
    title: 'Personalized for You',
    description: 'Answer a few questions and get recommendations tailored to your lifestyle, budget, and needs.',
  },
  {
    icon: '🧠',
    title: 'Guided Decision Making',
    description: "Confused about which car to buy? We break it down simply — no jargon, no overwhelm.",
  },
  {
    icon: '⚖️',
    title: 'Side-by-Side Comparison',
    description: 'Compare your top picks on what actually matters to you — not just spec sheets.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-primary-100 text-primary-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Car Buying Made Simple
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 leading-tight mb-6">
            Find the perfect car{' '}
            <span className="text-primary-600">for your life</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto mb-10">
            Stop googling "best car under 10 lakhs." Answer a few simple questions
            and we'll recommend the right car for <em>you</em> — not everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/advisor')}>
              Find My Car →
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/advisor')}>
              How it works
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-neutral-800 mb-4">
            A smarter way to buy your car
          </h2>
          <p className="text-center text-neutral-500 mb-12 max-w-xl mx-auto">
            Most car buyers are overwhelmed. We guide you step-by-step.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to find your car?
          </h2>
          <p className="text-primary-100 mb-8">
            Takes less than 3 minutes. No registration required.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/advisor')}
          >
            Start Now — It's Free
          </Button>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Commit landing page**

```powershell
git add src/pages/LandingPage.jsx
git commit -m "feat: add landing page with hero, features, and cta sections"
```

---

## Task 15: Set Up React Router

**Files:**
- Modify: `src/App.jsx`, `src/main.jsx`

- [ ] **Step 1: Replace App.jsx with router setup**

Write `src/App.jsx`:
```jsx
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import RecommendationsPage from './pages/RecommendationsPage'
import ComparePage from './pages/ComparePage'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/advisor" element={<OnboardingPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Route>
    </Routes>
  )
}
```

- [ ] **Step 2: Replace main.jsx with BrowserRouter wrapper**

Write `src/main.jsx`:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 3: Commit router setup**

```powershell
git add src/App.jsx src/main.jsx
git commit -m "feat: configure react router with layout and all page routes"
```

---

## Task 16: Final Integration Verification

**Files:** None — verification only.

- [ ] **Step 1: Start both frontend and backend together**

```powershell
npm run start
```
Expected:
```
[0] VITE v5.x.x  ready in xxx ms
[0]   ➜  Local:   http://localhost:5173/
[1] Server running on http://localhost:3001
```

- [ ] **Step 2: Verify all routes in browser**

Navigate to each URL and confirm expected content:

| URL | Expected |
|-----|----------|
| `http://localhost:5173/` | Landing page — gradient hero, 3 feature cards, blue CTA strip |
| `http://localhost:5173/advisor` | "Let's Find Your Perfect Car" placeholder |
| `http://localhost:5173/recommendations` | "Your Recommendations" placeholder |
| `http://localhost:5173/compare` | "Compare Cars" placeholder |
| `http://localhost:5173/api/cars` | JSON array of 5 cars (via Vite proxy) |
| `http://localhost:5173/api/health` | `{"status":"ok","timestamp":"..."}` |

- [ ] **Step 3: Final commit**

```powershell
git add .
git commit -m "chore: project setup complete — all routes and backend verified"
```

---

## Self-Review

**Spec coverage:**
- React + Vite → Task 1
- Tailwind CSS → Task 4
- React Router → Task 15
- Node.js + Express backend → Task 7, 9
- Static JSON files → Task 8
- Folder structure (components/, pages/, data/, utils/, hooks/, services/, layouts/) → Task 6
- Backend folder structure (routes/, controllers/, data/, utils/) → Task 6
- Reusable components, card-based UI → Task 11
- Mobile responsive, soft colors, clean/minimal → Tailwind classes throughout
- Landing page (initial clean homepage) → Task 14
- Placeholder pages for all app flow screens → Task 13
- Routing setup → Task 15
- Vite setup steps → Task 1, 5
- Backend Express setup → Task 7
- No auth, no admin, no AI/OpenAI, no complex state libs → confirmed absent

**Placeholder scan:** All task steps contain complete code. No TBDs.

**Type consistency:**
- `Button` props (`variant`, `size`, `className`) — consistent across Task 11 definition and Task 14 usage
- `Card` props (`children`, `className`, `hover`) — consistent across Task 11 definition and Task 14 usage
- Route paths (`/`, `/advisor`, `/recommendations`, `/compare`) — consistent across `App.jsx`, `Header.jsx`, `LandingPage.jsx`
- `sendSuccess(res, data, message)` / `sendError(res, message, status)` — consistent across Task 7 definition and Task 9 usage
- `fetchAllCars()` / `fetchCarById(id)` in `carsApi.js` — defined in Task 10, not yet consumed (intentional — business logic deferred to next phase)
