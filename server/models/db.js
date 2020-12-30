const mongoose = require('mongoose')
const DB_NAME = process.env.DATABASE_NAME || 'shortlinks'
mongoose.connect('mongodb://localhost/' + DB_NAME, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
})

module.exports = mongoose