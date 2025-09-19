const express = require("express");

const router = express.Router()

const TipoUsuario =require("../models/TipoUsuario");
const { Op } = require("sequelize");


router.get("/", async (req,res) => {
    try {
        const tipo_usuario = await TipoUsuario.findAll({
        where:{id_tipo_usuario:{[Op.ne]:1}} 
    });

     res.status(200).json(tipo_usuario);

    } catch (error) {
         res.status(400).json("Nenhum encontrado");
    }
   
})



module.exports = router