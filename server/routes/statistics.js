const express = require('express')
const router = express.Router()
const axios = require('axios')
const cheerio = require('cheerio')
const shortid = require('shortid')
const Category = require('../models/category')
const Shortlink = require('../models/shortlink')
const Report = require('../models/report')
const Statistic = require('../models/statistics')

function adminMiddleWare(req, rep, next) {
  const { user } = req.session || {}
  if (!user)
    return rep.status(401).send({ message: 'Login to continue' })
  if (!user.isAdmin)
    return rep.status(403).send({ message: 'Admin required' })
  next()
}

router.get('/:linkId', async (req, rep) => {
  const { linkId } = req.params || {}
  const link = await Shortlink.findOne({ linkId })
  if(!link)
    return rep.status(404).send({ message: 'Link not exists' })
  const items = await Statistic.aggregate([
    {
      $match: { link: link._id }
    },
    {
      $group: {
        _id: {
          link: '$link',
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
        },
        count: { $sum: 1 },
      }
    },{ $sort: { '_id.date': -1 } }
  ])
  rep.send({ items })
})

module.exports = router