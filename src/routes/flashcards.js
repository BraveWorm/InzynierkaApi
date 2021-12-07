import knex from '../config/database'
import jwt from 'jsonwebtoken'
import authenticate from '../utils/authenticate'
const express = require("express")
let router = express.Router();

// TODO: walidacja, tokenPayload
router.post("/flashcardsToLearn", authenticate, async (req, res) => {
    try {

        if (!req.body.set_id) return res.status(400).json({ error: "Bad Request!" });

        const tokenPayload = JSON.parse(Buffer.from(req.headers['authorization'].split(".")[1], "base64url")).payload

        if (!(tokenPayload.email === req.body.email)) // Compare email from JWT and email from req
            return res.status(401).json({ error: "Unauthorized Access!" })


        const flashcardsToLearn = await knex('flashcards')
            .select('flashcards.id', 'flashcards.front', 'flashcards.back')
            .where({ set_id: req.body.set_id })
            .whereNot('correctNumber', 4)
        res.send(flashcardsToLearn)


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})


// TODO: 
router.get("/flashcardPlusOrZero", authenticate, async (req, res) => {
    try {


        // var _correctNumber = await knex('flashcards')
        //     .select('flashcards.correctNumber')
        //     .where({ id: req.body.flashcardId })
        // _correctNumber = _correctNumber[0].correctNumber



        // if (req.body.ifCorrect) _correctNumber++
        // else _correctNumber = 0

        // if (_correctNumber > 5) _correctNumber = 5
        // if (_correctNumber < 0) _correctNumber = 0

        // console.log(_correctNumber)

        // return knex('flashcards')
        //     .update({
        //         correctNumber: _correctNumber
        //     })
        //     .where({ id: req.body.flashcardId })
        //     .then(res.send({ status: 'successful update' }))



    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})

// TODO: DELETE!!!
// TODO: walidacja
router.post("/flashcardsToLearnNoJWT", async (req, res) => {
    try {

        if (!req.body.set_id) return res.status(400).json({ error: "Bad Request!" });


        const flashcardsToLearn = await knex('flashcards')
            .select('flashcards.id', 'flashcards.front', 'flashcards.back')
            .where({ set_id: req.body.set_id })
            .whereNot('correctNumber', 5)
        res.send(flashcardsToLearn)


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})


// TODO: 
router.post("/flashcardPlusOrZero", authenticate, async (req, res) => {
    try {

        if (!req.body.flashcardId) return res.status(400).json({ error: "Bad Request!" });

        const user_id = await knex('sets').select('user_id').where({
            id: knex('flashcards')
                .select('set_id')
                .where({id: req.body.flashcardId})
         })
        if (req.user.payload.id !== user_id[0].user_id)
            return res.status(401).json({ error: "Unauthorized Access!" })

        var _correctNumber = await knex('flashcards')
            .select('flashcards.correctNumber')
            .where({ id: req.body.flashcardId })
        _correctNumber = _correctNumber[0].correctNumber



        if (req.body.ifCorrect) _correctNumber++
        else _correctNumber = 0

        if (_correctNumber > 5) _correctNumber = 5
        if (_correctNumber < 0) _correctNumber = 0


        return knex('flashcards')
            .update({
                correctNumber: _correctNumber
            })
            .where({ id: req.body.flashcardId })
            .then(res.send({ status: 'successful update' }))


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})


module.exports = router;