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

// TO DELETE!!!
router.put('/name/:userId', async (req, res) => {
    try {
        //console.log(req.params.setId)
         if (!req.params.userId || !req.body.name) return res.status(400).json({ error: "Bad Request!" });

            return await knex('profiles')                
                .where({user_id: req.params.userId})
                .update({name: req.body.name})
                .then(res.send({ status: 'name updated'}))
                

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})

// TO DELETE!!!
router.put('/avatar/:userId', async (req, res) => {
    try {
        //console.log(req.params.setId)
         if (!req.params.userId || !req.body.avatar) return res.status(400).json({ error: "Bad Request!" });

            return await knex('profiles')                
                .where({user_id: req.params.userId})
                .update({avatar: req.body.avatar})
                .then(res.send({ status: 'avatar updated'}))
                

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})


// TO DELETE!!!
router.put('/description/:userId', async (req, res) => {
    try {
        //console.log(req.params.setId)
        if (!req.params.userId || !req.body.description) return res.status(400).json({ error: "Bad Request!" });

            return await knex('profiles')                
                .where({user_id: req.params.userId})
                .update({description: req.body.description})
                .then(res.send({ status: 'description updated'}))
                

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})


module.exports = router;