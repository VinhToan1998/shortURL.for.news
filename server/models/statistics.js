const mongoose = require('./db');
const { Types, Schema } = require('mongoose')

const StatisticSchema = new Schema({
  date: { type: Date, default: Date.now()},
  link: { type: Types.ObjectId, ref: 'ShortLink', required: true, index: true },
  ip: { type: String },
})

module.exports = mongoose.model('Statistic', StatisticSchema)