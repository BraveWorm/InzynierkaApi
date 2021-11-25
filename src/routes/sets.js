import knex from '../config/database'
import jwt from 'jsonwebtoken'
import authenticate from '../utils/authenticate'
const express = require("express")
let router = express.Router();

router.get("/allUserSets", authenticate, async (req, res) => {
    if (!req.body.email) return res.status(400).json({ error: "Bad Request!" })

    const sets = await knex('sets')
        .select('sets.id', 'sets.setTitle', 'sets.setDescription', 'sets.setPortion')
        .where({ user_id: knex('users').select('id').where({ email: req.body.email }) })

    return res.send(sets)
})

router.get("/set", authenticate, async (req, res) => {
    if (!req.body.id) return res.send('wrong data')
    const sets = await knex('sets')
        .select('sets.setTitle', 'sets.setDescription', 'sets.setPortion')
        .where({ id: req.body.id })

    return res.send(sets)
})

router.post("/set", authenticate, async (req, res) => {
    if (!req.body.email || !req.body.setTitle || !req.body.id) return res.status(400).json({ error: "Bad Request!" })
    if (!(JSON.parse(Buffer.from(req.headers['authorization'].split(".")[1], "base64url")).payload.email === req.body.email)) // Compare email from JWT and email from req
        return res.status(401).json({ error: "Unauthorized Access!" })

    const sets = await knex('sets')
        .select('sets.setTitle', 'sets.setDescription', 'sets.setPortion')
        .where({ id: req.body.id })

    return await knex('sets')
        .where({ id: req.body.id })
        .update({
            setTitle: req.body.setTitle,
            setDescription: req.body.setDescription,
            setPortion: req.body.setPortion
        })
        .then(res.send('sucesfull profile sets'))
})


module.exports = router;