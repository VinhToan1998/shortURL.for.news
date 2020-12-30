const express = require('express')
const router = express.Router()
const multer  = require('multer')
const path = require('path')
const uploadPath = path.join(__dirname, '../../static/user')
const upload = multer({ dest: uploadPath })
const { rename, unlink, exists } = require('fs')

const User = require('../models/user')

const removeOldImage = async function (image) {
  const filePath = uploadPath + '/' + image
  exists(filePath, (exists) => {
    if (exists)
      unlink(filePath, () => {})
  })
}

router.put('/image', upload.single('avatar'), async (req, rep) => {
  const { username } = req.session.user || {}
  if(!username)
    return rep.status(401).send({ message: 'Login to continue' })

  const user = await User.findOne({ username })
  if(!user)
    return rep.status(401).send({ message: 'Login to continue' })

  const file = req.file
  if (!/\.jpg$/.test(file.filename)) {
    const newName = file.filename + '.jpg'
    const newPath = file.destination + '/' + newName
    rename(file.path, newPath, (err) => {
      if (!err) {
        removeOldImage(user.image)
        user.image = newName
        user.save()
        req.session.user.image = newName
        return rep.send({ message: 'Uploaded successfully', image: newName })
      }
    })
  } else {
    removeOldImage(user.image)
    user.image = file.filename
    user.save()
    req.session.user.image = file.filename
    return rep.send({ message: 'Uploaded successfully', image: file.filename })
  }
})


router.patch('/', async (req, rep) => {
  if (!req.session.user && !req.session.user.username)
    return rep.status(401).send({ message: 'Login to continue' })
  const { username } = req.session.user
  const { name, phone, changePassword } = req.body || {}
  const user = await User.findOne({ username })
  if(changePassword) {
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(changePassword))
      return rep.status(400).send({ message: 'Password must contain at least one lower, upper case character, one digit, 6 minimum length' })
    user.password = changePassword
  }
  user.phone = phone
  user.name = name
  req.session.user = Object.assign(req.session.user, { name, phone })
  user.save()
  rep.send({ message: 'Updated' } )
})

module.exports = router
