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

const recommendationsController = (req, res) => {
  const answers = req.body
  if (!answers || !answers.budget) {
    return sendError(res, 'Missing required field: budget', 400)
  }

  const persona = identifyPersona(answers)
  const weights = buildWeights(answers)
  const topScored = generateRecommendations(cars, answers, weights)

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
}

module.exports = {recommendationsController};
