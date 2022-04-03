const express = require("express")
const path = require("path")
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'adfsadifgadugfuadbfadlsfadifads'

mongoose.connect('mongodb://localhost:27017/login-app-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const port = 3000
const app = express()
// In Express, app.use(express.static()) adds a middleware for serving static files to your Express app.
app.use('/', express.static(path.join(__dirname, 'static')))

app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.json())


app.post('/api/register', async (req, res) => {
    console.log(req.body)

    const username = req.body.username
    const plainpass = req.body.password

    if (username == undefined || typeof username !== 'string' || username.trim() === "" || username == null) {
        return res.json({ status: 'error', error: 'invalid username' })
    }

    if (!plainpass || typeof plainpass !== 'string') {
        return res.json({ status: 'error', error: 'invalid password' })
    }
    //$2a$10$MCtmXUphvB3QkDaQAQviT.539fh.TCTxCWDaeXLrDSv9/bsvBYCma

    if (plainpass.length <= 5) {
        return res.json({ status: 'error', error: 'password length should be at least 6 characters' })
    }

    console.log(req.body.password)
    // irrespective of how long user makes password
    // bcrypt will convert that pass. into a fixed length
    const password = await bcrypt.hash(plainpass, 10)
    console.log(password)

    try {
        const response = await User.create({
            username,
            password
        })
        console.log(response)
    } catch (error) {
        console.log(error.message)
        console.log(JSON.stringify(error))
        if (error.code === 11000) {
            // duplicate key
            return res.json({ status: 'error', error: 'username already in use' })
        }
        throw error
        // return res.json({status: 'error'})
    }


    // res.json() take care of something on its own
    // for example setting the headers

    res.json({ status: "Ok" })
})

app.get('/api/all', async (req, res) => {
    const records = User.find({}, (err, result) => {
        if (err) {
            res.json({ status: "error" })
        }
        res.json(result);
    })
})

app.post('/api/login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    // lean will return a json representation of document
    const user = await User.findOne({ username }).lean()
    // console.log(`username is ${username} and password is ${password}`)

    if (!user.username) {
        return res.json({ status: "error", error: "Invalid username/password" })
    }
    console.log(`user is ${user}`)
    // console.log(`user is ${user}`)
    // console.log(`password is ${password} and user.password is ${user.password}`)
    if (await bcrypt.compare(password, user.password)) {
        // username, password combination is successfully

        // donot store sensitive info here as it is public
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            // this is very important
            // if this is leaked all json payloads can be manipulated
            JWT_SECRET,

        )
        return res.json({ status: "Ok", data: token })
    }




    res.json({ status: 'error', data: 'invalid username/password' })
})

app.post('/api/change-password', async (req, res) => {
    const token = req.body.token

    try {
        // this will give the decoded version of the middle part of jwt
        const user = await jwt.verify(token, JWT_SECRET)
        console.log(user)
        const newpass = req.body.newpassword
        
        //TODO: make sure to apply all password verification checks again

        const _id = user.id
        console.log(_id)
        const hashedPassword = await bcrypt.hash(newpass, 10)
        console.log('hashed pass is ', hashedPassword)
        const user2 = await User.updateOne(
            { _id },
            {
                $set: {
                    password: hashedPassword
                    
                }
            }
        )
        console.log(user2)
        return res.json({ status: "Ok" })
    } catch (err) {
        console.log(err.message)
        return res.json({ status: "error", error: "invalid credentials" })
    }
})

app.listen(port, () => {
    console.log(`app listening on http://localhost:${port}`)
})

