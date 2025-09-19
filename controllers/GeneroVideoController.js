const express = require("express");

const router = express.Router()

const GeneroVideo =require("../models/GeneroVideo");



router.get("/", async (req,res) => {
    const genero_video = await GeneroVideo.findAll();
    res.status(200).json(genero_video);
})



module.exports = router