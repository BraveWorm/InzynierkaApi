import knex from '../config/database'
import jwt from 'jsonwebtoken'
const express = require("express")
const bcrypt = require('bcrypt')
let router = express.Router();

/*router.use(function(req, res, next){
    console.log(req.url, "@", Date.now())
    next();
})*/

router.post("/registration", (req, res) => {
    if ( !req.body.password || !req.body.email){
        return res.send('wrong data')
    } 

    bcrypt.hash(req.body.password, 8)
        .then(hashedPassword => {
            knex('users')
                .select()
                .where('email', req.body.email)
                .then(function (rows) {
                    if (rows.length === 0) {
                        return knex("users").insert({
                            //id: "", 
                            email: req.body.email,
                            password: hashedPassword
                        })
                        .then(res.send( 'successful registration ' ))

                    } else {
                        res.send(' email already in use ')
                    }
                })
                .catch(function (ex) {
                    // you can find errors here.
                    res.send(' err ')
                })
        })
})


router.post('/login', async (req, res) => {
    try {
        await knex("users")
            .where({ email: req.body.email })
            .first()
            .then(users => {
                if (!users) {
                    res.status(401).json({
                        error: "No users by that name"
                    })
                } else {
                    return bcrypt
                        .compare(req.body.password, users.password)
                        .then(isAuthenticated => {
                            if (!isAuthenticated) {
                                res.status(401).json({
                                    error: "Unauthorized Access!"
                                })
                            } else {
                                const payload = { email: users.email }
                                const accessToken = jwt.sign({ payload }, process.env.TOKEN_SECRET, { expiresIn: 86400 })
                                res.send({ accessToken })
                            }
                        })
                }
            })
        } catch (err) {
            return res.sendStatus(403)
        }

})

router.post('/refresh', async (req, res) => {
    const refreshToken = req.body.token

    if (!refreshToken) {
        return res.status(401)
    }

    // TODO: Check if refreshToken exist in DB

    try {
        await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (err) {
        return res.sendStatus(403)
    }

    const accessToken = jwt.sign({ id: 1 }, process.env.TOKEN_SECRET, { expiresIn: 86400 })

    res.send({ accessToken })
})

module.exports = router;