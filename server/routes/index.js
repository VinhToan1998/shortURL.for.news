const express = require('express')

const router = express.Router()

// router.get('/user', (req, rep, next) => {
//   const [, prefix, name] = req.originalUrl.split('/login')
//   const { roles } = req.session

//   if (roles.includes('admin') || roles.includes('mod')) {
//     return next()
//   }

//   if (prefix === 'api') {
//     if (!roles.includes(name)) {
//       return rep.status(403).send({ message: 'Không có quyền truy cập' })
//     }
//   }
//   next()
 
// })

router.use('/shortlink', require('./shortlink'))
router.use('/user', require('./user'))
router.use('/profile', require('./profile'))
router.use('/category', require('./category'))
router.use('/report', require('./report'))
router.use('/statistics', require('./statistics'))
// router.use('/upnews', require('./upnews'))

router.get('/auth', (req, rep) => {
  if(req.session && req.session.user)
    return rep.send(req.session.user)
  rep.send({ message: 'Not logged in' })
})

module.exports = router
