import knex from '../config/database'
import jwt from 'jsonwebtoken'
import authenticate from '../utils/authenticate'
const express = require("express")
let router = express.Router();

router.get("/allUserSets", authenticate, async (req, res) => {
    try {
        if (!req.body.email) return res.status(400).json({ error: "Bad Request!" })

        const sets = await knex('sets')
            .select('sets.id', 'sets.setTitle', 'sets.setDescription')
            .where({ user_id: knex('users').select('id').where({ email: req.body.email }) })

        return res.send(sets)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})

router.get("/set", authenticate, async (req, res) => {
    try {
        if (!req.body.id) return res.send('wrong data')
        const sets = await knex('sets')
            .select('sets.setTitle', 'sets.setDescription')
            .where({ id: req.body.id })

        return res.send(sets)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})

router.post("/set", authenticate, async (req, res) => {
    try {
        if (!req.body.setTitle) return res.status(400).json({ error: "Bad Request!" });

        const tokenPayload = JSON.parse(Buffer.from(req.headers['authorization'].split(".")[1], "base64url")).payload

        if (!(tokenPayload.email === req.body.email)) // Compare email from JWT and email from req
            return res.status(401).json({ error: "Unauthorized Access!" })


        if (!req.body.id)
            return await knex('sets')
                .insert({
                    setTitle: req.body.setTitle,
                    setDescription: req.body.setDescription,
                    user_id: tokenPayload.id
                })
                .then(res.send({ status: 'sucesfull sets insert' }))
        else return await knex('sets')
            .where({ id: req.body.id })
            .update({
                setTitle: req.body.setTitle,
                setDescription: req.body.setDescription,
                user_id: tokenPayload.id
            })
            .then(res.send({ status: 'sucesfull sets update' }))
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})


router.post("/setFlashcards", authenticate, async (req, res) => {
    try {
        if (!req.body.setTitle) return res.status(400).json({ error: "Bad Request!" });

        const tokenPayload = JSON.parse(Buffer.from(req.headers['authorization'].split(".")[1], "base64url")).payload

        if (!(tokenPayload.email === req.body.email)) // Compare email from JWT and email from req
            return res.status(401).json({ error: "Unauthorized Access!" })


        if (!req.body.setId)
            return await knex('sets')
                .insert({
                    setTitle: req.body.setTitle,
                    setDescription: req.body.setDescription,
                    user_id: tokenPayload.id
                })
                //.then(res.send({status: 'sucesfull sets insert'}))
                .then((rows) => {
                    for (var i = 0; i < req.body.Flashcards.length; i++) {
                        inserUpdateFlashcards(req, rows, i)
                    }
                    return res.send({ status: 'set created' })
                })

        else {
            var userIdFromSets = await getUserIdFromSets(req.body.setId)
            if (userIdFromSets[0].user_id !== tokenPayload.id)
                return res.status(401).json({ error: "Unauthorized Access! Set dont belongs to this user" })
            return await knex('sets')

                .where({ id: req.body.setId })
                .update({
                    setTitle: req.body.setTitle,
                    setDescription: req.body.setDescription,
                    user_id: tokenPayload.id
                })
                .then((rows) => {
                    for (var i = 0; i < req.body.Flashcards.length; i++) {
                        inserUpdateFlashcards(req, req.body.setId, i)
                    }
                    return res.send({ status: 'set updated' })

                })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})

function getUserIdFromSets(setId) {
    try {
        return knex('sets').where({ id: setId }).select('user_id')
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
}

function getSetIdFromFlashcards(flashcardsId) {
    try {
        return knex('flashcards').select('set_id').where('id', flashcardsId)
    } catch (error) {
        console.error(error);
        //return res.status(500).json({ error: "internal server error" })
    }
}

async function inserUpdateFlashcards(req, rows, i) {
    try {
        if (!req.body.Flashcards[i].id) {
            return knex('flashcards').insert({
                front: req.body.Flashcards[i].front,
                back: req.body.Flashcards[i].back,
                set_id: rows
            })
                .then(console.log('insert fc'))
        }
        else {
            var SetIdFromFlashcards = await getSetIdFromFlashcards(req.body.Flashcards[i].id)
            if (SetIdFromFlashcards[0].set_id !== rows)
                return console.log('Unauthorized Access! Flashcard dont belongs to this set')

            return knex('flashcards')
                .where({ id: req.body.Flashcards[i].id })
                .update({
                    front: req.body.Flashcards[i].front,
                    back: req.body.Flashcards[i].back
                })
                .then(console.log('update fc', req.body.Flashcards[i].id))
        }
    } catch (error) {
        console.error(error);
        //return res.status(500).json({ error: "internal server error" })
    }
}



module.exports = router;