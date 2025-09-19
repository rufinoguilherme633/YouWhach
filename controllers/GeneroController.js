const express = require("express");

const router = express.Router()

const Genero =require("../models/Genero");



router.get("/", async (req,res) => {
    const genero = await Genero.findAll();
    res.status(200).json(genero);
})



module.exports = router