import knex from '../config/database'
import jwt from 'jsonwebtoken'
import authenticate from '../utils/authenticate'
const express = require("express")
let router = express.Router();


router.get("/", authenticate, async (req, res) => {
    try {
        const profile = await knex('profiles')
            .select('profiles.name', 'profiles.avatar', 'profiles.description')
            .where({ user_id: knex('users').select('id').where({ email: req.body.email }) })

        res.send(profile)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})



router.post("/", authenticate, async (req, res) => {
    try {
        // TODO: walidacja czy id set należy do userera!!!
        const tokenPayload = JSON.parse(Buffer.from(req.headers['authorization'].split(".")[1], "base64url")).payload
        
        if (!(tokenPayload.email === req.body.email) || !(tokenPayload === 1)) // Compare email from JWT and email from req
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
            .then(res.send('sucesfull profile insert'))
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})


module.exports = router;