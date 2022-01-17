import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const https = require('https')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const app = express()
const auth = require("./routes/auth")
const profiles = require("./routes/profiles")
const sets = require("./routes/sets")
const flashcards = require("./routes/flashcards")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", auth);
app.use("/api/profiles", profiles);
app.use("/api/sets", sets);
app.use("/api/flashcards", flashcards);



app.get('/api/', (req, res) => res.send('OK!'))


app.listen(3001, () => {
    console.log('Server is up!!')
})

// const sslServer = https.createServer({
//     key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
// }, app)

// sslServer.listen(3443, () => console.log('SSL server runing on port 3443!'))