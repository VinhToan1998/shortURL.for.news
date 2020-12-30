const mongoose = require('./db');
const { Types, Schema } = require('mongoose')
const kebabCase = require('lodash.kebabcase')

const CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, index:true, unique: true }
})

CategorySchema.pre('save', function(next) {
  var category = this;

  if (!category.isModified('name')) return next();

  category.slug = kebabCase(category.name)
  next()
}) 

module.exports = mongoose.model('Category', CategorySchema)
