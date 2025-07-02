const express = require("express")
const cpo = require("../models/cpo.js")
const router = express.Router()

router.post("/new", async (req,res,next) => {
    try {
        const newCpo= await cpo.create (req.body)
        res.send("created cpo")
    } catch (error) {
        next(error)
    }
})

module.exports= router