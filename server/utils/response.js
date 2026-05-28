const sendSuccess = (res, data, message = 'Success') => {
  res.json({ success: true, message, data })
}

const sendError = (res, message = 'Internal server error', status = 500) => {
  res.status(status).json({ success: false, message, data: null })
}

module.exports = { sendSuccess, sendError }
