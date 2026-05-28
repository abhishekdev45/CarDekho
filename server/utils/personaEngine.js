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
