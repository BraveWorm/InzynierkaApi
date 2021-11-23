import knex from '../config/database'
import jwt from 'jsonwebtoken'
const express = require("express")
let router = express.Router();

router.get("/allUserSets", authenticate, async (req, res) => {
    const sets = await knex('sets')
        .select('sets.id', 'sets.setTitle', 'sets.setDescription', 'sets.setPortion')
        .where({ user_id: knex('users').select('id').where({ email: req.body.email }) })

    return res.send(sets)
})

router.get("/set", authenticate, async (req, res) => {
    const sets = await knex('sets')
        .select('sets.setTitle', 'sets.setDescription', 'sets.setPortion')
        .where({ user_id: knex('users').select('id').where({ email: req.body.email }) })

    return res.send(sets)
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