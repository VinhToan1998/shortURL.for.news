const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Shortlink = require('../models/shortlink')

router.get('/list', async (req, rep) => {
  const items = await Category.find({})
  rep.send({ items })
})

router.delete('/:_id', async (req, rep) => {
  const { _id } = req.params || {}
  if( _id ) {
    await Category.remove({ _id })
    rep.send({ message: 'Deleted'})
  } else {
    rep.status(400).send({ message: 'Nothing do delete' })
  }
})

router.post('/create', async (req, rep) => {
  const { name } = req.body || {}
  try {
    const status = await Category.create({ name })
    rep.send({ message: 'Category created' })
  } catch(err) {
    if (err.code === 11000)
      return rep.status(400).send({ message: 'Category already exists' })
    rep.status(400).send({ message: 'An error occured' })
  }

})

router.get('/:slug', async (req, rep) => {
  const { slug } = req.params || {}
  console.log(slug)
  try {
    const category = await Category.findOne({ slug })
    if(!category._id)
      return rep.status(404).send({ message: 'Category not exists' })
    const links = await Shortlink.find({ category: category._id }, '-_id -__v')
    rep.send({ category: { name: category.name }, links })
  } catch(err) {
    rep.status(500).send({ message: 'Something went wrong' })
  }
})

module.exports = router
