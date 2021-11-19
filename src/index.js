import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import express from 'express'
//import cookieParser from 'cookie-parser'
import User from './models/User'
import knex from './config/database'



dotenv.config()

const https = require('https')
const path = require('path')
const fs = require('fs')

const bcrypt = require('bcrypt')
const app = express()

app.use(express.json())

app.use(express.json())
//app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Credentials', true);
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        return res.status(200).json({});
    }
    next();
});


app.get('/api/', (req, res) => res.send('OK!'))



// User
app.get('/api/userInfo', authenticate, async (req, res) => {
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

app.post("/api/auth/registration", (req, res, next) => {
    if ( !req.body.password || !req.body.email){
        return res.send('wrong data')
    } 

    bcrypt.hash(req.body.password, 8)
        .then(hashedPassword => {
            knex('users')
                .select()
                .where('email', req.body.email)
                .then(function (rows) {
                    if (rows.length === 0) {
                        return knex("users").insert({
                            //id: "", 
                            email: req.body.email,
                            password: hashedPassword
                        })
                        .then(res.send( 'successful registration ' ))

                    } else {
                        res.send(' email already in use ')
                    }
                })
                .catch(function (ex) {
                    // you can find errors here.
                    res.send(' err ')
                })
        })
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


app.post('/api/auth/login', (request, response, next) => {
    knex("users")
        .where({ email: request.body.email })
        .first()
        .then(users => {
            if (!users) {
                response.status(401).json({
                    error: "No users by that name"
                })
            } else {
                return bcrypt
                    .compare(request.body.password, users.password)
                    .then(isAuthenticated => {
                        if (!isAuthenticated) {
                            response.status(401).json({
                                error: "Unauthorized Access!"
                            })
                        } else {
                            const payload = { email: users.email }
                            const accessToken = jwt.sign({ payload }, process.env.TOKEN_SECRET, { expiresIn: 86400 })
                            response.send({ accessToken })
                        }
                    })
            }
        })
})

app.post('/api/auth/refresh', async (req, res) => {
    const refreshToken = req.body.token

    if (!refreshToken) {
        return res.status(401)
    }

    // TODO: Check if refreshToken exist in DB

    try {
        await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (err) {
        return res.sendStatus(403)
    }

    const accessToken = jwt.sign({ id: 1 }, process.env.TOKEN_SECRET, { expiresIn: 86400 })

    res.send({ accessToken })
})

app.get('/api/payload', (req, res) => {

})

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token === null) return res.status(403).send("A token is required for authentication");

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.status(401).send("Invalid Token")

        req.user = user
        next()
    })
}


/*app.listen(3001, () => {
    console.log('Server is up!!')
})*/

const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app)

sslServer.listen(3443, () => console.log('SSL server runing on port 3443!'))