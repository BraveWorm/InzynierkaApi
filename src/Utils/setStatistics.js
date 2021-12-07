import jwt from 'jsonwebtoken'
import knex from '../config/database'
const express = require("express")

export default async function (setId) {

    var records = await knex('flashcards')
        .select('*')
        .where({ set_id: setId })
    var statistics = records.length
    console.log(statistics)

    return statistics;

}

