import knex from '../config/database'
import jwt from 'jsonwebtoken'
import authenticate from '../utils/authenticate'
import setStatistics from '../utils/setStatistics'
const express = require("express")
let router = express.Router();


router.get("/", authenticate, async (req, res) => {
    try {
        const profile = await knex('profiles')
            .select('profiles.name', 'profiles.avatar', 'profiles.description')
            .where({ user_id: knex('users').select('id').where({ id: req.user.payload.id }) })

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

router.get('/statistics', authenticate, async (req, res) => {
    try {
        var setsId = await knex('sets')
            .select('sets.id')
            .where({ user_id: req.user.payload.id })

        if (setsId == 0)
            return res.send({ status: 'User don\'t have any sets' })
        
        var statistics = {howManySets: setsId.length, learned: 0, unlearned: 0, allFlashcards: 0}
        
        for (var i = 0; i < setsId.length; i++) {
            statistics.learned += (await setStatistics(setsId[i].id)).learned
            statistics.unlearned += (await setStatistics(setsId[i].id)).unlearned
            statistics.allFlashcards += (await setStatistics(setsId[i].id)).allFlashcards
        }


        return res.send(statistics)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})

router.post('/name', authenticate, async (req, res) => {
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

router.post('/avatar', authenticate, async (req, res) => {
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


router.post('/description', authenticate, async (req, res) => {
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