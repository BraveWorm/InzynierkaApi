import knex from '../config/database'
import jwt from 'jsonwebtoken'
import authenticate from '../utils/authenticate'
const express = require("express")
let router = express.Router();


router.get("/", authenticate, async (req, res) => {
    const profile = await knex('profiles')
        .select('profiles.name', 'profiles.avatar', 'profiles.description')
        .where({ user_id: knex('users').select('id').where({ email: req.body.email }) })
        
    res.send(profile)
})

/*
router.post("/", authenticate, async (req, res) => {

    if (!(JSON // operacje na JSON
        .parse(Buffer                               
            .from(req.headers['authorization'] // pobranie z zapytania nagłówka z obiekt authorization
                .split(".")[1],                // wydzielenie po "."
                "base64url")                   // schemat kodowania
        )
        // pównanie czy email z JWT zgdza się z emailem z body zapytania do api 
        .payload.email === req.body.email   
    )) 
    // zwrócenie statusu 401 Unauthorized z "error": "Unauthorized Access!"
        return res.status(401).json({ error: "Unauthorized Access!" }) 
*/

router.post("/", authenticate, async (req, res) => {
    // TODO: walidacja czy id set należy do userera!!!
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


module.exports = router;