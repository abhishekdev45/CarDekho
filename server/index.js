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
