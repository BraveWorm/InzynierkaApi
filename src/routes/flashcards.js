import knex from '../config/database'
import jwt from 'jsonwebtoken'
import authenticate from '../utils/authenticate'
const express = require("express")
let router = express.Router();

// TODO walidacja
router.get("/flashcardsToLearn", authenticate, async (req, res) => {
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

router.get("/flashcardPlusOrZero", authenticate, async (req, res) => {
    try {




    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})

// TO DELETE!!!
// TODO walidacja
router.get("/flashcardsToLearnNoJWT", async (req, res) => {
    try {

        if (!req.body.set_id) return res.status(400).json({ error: "Bad Request!" });


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

router.get("/flashcardPlusOrZero", authenticate, async (req, res) => {
    try {




    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" })
    }
})


module.exports = router;