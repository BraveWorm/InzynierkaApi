import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import express from 'express'
//import cookieParser from 'cookie-parser'
import User from './models/User'
import knex from './config/database'
//var authenticate = require('./Utils/authenticate');
import authenticate from './utils/authenticate'

dotenv.config()

const https = require('https')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const bcrypt = require('bcrypt')
const app = express()
const auth = require("./routes/auth")
const profiles = require("./routes/profiles")
const sets = require("./routes/sets")

//app.use(express.json())
app.use(cors())
app.use(express.json())
//app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))


app.use("/api/auth", auth);
app.use("/api/profiles", profiles);
app.use("/api/sets", sets);

app.get('/api/', (req, res) => res.send('OK!'))

// User
app.get('/api/userInfo', authenticate,  async (req, res, next) => {
    
    if (!(JSON.parse(Buffer.from(req.headers['authorization'].split(".")[1], "base64url")).payload.email === req.body.email)) // Compare email from JWT and email from req
    {
        res.status(401).json({
            error: "Unauthorized Access!"
        })
    } else {
        const users = await knex("users")
            .select('users.email', 'users.created_at', 'users.updated_at')
            .where({ email: req.body.email })

        res.send(users)
    }
})


//
app.post("/api/isEmailFree", async (req, res) => {


    return knex('users')
        .select()
        .where('email', req.body.email)
        .then(function (rows) {
            if (rows.length === 0) {
                res.send( 'email free' )
            } else {
                res.send( 'email already in use' )
            }
        })
        .catch(function (ex) {
            res.send(' err ')
        })
})


// app.listen(3001, () => {
//     console.log('Server is up!!')
// })

const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app)

sslServer.listen(3443, () => console.log('SSL server runing on port 3443!'))