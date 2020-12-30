const express = require('express')
const router = express.Router()
const axios = require('axios')
const cheerio = require('cheerio')
const shortid = require('shortid')
const Shortlink = require('../models/shortlink')
const Category = require('../models/category')
const Report = require('../models/report')
const Statistic = require('../models/statistics')

axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'

const siteCrawler = async function (url) {
  const { data } = await axios.get(url, { timeout: 5000 })
  const $ = cheerio.load(data)
  let title, description, image
  title = $('meta[property="og:title"]').attr('content')
  description = $('meta[property="og:description"]').attr('content')
  image = $('meta[property="og:image"]').attr('content')
  if(!title)
    title = $('title').text().trim()
  if(!description)
    description = $('meta[name="description"]').attr('content')
  return { title, description, image }
}

router.get('/list', async (req, rep) => {
  const isAdmin = req.session.user && req.session.user.isAdmin
  const { userId: user } = req.session.user || {}
  let links = []
  if (isAdmin) {
    links = await Shortlink.find({}, '-_id -__v').populate('user', '-password -_id -__v').populate('category', 'name')
  } else if(user) {
    links = await Shortlink.find({ user }, '-_id -__v').populate('category', 'name')
  }
  rep.send({ links })
})

router.post('/create', async (req, rep) => {
  const { src, category } = req.body
  const { user } = req.session || {}
  const { userId, username } = user || {}

  // Validation & logic check
  if(!username)
    return rep.status(401).send({ message: 'Please login to continue' })
  if(!category)
    return rep.status(400).send({ message: 'Please select a category' })
  if(!Category.findOne({ _id: category }))
    return rep.status(400).send({ message: 'Invalid category' })
  if (await Shortlink.findOne({ src, user: userId }))
    return rep.status(400).send({ message: 'Link already exists' })

  try {
    const linkId = shortid.generate()
    const { title, description, image } = await siteCrawler(src)
    await Shortlink.create({ linkId, user: userId, src, title, description, image, category })
    rep.send({ message: 'URL added successfully' })
  } catch (err) {
    console.log('CREATE LINK ERROR', err.message)
    rep.status(400).send({ message: 'URL invalid or not found'})
  }
})

router.get('/init', async (req, rep) => {
  const isAdmin = req.session.user && req.session.user.isAdmin
  const { userId: user } = req.session.user || {}
  let links = []
  if (isAdmin) {
    links = await Shortlink.find({}, '-__v').populate('user', '-password -_id -__v').populate('category', 'name')
  } else if(user) {
    links = await Shortlink.find({ user }, '-__v').populate('category', 'name')
  }
  const categories = await Category.find({}, '-__v')

  // Query statistic
  // const stats = await Statistic.aggregate([
  //   {
  //     $group: {
  //       _id: {
  //         link: '$link',
  //         date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
  //       },
  //       count: { $sum: 1 },
  //     }
  //   },{ $sort: { '_id.date': -1 } }
  // ])

  rep.send({ links, categories })
})

router.get('/home', async (req, rep) => {
  const isAdmin = req.session.user && req.session.user.isAdmin
  const { userId: user } = req.session.user || {}
  const categories = await Category.find({}, '-_id -__v')
  const links = (await Shortlink.find({}, '-__v').populate('category', 'name slug')).reverse()
  const popular = await Shortlink.find({}, '-__v').populate('category', 'name slug').sort({ impression: -1 }).limit(6)
  rep.send({ links, popular, categories })
})

router.delete('/:linkId', async (req, rep) => {
  const { linkId } = req.params || {}
  try {
  const link = await Shortlink.findOne({ _id: linkId })
  if(!link)
    return rep.status(404).send({ message: 'Not exists' })
  // Delete the link, also delete every report related to the link
  await link.remove()
  await Report.deleteMany({ link: link._id })
  rep.send({ message: 'Deleted' })
  } catch(err) {
    rep.status(400).send({ message: 'Something went wrong' })
  }
})

router.get('/:linkId', async (req, rep) => {
  const { visit } = req.query || {}
  const { linkId } = req.params || {}
  try {
    const link = await Shortlink.findOne({ linkId }, 'src')
    if(visit) {
      const ip = req.ip
      Shortlink.updateOne({ linkId }, { $inc: { impression: 1 }}).exec()
      Statistic.create({ link: link._id, ip })
    }
    rep.send({ link })
  } catch(err) {
    console.log(err)
    rep.status(400).send({ message: 'An error occured' })
  }
})

router.get('/popular', async (req, rep) => {
  const items = await Shortlink.find({}, '-__v').sort('impression').limit(10) || []
  rep.send(items)
})

module.exports = router
