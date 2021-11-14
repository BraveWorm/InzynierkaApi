import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import express from 'express'

dotenv.config()

const app = express()

app.use(express.json())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/api/', (req, res) => res.send('OK!'))

app.listen(3001, () => {
    console.log('Server is up!')
})