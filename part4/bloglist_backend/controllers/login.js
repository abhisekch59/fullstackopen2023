const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const body = request.body
    
    const username = body.username
    const password = body.password

    const userFromDB = await User.findOne({ username })
 
    const passwordCorrect = userFromDB === null
        ? false
        : await bcrypt.compare(password, userFromDB.passwordHash)
    
    if(!(userFromDB && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: userFromDB.username,
        id: userFromDB._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response
        .status(200)
        .send({ token, username: userFromDB.username, name: userFromDB.name})
})

module.exports = loginRouter