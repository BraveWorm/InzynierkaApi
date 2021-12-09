import knex from '../config/database'
import jwt from 'jsonwebtoken'
import authenticate from '../utils/authenticate'
const express = require("express")
let router = express.Router();


router.get("/", authenticate, async (req, res) => {
    try {
        //return console.log( req.headers['authorization'])
        const profile = await knex('profiles')
            .select('profiles.name', 'profiles.avatar', 'profiles.description')
            .where({ user_id: knex('users').select('id').where({ email: req.body.email }) })

        res.send(profile)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})



router.put("/", authenticate, async (req, res) => {
    try {
        return await knex('profiles')
            .where({ user_id: req.user.payload.id })
            .update({
                name: req.body.name,
                avatar: req.body.avatar,
                description: req.body.description
            })
            .then(res.send({ status: 'sucesfull profile insert' }))
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})


router.put('/name', authenticate, async (req, res) => {
    try {
        //console.log(req.params.setId)
        if (!req.body.name) return res.status(400).json({ error: "Bad Request!" });

        return await knex('profiles')
            .where({ user_id: req.user.payload.id })
            .update({ name: req.body.name })
            .then(res.send({ status: 'name updated' }))



    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})

router.put('/avatar', authenticate, async (req, res) => {
    try {
        //console.log(req.params.setId)
        if (!req.body.avatar) return res.status(400).json({ error: "Bad Request!" });

        return await knex('profiles')
            .where({ user_id: req.user.payload.id })
            .update({ avatar: req.body.avatar })
            .then(res.send({ status: 'avatar updated' }))



    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})


router.put('/description', authenticate, async (req, res) => {
    try {
        //console.log(req.params.setId)
        if (!req.body.description) return res.status(400).json({ error: "Bad Request!" });

        return await knex('profiles')
            .where({ user_id: req.user.payload.id })
            .update({ description: req.body.description })
            .then(res.send({ status: 'description updated' }))



    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})


module.exports = router;