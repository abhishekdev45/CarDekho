# Recommendations Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a rule-based scoring + persona engine that turns 7 onboarding answers into 3 personalized car recommendations with a comparison table.

**Architecture:** The Express backend receives user answers via POST /api/recommendations, runs them through a persona engine and weighted scoring engine, and returns structured recommendation data. The React frontend reads the onboarding answers from OnboardingContext, fetches from the API, and renders a persona badge, three recommendation cards, and a comparison table.

**Tech Stack:** Node.js + Express (CommonJS) backend, React 19 + Tailwind CSS v4 frontend, OnboardingContext for state, static cars.json as data source.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `server/data/cars.json` | Replace | 17 scored Indian-market cars |
| `server/utils/personaEngine.js` | Create | `identifyPersona(answers)` |
| `server/utils/scoringEngine.js` | Create | `buildWeights`, `filterByBudget`, `calculateCarScore`, `generateRecommendations` |
| `server/utils/explanationEngine.js` | Create | `generateWhyItFits`, `generateStrengths`, `generateTradeoffs` |
| `server/routes/recommendations.js` | Create | `POST /api/recommendations` handler |
| `server/index.js` | Modify | Register recommendations route |
| `src/hooks/useRecommendations.js` | Create | Fetch hook: loading / data / error |
| `src/components/recommendations/PersonaBadge.jsx` | Create | Persona title, description, priority chips |
| `src/components/recommendations/RecommendationCard.jsx` | Create | Car card: image fallback, match%, why, strengths, tradeoffs |
| `src/components/recommendations/ComparisonTable.jsx` | Create | 9-dimension × 3-car table with progress bars |
| `src/pages/RecommendationsPage.jsx` | Replace | Full page: guard → fetch → render |

---

### Task 1: Replace cars.json with 17 scored cars

**Files:**
- Replace: `server/data/cars.json`

The existing file has 5 cars with basic fields. Replace the entire file with 17 Indian-market cars, each carrying 14 numeric score fields (all 1–10 scale).

- [ ] **Step 1: Write the new cars.json**

Replace `server/data/cars.json` with:

```json
[
  {
    "id": "renault-kwid",
    "name": "Renault Kwid",
    "brand": "Renault",
    "bodyType": "Hatchback",
    "priceMin": 449000,
    "priceMax": 649000,
    "priceRange": "₹4.5L – 6.5L",
    "imageUrl": "/images/kwid.jpg",
    "safetyScore": 4,
    "mileageScore": 9,
    "maintenanceScore": 7,
    "comfortScore": 5,
    "performanceScore": 3,
    "cityDrivingScore": 9,
    "highwayScore": 4,
    "familyScore": 4,
    "beginnerFriendlyScore": 9,
    "resaleScore": 5,
    "premiumScore": 3,
    "badRoadScore": 7,
    "trafficFriendlyScore": 9,
    "serviceNetworkScore": 6,
    "tags": ["entry-budget", "city", "first-car"]
  },
  {
    "id": "maruti-wagonr",
    "name": "Maruti Suzuki WagonR",
    "brand": "Maruti Suzuki",
    "bodyType": "Hatchback",
    "priceMin": 549000,
    "priceMax": 749000,
    "priceRange": "₹5.5L – 7.5L",
    "imageUrl": "/images/wagonr.jpg",
    "safetyScore": 6,
    "mileageScore": 10,
    "maintenanceScore": 10,
    "comfortScore": 7,
    "performanceScore": 4,
    "cityDrivingScore": 8,
    "highwayScore": 5,
    "familyScore": 6,
    "beginnerFriendlyScore": 9,
    "resaleScore": 9,
    "premiumScore": 3,
    "badRoadScore": 7,
    "trafficFriendlyScore": 8,
    "serviceNetworkScore": 10,
    "tags": ["budget", "spacious-hatch", "cng", "practical"]
  },
  {
    "id": "hyundai-grand-i10-nios",
    "name": "Hyundai Grand i10 Nios",
    "brand": "Hyundai",
    "bodyType": "Hatchback",
    "priceMin": 589000,
    "priceMax": 899000,
    "priceRange": "₹5.9L – 8.9L",
    "imageUrl": "/images/grand-i10.jpg",
    "safetyScore": 7,
    "mileageScore": 8,
    "maintenanceScore": 8,
    "comfortScore": 6,
    "performanceScore": 5,
    "cityDrivingScore": 9,
    "highwayScore": 6,
    "familyScore": 5,
    "beginnerFriendlyScore": 9,
    "resaleScore": 7,
    "premiumScore": 5,
    "badRoadScore": 6,
    "trafficFriendlyScore": 9,
    "serviceNetworkScore": 8,
    "tags": ["budget", "city", "beginner-friendly"]
  },
  {
    "id": "tata-punch",
    "name": "Tata Punch",
    "brand": "Tata",
    "bodyType": "Micro SUV",
    "priceMin": 599000,
    "priceMax": 999000,
    "priceRange": "₹6L – 9.9L",
    "imageUrl": "/images/punch.jpg",
    "safetyScore": 10,
    "mileageScore": 8,
    "maintenanceScore": 7,
    "comfortScore": 6,
    "performanceScore": 5,
    "cityDrivingScore": 8,
    "highwayScore": 6,
    "familyScore": 5,
    "beginnerFriendlyScore": 8,
    "resaleScore": 7,
    "premiumScore": 5,
    "badRoadScore": 8,
    "trafficFriendlyScore": 8,
    "serviceNetworkScore": 7,
    "tags": ["5-star-safety", "micro-suv", "budget"]
  },
  {
    "id": "maruti-swift",
    "name": "Maruti Suzuki Swift",
    "brand": "Maruti Suzuki",
    "bodyType": "Hatchback",
    "priceMin": 649000,
    "priceMax": 999000,
    "priceRange": "₹6.5L – 9.9L",
    "imageUrl": "/images/swift.jpg",
    "safetyScore": 7,
    "mileageScore": 10,
    "maintenanceScore": 10,
    "comfortScore": 6,
    "performanceScore": 5,
    "cityDrivingScore": 9,
    "highwayScore": 6,
    "familyScore": 5,
    "beginnerFriendlyScore": 9,
    "resaleScore": 9,
    "premiumScore": 4,
    "badRoadScore": 6,
    "trafficFriendlyScore": 9,
    "serviceNetworkScore": 10,
    "tags": ["budget", "city", "fuel-efficient", "popular"]
  },
  {
    "id": "maruti-baleno",
    "name": "Maruti Suzuki Baleno",
    "brand": "Maruti Suzuki",
    "bodyType": "Hatchback",
    "priceMin": 699000,
    "priceMax": 999000,
    "priceRange": "₹7L – 10L",
    "imageUrl": "/images/baleno.jpg",
    "safetyScore": 7,
    "mileageScore": 9,
    "maintenanceScore": 9,
    "comfortScore": 7,
    "performanceScore": 6,
    "cityDrivingScore": 8,
    "highwayScore": 7,
    "familyScore": 6,
    "beginnerFriendlyScore": 8,
    "resaleScore": 8,
    "premiumScore": 7,
    "badRoadScore": 6,
    "trafficFriendlyScore": 8,
    "serviceNetworkScore": 10,
    "tags": ["premium-hatch", "features", "city"]
  },
  {
    "id": "honda-amaze",
    "name": "Honda Amaze",
    "brand": "Honda",
    "bodyType": "Compact Sedan",
    "priceMin": 749000,
    "priceMax": 1199000,
    "priceRange": "₹7.5L – 12L",
    "imageUrl": "/images/amaze.jpg",
    "safetyScore": 8,
    "mileageScore": 8,
    "maintenanceScore": 7,
    "comfortScore": 7,
    "performanceScore": 6,
    "cityDrivingScore": 7,
    "highwayScore": 7,
    "familyScore": 6,
    "beginnerFriendlyScore": 7,
    "resaleScore": 7,
    "premiumScore": 6,
    "badRoadScore": 5,
    "trafficFriendlyScore": 7,
    "serviceNetworkScore": 7,
    "tags": ["compact-sedan", "professional", "fuel-efficient"]
  },
  {
    "id": "maruti-fronx",
    "name": "Maruti Suzuki Fronx",
    "brand": "Maruti Suzuki",
    "bodyType": "Coupe SUV",
    "priceMin": 749000,
    "priceMax": 1249000,
    "priceRange": "₹7.5L – 12.5L",
    "imageUrl": "/images/fronx.jpg",
    "safetyScore": 8,
    "mileageScore": 8,
    "maintenanceScore": 9,
    "comfortScore": 7,
    "performanceScore": 7,
    "cityDrivingScore": 8,
    "highwayScore": 7,
    "familyScore": 6,
    "beginnerFriendlyScore": 7,
    "resaleScore": 8,
    "premiumScore": 8,
    "badRoadScore": 7,
    "trafficFriendlyScore": 8,
    "serviceNetworkScore": 10,
    "tags": ["sporty", "coupe-suv", "turbo", "maruti"]
  },
  {
    "id": "hyundai-i20",
    "name": "Hyundai i20",
    "brand": "Hyundai",
    "bodyType": "Premium Hatchback",
    "priceMin": 799000,
    "priceMax": 1299000,
    "priceRange": "₹8L – 13L",
    "imageUrl": "/images/i20.jpg",
    "safetyScore": 8,
    "mileageScore": 8,
    "maintenanceScore": 7,
    "comfortScore": 7,
    "performanceScore": 7,
    "cityDrivingScore": 8,
    "highwayScore": 7,
    "familyScore": 6,
    "beginnerFriendlyScore": 7,
    "resaleScore": 7,
    "premiumScore": 8,
    "badRoadScore": 6,
    "trafficFriendlyScore": 8,
    "serviceNetworkScore": 8,
    "tags": ["premium-hatch", "features", "turbo"]
  },
  {
    "id": "tata-nexon",
    "name": "Tata Nexon",
    "brand": "Tata",
    "bodyType": "Compact SUV",
    "priceMin": 799000,
    "priceMax": 1499000,
    "priceRange": "₹8L – 15L",
    "imageUrl": "/images/nexon.jpg",
    "safetyScore": 10,
    "mileageScore": 7,
    "maintenanceScore": 7,
    "comfortScore": 7,
    "performanceScore": 7,
    "cityDrivingScore": 7,
    "highwayScore": 7,
    "familyScore": 7,
    "beginnerFriendlyScore": 7,
    "resaleScore": 7,
    "premiumScore": 7,
    "badRoadScore": 8,
    "trafficFriendlyScore": 7,
    "serviceNetworkScore": 7,
    "tags": ["5-star-safety", "compact-suv", "value", "electric-option"]
  },
  {
    "id": "maruti-ertiga",
    "name": "Maruti Suzuki Ertiga",
    "brand": "Maruti Suzuki",
    "bodyType": "MPV",
    "priceMin": 869000,
    "priceMax": 1299000,
    "priceRange": "₹8.7L – 13L",
    "imageUrl": "/images/ertiga.jpg",
    "safetyScore": 7,
    "mileageScore": 9,
    "maintenanceScore": 10,
    "comfortScore": 8,
    "performanceScore": 5,
    "cityDrivingScore": 7,
    "highwayScore": 7,
    "familyScore": 10,
    "beginnerFriendlyScore": 7,
    "resaleScore": 8,
    "premiumScore": 5,
    "badRoadScore": 6,
    "trafficFriendlyScore": 6,
    "serviceNetworkScore": 10,
    "tags": ["7-seater", "family", "mpv", "cng"]
  },
  {
    "id": "hyundai-creta",
    "name": "Hyundai Creta",
    "brand": "Hyundai",
    "bodyType": "SUV",
    "priceMin": 1099000,
    "priceMax": 2099000,
    "priceRange": "₹11L – 21L",
    "imageUrl": "/images/creta.jpg",
    "safetyScore": 8,
    "mileageScore": 6,
    "maintenanceScore": 7,
    "comfortScore": 8,
    "performanceScore": 7,
    "cityDrivingScore": 7,
    "highwayScore": 8,
    "familyScore": 7,
    "beginnerFriendlyScore": 7,
    "resaleScore": 8,
    "premiumScore": 9,
    "badRoadScore": 8,
    "trafficFriendlyScore": 6,
    "serviceNetworkScore": 8,
    "tags": ["suv", "premium", "family", "popular"]
  },
  {
    "id": "kia-seltos",
    "name": "Kia Seltos",
    "brand": "Kia",
    "bodyType": "SUV",
    "priceMin": 1099000,
    "priceMax": 2099000,
    "priceRange": "₹11L – 21L",
    "imageUrl": "/images/seltos.jpg",
    "safetyScore": 8,
    "mileageScore": 6,
    "maintenanceScore": 7,
    "comfortScore": 9,
    "performanceScore": 8,
    "cityDrivingScore": 7,
    "highwayScore": 8,
    "familyScore": 8,
    "beginnerFriendlyScore": 6,
    "resaleScore": 8,
    "premiumScore": 9,
    "badRoadScore": 8,
    "trafficFriendlyScore": 6,
    "serviceNetworkScore": 7,
    "tags": ["suv", "premium", "features", "turbo"]
  },
  {
    "id": "honda-city",
    "name": "Honda City",
    "brand": "Honda",
    "bodyType": "Sedan",
    "priceMin": 1199000,
    "priceMax": 1599000,
    "priceRange": "₹12L – 16L",
    "imageUrl": "/images/city.jpg",
    "safetyScore": 8,
    "mileageScore": 7,
    "maintenanceScore": 7,
    "comfortScore": 8,
    "performanceScore": 7,
    "cityDrivingScore": 7,
    "highwayScore": 8,
    "familyScore": 7,
    "beginnerFriendlyScore": 7,
    "resaleScore": 8,
    "premiumScore": 8,
    "badRoadScore": 5,
    "trafficFriendlyScore": 7,
    "serviceNetworkScore": 7,
    "tags": ["sedan", "professional", "premium", "highway"]
  },
  {
    "id": "mahindra-xuv700",
    "name": "Mahindra XUV700",
    "brand": "Mahindra",
    "bodyType": "Premium SUV",
    "priceMin": 1399000,
    "priceMax": 2599000,
    "priceRange": "₹14L – 26L",
    "imageUrl": "/images/xuv700.jpg",
    "safetyScore": 10,
    "mileageScore": 7,
    "maintenanceScore": 6,
    "comfortScore": 9,
    "performanceScore": 9,
    "cityDrivingScore": 6,
    "highwayScore": 9,
    "familyScore": 9,
    "beginnerFriendlyScore": 5,
    "resaleScore": 8,
    "premiumScore": 10,
    "badRoadScore": 9,
    "trafficFriendlyScore": 5,
    "serviceNetworkScore": 7,
    "tags": ["5-star-safety", "premium-suv", "adas", "7-seater"]
  },
  {
    "id": "toyota-innova-crysta",
    "name": "Toyota Innova Crysta",
    "brand": "Toyota",
    "bodyType": "Premium MPV",
    "priceMin": 1899000,
    "priceMax": 2749000,
    "priceRange": "₹19L – 27.5L",
    "imageUrl": "/images/innova.jpg",
    "safetyScore": 8,
    "mileageScore": 6,
    "maintenanceScore": 8,
    "comfortScore": 10,
    "performanceScore": 6,
    "cityDrivingScore": 5,
    "highwayScore": 9,
    "familyScore": 10,
    "beginnerFriendlyScore": 5,
    "resaleScore": 9,
    "premiumScore": 9,
    "badRoadScore": 8,
    "trafficFriendlyScore": 4,
    "serviceNetworkScore": 9,
    "tags": ["premium-mpv", "family", "highway", "7-8-seater"]
  },
  {
    "id": "toyota-fortuner",
    "name": "Toyota Fortuner",
    "brand": "Toyota",
    "bodyType": "SUV",
    "priceMin": 3299000,
    "priceMax": 5099000,
    "priceRange": "₹33L – 51L",
    "imageUrl": "/images/fortuner.jpg",
    "safetyScore": 8,
    "mileageScore": 5,
    "maintenanceScore": 7,
    "comfortScore": 9,
    "performanceScore": 8,
    "cityDrivingScore": 4,
    "highwayScore": 9,
    "familyScore": 8,
    "beginnerFriendlyScore": 3,
    "resaleScore": 10,
    "premiumScore": 10,
    "badRoadScore": 10,
    "trafficFriendlyScore": 3,
    "serviceNetworkScore": 9,
    "tags": ["premium-suv", "off-road", "status", "body-on-frame"]
  }
]
```

- [ ] **Step 2: Verify the file is valid JSON**

Run in PowerShell:
```powershell
node -e "const d = require('./server/data/cars.json'); console.log('Cars:', d.length)"
```
Expected output: `Cars: 17`

- [ ] **Step 3: Commit**

```powershell
git add server/data/cars.json
git commit -m "data: replace cars.json with 17 scored Indian-market cars"
```

---

### Task 2: Create personaEngine.js

**Files:**
- Create: `server/utils/personaEngine.js`

Identifies a buyer persona from user answers using additive rule-based scoring. Returns an object with `title`, `description`, and `topPriorities`.

- [ ] **Step 1: Create server/utils/personaEngine.js**

```js
const PERSONAS = {
  'Practical City Commuter': {
    title: 'Practical City Commuter',
    description: 'You want a car that gets you where you need to go without drama — great mileage, easy parking, and low running costs that keep your wallet happy.',
    topPriorities: ['Fuel efficiency', 'Low maintenance', 'Easy city driving'],
  },
  'Family Comfort Buyer': {
    title: 'Family Comfort Buyer',
    description: "Your car is the family's second home. You need space, safety, and a smooth ride so everyone — including parents and kids — arrives comfortable.",
    topPriorities: ['Family space', 'Safety', 'Comfort for everyone'],
  },
  'Premium Aspirer': {
    title: 'Premium Aspirer',
    description: 'You want a car that reflects your taste — premium interiors, modern features, and a strong presence on the road that turns heads.',
    topPriorities: ['Premium feel', 'Features & tech', 'Road presence'],
  },
  'Enthusiast Driver': {
    title: 'Enthusiast Driver',
    description: "Driving is more than transport for you — it's an experience. You want a car that's responsive, engaging, and fun to push on open roads.",
    topPriorities: ['Performance', 'Driving dynamics', 'Fun factor'],
  },
  'Stress-Free Owner': {
    title: 'Stress-Free Owner',
    description: 'You want a car that just works. Wide service network, low maintenance costs, and peace of mind every time you turn the key.',
    topPriorities: ['Low maintenance', 'Wide service coverage', 'Reliability'],
  },
}

function identifyPersona(answers) {
  const scores = {
    'Practical City Commuter': 0,
    'Family Comfort Buyer': 0,
    'Premium Aspirer': 0,
    'Enthusiast Driver': 0,
    'Stress-Free Owner': 0,
  }

  const { budget, usage, travelers, experience, roadConditions, priorities, ownership } = answers

  if (['under-7l', '7l-10l'].includes(budget)) {
    scores['Practical City Commuter'] += 2
    scores['Stress-Free Owner'] += 1
  }
  if (['10l-15l'].includes(budget)) {
    scores['Practical City Commuter'] += 1
    scores['Family Comfort Buyer'] += 1
    scores['Premium Aspirer'] += 1
  }
  if (['15l-25l', '25l-plus'].includes(budget)) {
    scores['Premium Aspirer'] += 3
    scores['Enthusiast Driver'] += 1
    scores['Family Comfort Buyer'] += 1
  }

  if (['office-commute', 'city'].includes(usage)) scores['Practical City Commuter'] += 3
  if (usage === 'family') scores['Family Comfort Buyer'] += 3
  if (usage === 'highway') { scores['Enthusiast Driver'] += 2; scores['Premium Aspirer'] += 1 }
  if (usage === 'weekend') { scores['Enthusiast Driver'] += 1; scores['Premium Aspirer'] += 1 }
  if (usage === 'mixed') { scores['Practical City Commuter'] += 1; scores['Family Comfort Buyer'] += 1 }

  if (['large-family', 'small-family'].includes(travelers)) scores['Family Comfort Buyer'] += 2
  if (travelers === 'parents') { scores['Family Comfort Buyer'] += 2; scores['Stress-Free Owner'] += 1 }
  if (travelers === 'kids') { scores['Family Comfort Buyer'] += 3; scores['Stress-Free Owner'] += 1 }
  if (travelers === 'couple') { scores['Premium Aspirer'] += 1; scores['Enthusiast Driver'] += 1 }
  if (travelers === 'alone') { scores['Enthusiast Driver'] += 1; scores['Practical City Commuter'] += 1 }

  if (['first-time', 'beginner'].includes(experience)) {
    scores['Stress-Free Owner'] += 2
    scores['Practical City Commuter'] += 1
  }
  if (experience === 'enthusiast') scores['Enthusiast Driver'] += 3

  if (['bad-roads', 'rural'].includes(roadConditions)) scores['Family Comfort Buyer'] += 1
  if (roadConditions === 'heavy-traffic') scores['Practical City Commuter'] += 2
  if (roadConditions === 'highway-heavy') { scores['Enthusiast Driver'] += 1; scores['Premium Aspirer'] += 1 }

  const p = Array.isArray(priorities) ? priorities : []
  if (p.includes('mileage') || p.includes('low-maintenance')) {
    scores['Practical City Commuter'] += 2
    scores['Stress-Free Owner'] += 2
  }
  if (p.includes('premium') || p.includes('features')) scores['Premium Aspirer'] += 2
  if (p.includes('performance')) scores['Enthusiast Driver'] += 2
  if (p.includes('comfort') || p.includes('safety')) scores['Family Comfort Buyer'] += 1
  if (p.includes('resale')) { scores['Stress-Free Owner'] += 1; scores['Premium Aspirer'] += 1 }

  if (ownership === 'stress-free') scores['Stress-Free Owner'] += 3
  if (ownership === 'premium-feel') scores['Premium Aspirer'] += 3
  if (ownership === 'fun-to-drive') scores['Enthusiast Driver'] += 3
  if (ownership === 'family-comfort') scores['Family Comfort Buyer'] += 3
  if (ownership === 'rugged') { scores['Enthusiast Driver'] += 1; scores['Family Comfort Buyer'] += 1 }
  if (ownership === 'attention') scores['Premium Aspirer'] += 2

  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
  return PERSONAS[winner]
}

module.exports = { identifyPersona }
```

- [ ] **Step 2: Smoke-test the module**

```powershell
node -e "
const { identifyPersona } = require('./server/utils/personaEngine');
const a = { budget: '7l-10l', usage: 'office-commute', travelers: 'alone', experience: 'beginner', roadConditions: 'heavy-traffic', priorities: ['mileage','low-maintenance','safety'], ownership: 'stress-free' };
console.log(identifyPersona(a).title);
"
```
Expected output: `Practical City Commuter` or `Stress-Free Owner` (either is correct for this input).

- [ ] **Step 3: Commit**

```powershell
git add server/utils/personaEngine.js
git commit -m "feat: add persona identification engine"
```

---

### Task 3: Create scoringEngine.js

**Files:**
- Create: `server/utils/scoringEngine.js`

Exports `generateRecommendations(cars, answers)` → returns top 3 cars sorted by weighted score.

- [ ] **Step 1: Create server/utils/scoringEngine.js**

```js
const BUDGET_MAP = {
  'under-7l':  [0, 700000],
  '7l-10l':    [700000, 1000000],
  '10l-15l':   [1000000, 1500000],
  '15l-25l':   [1500000, 2500000],
  '25l-plus':  [2500000, Infinity],
}

const SCORE_DIMS = [
  'safetyScore', 'mileageScore', 'maintenanceScore', 'comfortScore',
  'performanceScore', 'cityDrivingScore', 'highwayScore', 'familyScore',
  'beginnerFriendlyScore', 'resaleScore', 'premiumScore',
  'badRoadScore', 'trafficFriendlyScore', 'serviceNetworkScore',
]

function filterByBudget(cars, budget) {
  const range = BUDGET_MAP[budget]
  if (!range) return cars
  const [min, max] = range
  const filtered = cars.filter(c => c.priceMin <= max * 1.1 && c.priceMax >= min * 0.8)
  return filtered.length >= 3 ? filtered : cars
}

function buildWeights(answers) {
  const w = Object.fromEntries(SCORE_DIMS.map(d => [d, 1]))

  const { usage, travelers, experience, roadConditions, priorities, ownership } = answers
  const p = Array.isArray(priorities) ? priorities : []

  if (['office-commute', 'city'].includes(usage)) {
    w.trafficFriendlyScore += 2; w.mileageScore += 1.5; w.cityDrivingScore += 2
  }
  if (usage === 'highway') { w.highwayScore += 2; w.comfortScore += 1 }
  if (['family', 'mixed'].includes(usage)) { w.familyScore += 1.5; w.comfortScore += 1 }

  if (['large-family'].includes(travelers)) { w.familyScore += 2; w.comfortScore += 1 }
  if (travelers === 'parents') { w.comfortScore += 2; w.badRoadScore += 1 }
  if (travelers === 'kids') { w.safetyScore += 2; w.familyScore += 1.5 }

  if (['first-time', 'beginner'].includes(experience)) {
    w.beginnerFriendlyScore += 2.5; w.serviceNetworkScore += 1.5; w.maintenanceScore += 1.5
  }
  if (experience === 'enthusiast') w.performanceScore += 2

  if (['bad-roads', 'rural'].includes(roadConditions)) w.badRoadScore += 2.5
  if (roadConditions === 'heavy-traffic') { w.trafficFriendlyScore += 2; w.mileageScore += 1.5 }
  if (roadConditions === 'highway-heavy') w.highwayScore += 2

  const priorityMap = {
    safety: 'safetyScore', mileage: 'mileageScore',
    'low-maintenance': 'maintenanceScore', comfort: 'comfortScore',
    performance: 'performanceScore', features: 'premiumScore',
    resale: 'resaleScore', premium: 'premiumScore',
  }
  p.forEach(pr => { if (priorityMap[pr]) w[priorityMap[pr]] += 2 })

  if (ownership === 'stress-free') { w.maintenanceScore += 1.5; w.serviceNetworkScore += 2; w.beginnerFriendlyScore += 1 }
  if (ownership === 'premium-feel') { w.premiumScore += 2; w.comfortScore += 1 }
  if (ownership === 'fun-to-drive') w.performanceScore += 2
  if (ownership === 'family-comfort') { w.familyScore += 2; w.comfortScore += 1.5 }
  if (ownership === 'rugged') w.badRoadScore += 2
  if (ownership === 'attention') { w.premiumScore += 1.5; w.performanceScore += 1 }

  return w
}

function calculateCarScore(car, weights) {
  let total = 0
  let maxPossible = 0
  for (const dim of SCORE_DIMS) {
    const weight = weights[dim] || 1
    total += (car[dim] || 0) * weight
    maxPossible += 10 * weight
  }
  return Math.round((total / maxPossible) * 100)
}

function generateRecommendations(cars, answers) {
  const budgetFiltered = filterByBudget(cars, answers.budget)
  const weights = buildWeights(answers)

  const scored = budgetFiltered.map(car => ({
    car,
    score: calculateCarScore(car, weights),
  }))

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 3)
}

module.exports = { generateRecommendations, buildWeights, SCORE_DIMS }
```

- [ ] **Step 2: Smoke-test**

```powershell
node -e "
const cars = require('./server/data/cars.json');
const { generateRecommendations } = require('./server/utils/scoringEngine');
const answers = { budget: '7l-10l', usage: 'office-commute', travelers: 'alone', experience: 'beginner', roadConditions: 'heavy-traffic', priorities: ['mileage','low-maintenance','safety'], ownership: 'stress-free' };
const results = generateRecommendations(cars, answers);
results.forEach(r => console.log(r.car.name, '->', r.score));
"
```
Expected: 3 cars printed with scores like `Maruti Suzuki Swift -> 82`.

- [ ] **Step 3: Commit**

```powershell
git add server/utils/scoringEngine.js
git commit -m "feat: add weighted car scoring engine"
```

---

### Task 4: Create explanationEngine.js

**Files:**
- Create: `server/utils/explanationEngine.js`

Translates numeric scores into plain human language for the UI. Exports `generateExplanation(car, answers, weights)` returning `{ whyItFits, strengths, tradeoffs }`.

- [ ] **Step 1: Create server/utils/explanationEngine.js**

```js
const DIM_COPY = {
  safetyScore: {
    high: 'Outstanding safety credentials — gives real peace of mind on every journey.',
    low: 'Safety ratings are below average; a trade-off worth knowing before you decide.',
  },
  mileageScore: {
    high: 'Excellent fuel efficiency keeps your running costs very predictable.',
    low: 'Fuel costs can add up quickly, especially in city traffic.',
  },
  maintenanceScore: {
    high: 'Servicing is affordable and workshops are widely available.',
    low: 'Maintenance costs run higher than average — budget for that annually.',
  },
  comfortScore: {
    high: 'Cabin remains quiet and comfortable, even on long drives.',
    low: 'Rear seat space is a bit snug for taller or older passengers.',
  },
  performanceScore: {
    high: 'Punchy engine makes overtaking and highway driving effortless.',
    low: 'Engine is tuned for efficiency over excitement — not a sporty drive.',
  },
  cityDrivingScore: {
    high: 'Easy to park and manoeuvre in tight city spaces.',
    low: 'Its larger size can feel unwieldy in congested urban streets.',
  },
  highwayScore: {
    high: 'Cruises effortlessly on highways with no engine strain at speed.',
    low: 'Prefers city speeds; long highway stretches can feel taxing.',
  },
  familyScore: {
    high: 'Spacious enough for the whole family — nobody feels cramped.',
    low: 'Tight for a group; best suited for couples or solo drivers.',
  },
  beginnerFriendlyScore: {
    high: 'Very easy to drive — forgiving and confidence-inspiring for new drivers.',
    low: 'Requires experience; its size or power can be a handful at first.',
  },
  resaleScore: {
    high: 'Holds its value exceptionally well — a smart long-term financial choice.',
    low: 'Resale market is still maturing for this model.',
  },
  premiumScore: {
    high: 'Premium interiors and features that punch well above its price.',
    low: 'Interior is functional rather than luxurious — utility over style.',
  },
  badRoadScore: {
    high: 'Handles potholes and rough roads without drama.',
    low: 'Low ground clearance makes bad roads and potholes a real concern.',
  },
  trafficFriendlyScore: {
    high: 'A natural in stop-and-go traffic — stress-free city commuting.',
    low: 'Can feel tiring in heavy traffic due to its size.',
  },
  serviceNetworkScore: {
    high: 'Service centres available in almost every city and town across India.',
    low: 'Service network is thinner in smaller towns — plan ahead.',
  },
}

function generateWhyItFits(car, answers) {
  const p = Array.isArray(answers.priorities) ? answers.priorities : []
  const lines = []

  if (p.includes('mileage') && car.mileageScore >= 7) lines.push('excellent fuel efficiency for your daily routine')
  if (p.includes('safety') && car.safetyScore >= 8) lines.push('the strong safety record you prioritised')
  if (p.includes('low-maintenance') && car.maintenanceScore >= 7) lines.push('low running and servicing costs')
  if (p.includes('comfort') && car.comfortScore >= 7) lines.push('a comfortable cabin for your passengers')
  if (p.includes('performance') && car.performanceScore >= 7) lines.push('a spirited, engaging drive')
  if (p.includes('resale') && car.resaleScore >= 7) lines.push('strong resale value down the line')
  if (p.includes('premium') && car.premiumScore >= 7) lines.push('the premium feel you are looking for')

  if (['first-time', 'beginner'].includes(answers.experience) && car.beginnerFriendlyScore >= 7) {
    lines.push('easy handling that builds driver confidence quickly')
  }
  if (answers.travelers === 'large-family' && car.familyScore >= 8) {
    lines.push('enough room for the whole family')
  }
  if (['bad-roads', 'rural'].includes(answers.roadConditions) && car.badRoadScore >= 7) {
    lines.push('good ground clearance for the roads you drive on')
  }
  if (answers.roadConditions === 'heavy-traffic' && car.trafficFriendlyScore >= 7) {
    lines.push('compact size that makes city traffic much less stressful')
  }

  if (lines.length === 0) {
    return 'Scores consistently across all the priorities you care about — a well-rounded choice for your lifestyle.'
  }

  if (lines.length === 1) return `Delivers ${lines[0]}.`
  const last = lines.pop()
  return `Delivers ${lines.join(', ')} — and ${last}.`
}

function generateStrengths(car, weights) {
  const scored = Object.keys(DIM_COPY)
    .map(d => ({ dim: d, value: (car[d] || 0) * (weights[d] || 1) }))
    .sort((a, b) => b.value - a.value)

  return scored
    .filter(s => car[s.dim] >= 7)
    .slice(0, 3)
    .map(s => DIM_COPY[s.dim].high)
}

function generateTradeoffs(car) {
  const all = Object.keys(DIM_COPY)
    .map(d => ({ dim: d, value: car[d] || 0 }))
    .sort((a, b) => a.value - b.value)

  return all
    .filter(t => car[t.dim] <= 5)
    .slice(0, 2)
    .map(t => DIM_COPY[t.dim].low)
}

function generateExplanation(car, answers, weights) {
  return {
    whyItFits: generateWhyItFits(car, answers),
    strengths: generateStrengths(car, weights),
    tradeoffs: generateTradeoffs(car),
  }
}

module.exports = { generateExplanation }
```

- [ ] **Step 2: Smoke-test**

```powershell
node -e "
const cars = require('./server/data/cars.json');
const { generateExplanation } = require('./server/utils/explanationEngine');
const { buildWeights } = require('./server/utils/scoringEngine');
const answers = { budget: '7l-10l', usage: 'city', travelers: 'couple', experience: 'beginner', roadConditions: 'heavy-traffic', priorities: ['mileage','safety','low-maintenance'], ownership: 'stress-free' };
const swift = cars.find(c => c.id === 'maruti-swift');
const weights = buildWeights(answers);
const exp = generateExplanation(swift, answers, weights);
console.log('Why:', exp.whyItFits);
console.log('Strengths:', exp.strengths.length);
console.log('Tradeoffs:', exp.tradeoffs);
"
```
Expected: Why and Strengths printed without errors.

- [ ] **Step 3: Commit**

```powershell
git add server/utils/explanationEngine.js
git commit -m "feat: add plain-language explanation engine"
```

---

### Task 5: Create POST /api/recommendations and register it

**Files:**
- Create: `server/routes/recommendations.js`
- Modify: `server/index.js` (add 1 line)

- [ ] **Step 1: Create server/routes/recommendations.js**

```js
const express = require('express')
const router = express.Router()
const cars = require('../data/cars.json')
const { identifyPersona } = require('../utils/personaEngine')
const { generateRecommendations, buildWeights } = require('../utils/scoringEngine')
const { generateExplanation } = require('../utils/explanationEngine')
const { sendSuccess, sendError } = require('../utils/response')

const COMPARISON_DIMENSIONS = [
  { key: 'safetyScore',          label: 'Safety' },
  { key: 'mileageScore',         label: 'Mileage' },
  { key: 'comfortScore',         label: 'Comfort' },
  { key: 'maintenanceScore',     label: 'Maintenance' },
  { key: 'cityDrivingScore',     label: 'City Usability' },
  { key: 'highwayScore',         label: 'Highway' },
  { key: 'familyScore',          label: 'Family Friendly' },
  { key: 'premiumScore',         label: 'Features & Finish' },
  { key: 'serviceNetworkScore',  label: 'Ownership Ease' },
]

router.post('/', (req, res) => {
  const answers = req.body
  if (!answers || !answers.budget) {
    return sendError(res, 'Missing required field: budget', 400)
  }

  const persona = identifyPersona(answers)
  const weights = buildWeights(answers)
  const topScored = generateRecommendations(cars, answers)

  const recommendations = topScored.map(({ car, score }) => ({
    car,
    score,
    matchPercent: Math.min(score, 99),
    ...generateExplanation(car, answers, weights),
  }))

  const comparisonData = {
    dimensions: COMPARISON_DIMENSIONS,
    cars: recommendations.map(r => ({
      name: r.car.name,
      scores: Object.fromEntries(
        COMPARISON_DIMENSIONS.map(d => [d.key, r.car[d.key] || 0])
      ),
    })),
  }

  sendSuccess(res, { persona, recommendations, comparisonData }, 'Recommendations generated')
})

module.exports = router
```

- [ ] **Step 2: Register the route in server/index.js**

In `server/index.js`, add after line 4 (`const carsRouter = require('./routes/cars')`):

```js
const recommendationsRouter = require('./routes/recommendations')
```

And after line 16 (`app.use('/api/cars', carsRouter)`):

```js
app.use('/api/recommendations', recommendationsRouter)
```

The full updated `server/index.js`:

```js
const express = require('express')
const cors = require('cors')

const carsRouter = require('./routes/cars')
const recommendationsRouter = require('./routes/recommendations')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/cars', carsRouter)
app.use('/api/recommendations', recommendationsRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

module.exports = app
```

- [ ] **Step 3: Start the server and test the endpoint**

Start server in one terminal:
```powershell
node server/index.js
```

In another terminal, test (PowerShell):
```powershell
$body = '{"budget":"7l-10l","usage":"office-commute","travelers":"alone","experience":"beginner","roadConditions":"heavy-traffic","priorities":["mileage","low-maintenance","safety"],"ownership":"stress-free"}'
Invoke-RestMethod -Method Post -Uri "http://localhost:3001/api/recommendations" -ContentType "application/json" -Body $body | ConvertTo-Json -Depth 5
```

Expected: JSON with `success: true`, `data.persona.title`, `data.recommendations` array of 3, `data.comparisonData`.

Stop the test server after verifying.

- [ ] **Step 4: Commit**

```powershell
git add server/routes/recommendations.js server/index.js
git commit -m "feat: add POST /api/recommendations endpoint"
```

---

### Task 6: Create useRecommendations hook

**Files:**
- Create: `src/hooks/useRecommendations.js`

Fetches recommendations from the API once on mount. Returns `{ data, loading, error }`.

- [ ] **Step 1: Create src/hooks/useRecommendations.js**

```js
import { useState, useEffect } from 'react'

export function useRecommendations(answers) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    })
      .then(r => r.json())
      .then(json => {
        if (!json.success) throw new Error(json.message || 'Request failed')
        setData(json.data)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error }
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/hooks/useRecommendations.js
git commit -m "feat: add useRecommendations data-fetch hook"
```

---

### Task 7: Create PersonaBadge component

**Files:**
- Create: `src/components/recommendations/PersonaBadge.jsx`

Displays the buyer persona: icon, title, description, and 3 priority chips.

- [ ] **Step 1: Create src/components/recommendations/PersonaBadge.jsx**

```jsx
const PERSONA_ICONS = {
  'Practical City Commuter': '🏙️',
  'Family Comfort Buyer': '👨‍👩‍👧',
  'Premium Aspirer': '✨',
  'Enthusiast Driver': '🏎️',
  'Stress-Free Owner': '😌',
}

export default function PersonaBadge({ persona }) {
  const icon = PERSONA_ICONS[persona.title] || '🚗'

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-3xl flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-0.5">
            Your Buyer Profile
          </p>
          <h2 className="text-xl font-bold text-neutral-900">{persona.title}</h2>
        </div>
      </div>
      <p className="text-neutral-600 text-sm leading-relaxed mb-4">{persona.description}</p>
      <div className="flex flex-wrap gap-2">
        {persona.topPriorities.map(priority => (
          <span
            key={priority}
            className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100"
          >
            {priority}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/recommendations/PersonaBadge.jsx
git commit -m "feat: add PersonaBadge component"
```

---

### Task 8: Create RecommendationCard component

**Files:**
- Create: `src/components/recommendations/RecommendationCard.jsx`

Shows a single car recommendation: image with fallback, match %, why it fits, 3 strengths, tradeoffs, price range, and a "Best Match" badge for rank 0.

- [ ] **Step 1: Create src/components/recommendations/RecommendationCard.jsx**

```jsx
import { useState } from 'react'

function CarImage({ src, name }) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div className="w-full h-44 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center rounded-t-2xl">
        <span className="text-5xl">🚗</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      className="w-full h-44 object-cover rounded-t-2xl"
      onError={() => setFailed(true)}
    />
  )
}

export default function RecommendationCard({ recommendation, rank }) {
  const { car, matchPercent, whyItFits, strengths, tradeoffs } = recommendation
  const isBestMatch = rank === 0

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden ${isBestMatch ? 'border-primary-400 shadow-md' : 'border-neutral-200'}`}>
      <div className="relative">
        <CarImage src={car.imageUrl} name={car.name} />
        {isBestMatch && (
          <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            Best Match
          </span>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-primary-700 text-sm font-bold px-3 py-1 rounded-full border border-primary-200">
          {matchPercent}% match
        </div>
      </div>

      <div className="p-5">
        <div className="mb-1">
          <span className="text-xs text-neutral-500 font-medium">{car.brand} · {car.bodyType}</span>
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-1">{car.name}</h3>
        <p className="text-sm font-semibold text-primary-600 mb-3">{car.priceRange}</p>

        <div className="bg-primary-50 rounded-xl p-3 mb-4">
          <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-1">Why this fits you</p>
          <p className="text-sm text-neutral-700 leading-relaxed">{whyItFits}</p>
        </div>

        {strengths.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Key strengths</p>
            <ul className="space-y-1.5">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tradeoffs.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Worth noting</p>
            <ul className="space-y-1.5">
              {tradeoffs.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-500">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">◦</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/recommendations/RecommendationCard.jsx
git commit -m "feat: add RecommendationCard component"
```

---

### Task 9: Create ComparisonTable component

**Files:**
- Create: `src/components/recommendations/ComparisonTable.jsx`

Renders a 9-dimension × up-to-3 car comparison table. Each cell is a labelled progress bar (score × 10 = percentage width).

- [ ] **Step 1: Create src/components/recommendations/ComparisonTable.jsx**

```jsx
function ScoreBar({ score, highlight }) {
  const pct = Math.min(Math.round((score / 10) * 100), 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-neutral-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${highlight ? 'bg-primary-500' : 'bg-neutral-300'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-semibold w-4 text-right ${highlight ? 'text-primary-600' : 'text-neutral-500'}`}>
        {score}
      </span>
    </div>
  )
}

export default function ComparisonTable({ comparisonData }) {
  const { dimensions, cars } = comparisonData

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-100">
        <h3 className="text-base font-bold text-neutral-900">How they compare</h3>
        <p className="text-xs text-neutral-500 mt-0.5">Scores out of 10</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="bg-neutral-50">
              <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide px-5 py-3 w-32">
                Category
              </th>
              {cars.map((c, i) => (
                <th
                  key={i}
                  className={`text-left text-xs font-semibold uppercase tracking-wide px-4 py-3 ${i === 0 ? 'text-primary-600' : 'text-neutral-500'}`}
                >
                  {i === 0 && <span className="block text-primary-400 text-[10px] font-normal normal-case mb-0.5">Best match</span>}
                  {c.name.replace(/^Maruti Suzuki /, 'M. Suzuki ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dim, di) => (
              <tr key={dim.key} className={di % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}>
                <td className="px-5 py-3 text-sm text-neutral-700 font-medium whitespace-nowrap">
                  {dim.label}
                </td>
                {cars.map((c, ci) => (
                  <td key={ci} className="px-4 py-3 min-w-[120px]">
                    <ScoreBar score={c.scores[dim.key] || 0} highlight={ci === 0} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/recommendations/ComparisonTable.jsx
git commit -m "feat: add ComparisonTable component"
```

---

### Task 10: Implement RecommendationsPage

**Files:**
- Replace: `src/pages/RecommendationsPage.jsx`

Replaces the current placeholder with the full page. Guards against missing answers (redirects to /advisor). Shows loading skeleton, error state with retry, and the full recommendation layout when loaded.

- [ ] **Step 1: Replace src/pages/RecommendationsPage.jsx**

```jsx
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useOnboarding } from '../hooks/useOnboarding'
import { useRecommendations } from '../hooks/useRecommendations'
import PersonaBadge from '../components/recommendations/PersonaBadge'
import RecommendationCard from '../components/recommendations/RecommendationCard'
import ComparisonTable from '../components/recommendations/ComparisonTable'

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-36 bg-neutral-200 rounded-2xl" />
      <div className="h-5 bg-neutral-200 rounded w-40" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map(i => <div key={i} className="h-96 bg-neutral-200 rounded-2xl" />)}
      </div>
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-16">
      <p className="text-4xl mb-4">⚠️</p>
      <h2 className="text-lg font-bold text-neutral-800 mb-2">Something went wrong</h2>
      <p className="text-sm text-neutral-500 mb-6">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="px-6 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-full hover:bg-primary-700 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}

export default function RecommendationsPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useOnboarding()
  const { answers } = state

  const answersComplete = answers.budget && answers.usage && answers.ownership &&
    Array.isArray(answers.priorities) && answers.priorities.length >= 3

  useEffect(() => {
    if (!answersComplete) navigate('/advisor', { replace: true })
  }, [answersComplete, navigate])

  const { data, loading, error } = useRecommendations(answers)

  if (!answersComplete) return null

  const handleStartOver = () => {
    dispatch({ type: 'RESET' })
    navigate('/advisor')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">
            Your personalised results
          </p>
          <h1 className="text-2xl font-bold text-neutral-900">Here are your top car matches</h1>
        </div>

        {loading && <LoadingSkeleton />}
        {error && <ErrorState message={error} onRetry={() => window.location.reload()} />}

        {data && (
          <>
            <PersonaBadge persona={data.persona} />

            <h2 className="text-base font-bold text-neutral-800 mb-4">Your top picks</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
              {data.recommendations.map((rec, i) => (
                <RecommendationCard key={rec.car.id} recommendation={rec} rank={i} />
              ))}
            </div>

            <div className="mb-10">
              <ComparisonTable comparisonData={data.comparisonData} />
            </div>

            <div className="text-center py-4">
              <p className="text-sm text-neutral-500 mb-3">Want to explore different options?</p>
              <button
                type="button"
                onClick={handleStartOver}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 underline underline-offset-2 transition-colors"
              >
                ← Start over with new answers
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/pages/RecommendationsPage.jsx
git commit -m "feat: implement full RecommendationsPage with persona, cards, comparison"
```

---

### Task 11: End-to-end verification

**Files:** (no new files — read-only verification)

- [ ] **Step 1: Start both servers**

```powershell
npm run start
```

- [ ] **Step 2: Navigate the full flow**

Open `http://localhost:5173/advisor` in a browser. Complete all 7 steps (any answers). Verify:
1. After step 7, page navigates to `/recommendations`
2. Loading skeleton appears briefly
3. Persona badge appears with title, description, and 3 priority chips
4. Three recommendation cards appear with: car name, price range, match %, why-it-fits text, ≥1 strength, ≤2 tradeoffs
5. Comparison table appears with 9 rows and up to 3 car columns
6. Progress bars in table are filled proportionally
7. First card has "Best Match" badge
8. "Start over" button resets the form and returns to `/advisor`

- [ ] **Step 3: Test edge case — direct navigation to /recommendations**

Navigate directly to `http://localhost:5173/recommendations` in a fresh tab (no form completed). Verify it redirects to `/advisor` immediately.

- [ ] **Step 4: Test different answer sets**

Run two different answer combinations through the form and verify different cars appear in results (scoring engine responds to different inputs).

- [ ] **Step 5: Commit if any fixes needed, then tag the feature complete**

```powershell
git add -A
git commit -m "chore: recommendations engine complete and verified"
```
