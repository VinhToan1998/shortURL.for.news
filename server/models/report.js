const mongoose = require('./db');
const { Types, Schema } = require('mongoose')

const NewsSchema = new Schema({
   name: { type: String },
   email: { type: String, index: true },
   reason: { type: String, required: true },
   otherReason: String,
   user: { type: Types.ObjectId, ref: 'User', index: true },
   link: { type: Types.ObjectId, ref: 'ShortLink', required: true, index: true },
 })

 module.exports = mongoose.model('Report', NewsSchema)