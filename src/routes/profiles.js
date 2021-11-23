import knex from '../config/database'
import jwt from 'jsonwebtoken'
const express = require("express")
let router = express.Router();


router.get("/", authenticate, async (req, res) => {
    const profile = await knex('profiles')
        .select('profiles.name', 'profiles.avatar', 'profiles.description')
        .where({ user_id: knex('users').select('id').where({ email: req.body.email }) })

    res.send(profile)
})

router.post("/", authenticate, async (req, res) => {
    if (!(JSON.parse(Buffer.from(req.headers['authorization'].split(".")[1], "base64url")).payload.email === req.body.email)) // Compare email from JWT and email from req
        return res.status(401).json({ error: "Unauthorized Access!" })
    return await knex('profiles')
        .where({
            user_id: knex('users').select('id')
                .where({ email: req.body.email })
        })
        .update({
            name: req.body.name,
            avatar: req.body.avatar,
            description: req.body.description
        })
        .then( res.send('sucesfull profile insert' ))
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

module.exports = router;