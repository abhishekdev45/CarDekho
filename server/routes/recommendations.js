const express = require('express')
const router = express.Router()
const cars = require('../data/cars.json')
const { recommendationsController } = require('../controllers/recommendationsController')



router.post('/',recommendationsController)

module.exports = router
