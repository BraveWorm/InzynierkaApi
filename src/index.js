import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import express from 'express'
import cookieParser from 'cookie-parser'
import User from './models/User'

dotenv.config()

const app = express()

app.use(express.json())

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

app.get('/api/', (req, res) => res.send('OK!'))


// User
app.get('/api/users', async (req, res) => {
    const users = await User.query()

    res.send(users)
})

app.post('/api/auth/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    // const validPassword = await bcrypt.compare(password, user[0].password)

    const accessToken = jwt.sign({ id: 1}, process.env.TOKEN_SECRET, { expiresIn: 86400 })
    const refreshToken = jwt.sign({ id: 1}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 525600 })

    res.cookie('JWT', accessToken, {
        maxAge:8640000,
        httpOnly: true,
    })

    res.send({ accessToken, refreshToken})
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

    const accessToken = jwt.sign({ id: 1}, process.env.TOKEN_SECRET, { expiresIn: 86400 })

    res.send({ accessToken })
})

function authenticate(req, res, next){
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]

    if (token === null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)

        req.user = user
        next()
    })
}

app.listen(3001, () => {
    console.log('Server is up!')
})