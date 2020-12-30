const express = require('express')
const router = express.Router()
var User = require('../models/user')

router.get('/list', async (req, rep) => {
  const isAdmin = req.session.user && req.session.user.isAdmin
  if (!isAdmin){
    return rep.status(403).send({ message: 'Not allowed' })
  }
  const users = await User.find({}, '-__v -password')
  rep.send({ users })
})

router.post('/register', async (req, rep) => {
  const { email, username, password } = req.body
  try {
    if (await User.findOne({ email })) {
      return rep.status(400).send({ message: 'Email already exists' })
    }
    if (await User.findOne({ username })) {
      return rep.status(400).send({ message: 'Username already exists' })
    }
    await User.create({ email, username, password })
    rep.send({ message: 'Register successfully' })
  } catch (err) {
    console.log(err)
    return rep.status(400).send({ message: 'An error occured' })
  }
})

router.delete('/session', async (req, rep) => {
  if (req.session && req.session.user && req.session.user.username) {
    req.session.destroy()
    return rep.send({ message: 'You have logged out' })
  } else {
    return rep.status(401).send({ message: 'You\'re not logged in' })
  }
})

router.delete('/:userId', async (req, rep) => {
  const { userId } = req.params || {}
  if(!req.session.user.isAdmin)
    return rep.status(403).send({ message: 'Not allowed' })

  await User.findOneAndDelete({ _id: userId })
  return rep.send({ message: 'User deleted' })
})

router.post('/login', async (req, rep) => {
  const { username, password } = req.body
  const adminPassword = process.env.ADMIN_PASSWORD
  // LOGIN CHO ADMIN
  if (username === 'admin') {
    if (password === adminPassword) {
      req.session.user = { isAdmin: true, name: 'Admin', username }
      return rep.send({ message: `Logged in as Admin` })
    } else {
      return rep.status(401).send({ message: 'Incorrect password' })
    }
  }

  // LOGIN CHO USER THƯỜNG
  try {
    const user = await User.findOne({ username })
    if (!user) {
      return rep.status(401).send({ message: 'Username or password doesn\'t match' })
    }
    user.comparePassword(password).then((isMatch) => {
      if(isMatch) {
        const { password, _id: userId, __v, ...userData } = user._doc
        req.session.user = { userId, ...userData }
        rep.send({ message: `Logged in as ${username}` })
      } else {
        rep.status(401).send({ message: 'Incorrect password' })
      }
    }).catch(err => {
      rep.status(401).send({ message: 'Incorrect password' })
    })
  } catch (err) {
    console.log('LOGIN ERROR', err.message)
    return rep.status(400).send({ message: 'An error occured' })
  }
})

module.exports = router
