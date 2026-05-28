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
