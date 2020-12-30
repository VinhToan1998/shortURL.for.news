const express = require('express')
const router = express.Router()
const axios = require('axios')
const cheerio = require('cheerio')
const shortid = require('shortid')
const Category = require('../models/category')
const Shortlink = require('../models/shortlink')
const Report = require('../models/report')

function adminMiddleWare(req, rep, next) {
  const { user } = req.session || {}
  if (!user)
    return rep.status(401).send({ message: 'Login to continue' })
  if (!user.isAdmin)
    return rep.status(403).send({ message: 'Admin required' })
  next()
}

router.get('/list/:linkId', adminMiddleWare, async (req, rep) => {
  const { linkId } = req.params || {}
  if(!linkId)
    return rep.status(400).end()
  const items = await Report.find({ link: linkId }, '-__v').populate('user', 'name username email')
  rep.send({ items })
})

router.get('/list', adminMiddleWare, async (req, rep) => {
  const categories = await Category.find({}, '-__v')
  // const items = await Report.find({}, '-__v').populate('link', '-__v').populate('user', 'name username email')
  const items = await Report.aggregate([
    {
      $group: { _id: '$link', reportCount: { $sum: 1 } }
    }, {
      $lookup: { from: 'shortlinks', localField: '_id', foreignField: '_id', as: 'link' }
    },
    { $unwind: '$link' }
  ])
  rep.send({ items, categories })
})

router.delete('/:_id', async (req, rep) => {
  const { _id } = req.params || {}
  if( _id ) {
    await Report.remove({ _id })
    rep.send({ message: 'Deleted'})
  } else {
    rep.status(400).send({ message: 'Nothing do delete' })
  }
})

router.post('/', async (req, rep) => {
  const { name, email, id: link, reason, otherReason } = req.body || {}
  const { userId, isAdmin } = req.session.user || {}

  // Logic check
  if(isAdmin)
    return rep.status(400).send({ message: 'Admin wont do this ;)' })
  // If user not logged in and there is no name, email input
  if(!userId && (!name || !email)) {
    return rep.status(400).send({ message: 'Bad request' })
  }

  try {
    await Report.create({ name, user: userId, email, link, reason, otherReason })
    rep.send({ message: 'Reported' })
  } catch(err) {
    if (err.code === 11000)
      return rep.status(400).send({ message: 'Report already exists' })
    rep.status(400).send({ message: 'An error occured' })
  }
  console.log(name)
})

module.exports = router