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

const W = { STRONG: 3, MODERATE: 2, WEAK: 1 }

function identifyPersona(answers) {
  if (!answers || typeof answers !== 'object') {
    throw new Error('identifyPersona requires a valid answers object')
  }

  const scores = Object.keys(PERSONAS).reduce((acc, k) => { acc[k] = 0; return acc }, {})

  const { budget, usage, travelers, experience, roadConditions, priorities, ownership } = answers

  if (['under-7l', '7l-10l'].includes(budget)) {
    scores['Practical City Commuter'] += W.MODERATE
    scores['Stress-Free Owner'] += W.WEAK
  }
  if (['10l-15l'].includes(budget)) {
    scores['Practical City Commuter'] += W.WEAK
    scores['Family Comfort Buyer'] += W.WEAK
    scores['Premium Aspirer'] += W.WEAK
  }
  if (['15l-25l', '25l-plus'].includes(budget)) {
    scores['Premium Aspirer'] += W.STRONG
    scores['Enthusiast Driver'] += W.WEAK
    scores['Family Comfort Buyer'] += W.WEAK
  }

  if (['office-commute', 'city'].includes(usage)) scores['Practical City Commuter'] += W.STRONG
  if (usage === 'family') scores['Family Comfort Buyer'] += W.STRONG
  if (usage === 'highway') { scores['Enthusiast Driver'] += W.MODERATE; scores['Premium Aspirer'] += W.WEAK }
  if (usage === 'weekend') { scores['Enthusiast Driver'] += W.WEAK; scores['Premium Aspirer'] += W.WEAK }
  if (usage === 'mixed') { scores['Practical City Commuter'] += W.WEAK; scores['Family Comfort Buyer'] += W.WEAK }

  if (['large-family', 'small-family'].includes(travelers)) scores['Family Comfort Buyer'] += W.MODERATE
  if (travelers === 'parents') { scores['Family Comfort Buyer'] += W.MODERATE; scores['Stress-Free Owner'] += W.WEAK }
  if (travelers === 'kids') { scores['Family Comfort Buyer'] += W.STRONG; scores['Stress-Free Owner'] += W.WEAK }
  if (travelers === 'couple') { scores['Premium Aspirer'] += W.WEAK; scores['Enthusiast Driver'] += W.WEAK }
  if (travelers === 'alone') { scores['Enthusiast Driver'] += W.WEAK; scores['Practical City Commuter'] += W.WEAK }

  if (['first-time', 'beginner'].includes(experience)) {
    scores['Stress-Free Owner'] += W.MODERATE
    scores['Practical City Commuter'] += W.WEAK
  }
  if (experience === 'enthusiast') scores['Enthusiast Driver'] += W.STRONG

  if (['bad-roads', 'rural'].includes(roadConditions)) scores['Family Comfort Buyer'] += W.WEAK
  if (roadConditions === 'heavy-traffic') scores['Practical City Commuter'] += W.MODERATE
  if (roadConditions === 'highway-heavy') { scores['Enthusiast Driver'] += W.WEAK; scores['Premium Aspirer'] += W.WEAK }

  const p = Array.isArray(priorities) ? priorities : []
  if (p.includes('mileage') || p.includes('low-maintenance')) {
    scores['Practical City Commuter'] += W.MODERATE
    scores['Stress-Free Owner'] += W.MODERATE
  }
  if (p.includes('premium') || p.includes('features')) scores['Premium Aspirer'] += W.MODERATE
  if (p.includes('performance')) scores['Enthusiast Driver'] += W.MODERATE
  if (p.includes('comfort') || p.includes('safety')) scores['Family Comfort Buyer'] += W.WEAK
  if (p.includes('resale')) { scores['Stress-Free Owner'] += W.WEAK; scores['Premium Aspirer'] += W.WEAK }

  if (ownership === 'stress-free') scores['Stress-Free Owner'] += W.STRONG
  if (ownership === 'premium-feel') scores['Premium Aspirer'] += W.STRONG
  if (ownership === 'fun-to-drive') scores['Enthusiast Driver'] += W.STRONG
  if (ownership === 'family-comfort') scores['Family Comfort Buyer'] += W.STRONG
  if (ownership === 'rugged') { scores['Enthusiast Driver'] += W.WEAK; scores['Family Comfort Buyer'] += W.WEAK }
  if (ownership === 'attention') scores['Premium Aspirer'] += W.MODERATE

  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
  return PERSONAS[winner]
}

module.exports = { identifyPersona }
