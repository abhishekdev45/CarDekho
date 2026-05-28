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
