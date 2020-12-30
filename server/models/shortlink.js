const mongoose = require('./db');
const { Types, Schema } = require('mongoose')

const ShortLinkSchema = new Schema({
  linkId: { type: String, required: true, unique: true, index: true },
  category: { type: Types.ObjectId, ref: 'Category', index: true },
  user: { type: Types.ObjectId, ref: 'User', index: true },
  src: { type: String, required: true },
  title: String,
  description: String,
  image: String,
  impression: { type: Number, default: 0 }
})

module.exports = mongoose.model('ShortLink', ShortLinkSchema)
