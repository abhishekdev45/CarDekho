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
  if (!answers || typeof answers !== 'object') throw new Error('buildWeights: answers must be an object')
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
function diversifyRecommendations(scoredCars, count = 3) {
  const selected = [];
  const usedBodyTypes = new Set();
  const overflow = [];

  // First pass: one car per body type, highest-scored first (list is pre-sorted)
  for (const item of scoredCars) {
    const bodyType = (item.car.bodyType || '').toLowerCase();
    if (!usedBodyTypes.has(bodyType)) {
      selected.push(item);
      usedBodyTypes.add(bodyType);
      if (selected.length === count) return selected;
    } else {
      overflow.push(item);
    }
  }

  // Fill remaining slots with next best scorers when body types run out
  for (const item of overflow) {
    selected.push(item);
    if (selected.length === count) break;
  }

  return selected;
}

function generateRecommendations(cars, answers, weights = {}) {
  if (!Array.isArray(cars)) throw new Error('generateRecommendations: cars must be an array')
  if (!answers || typeof answers !== 'object') throw new Error('generateRecommendations: answers must be an object')
  const budgetFiltered = filterByBudget(cars, answers.budget)
  if (!Object.keys(weights).length) weights = buildWeights(answers)

  const scored = budgetFiltered.map(car => ({
    car,
    score: calculateCarScore(car, weights),
  }))

  scored.sort((a, b) => b.score - a.score)
  return diversifyRecommendations(scored, 3)
}

module.exports = { generateRecommendations, buildWeights, SCORE_DIMS }
