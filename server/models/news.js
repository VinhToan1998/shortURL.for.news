const mongoose = require('./db');
const { Types, Schema } = require('mongoose')

const NewsSchema = new Schema({
   linkId: { type: String, required: true, unique: true, index: true },
   user: { type: Types.ObjectId, ref: 'User', index: true },
   view: { type: Number, require: true },
   category: { type: String, require: true, unique: true, index: true }
})

module.exports = mongoose.model('News', NewsSchema)