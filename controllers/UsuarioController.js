const express = require("express");

const router = express.Router()

const Usuario =require("../models/Usuario");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { where } = require("sequelize");


router.post("/deletarConta/:id", async (req,res)=>{
    try {
        const usuario = await Usuario.findOne({
            where: { id_usuario: req.params.id }
        });

        if (!usuario) {
            return res.status(404).send({ message: "usuario não encontrado ou não disponível" });
        }
        console.log(req.params.id)
        console.log("req.session.user.id "+req.session.user.id)
        if (parseInt(req.params.id) !==  parseInt(req.session.user.id)){
            return res.status(403).send({ message: "Você não possui permissão para deletar este conta" });
        }

        await Usuario.destroy({
            where: { id_usuario: req.params.id }
        });

 req.session.destroy(err => {
            if (err) {
                console.error("Erro ao destruir sessão:", err);
                // Mesmo que dê erro, redireciona para login
                    return res.render("login", {noLayout:true, noHeader:true})

            }
                 return res.render("login", {noLayout:true, noHeader:true})

        });

 
       

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro no servidor" });
    }
})

router.get("/minha_conta", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "Não logado" });
        }

        const user = await Usuario.findOne({
            where: {
                id_usuario: req.session.user.id  // pega o id da sessão
            }
        });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        res.status(200).render('minhaConta',{user:user.toJSON()});  // envia o usuário como JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});




        const storage = multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,path.join(__dirname, '../public/img/users'))
        },
        filename: function(req, file, cb) {
    const ext = path.extname(file.originalname); // mantém .png, .jpg etc
    cb(null, Date.now() + ext);
}
    })

const upload = multer({ storage });

// POST para atualizar usuário
router.post("/", upload.single("foto"), async (req, res) => {
    // Agora o Multer processou o formulário antes de chegarmos aqui
    const { nome, sobrenome, email, telefone, tipo, genero } = req.body;
    const foto = req.file ? '/img/users/' + req.file.filename : null;

    console.log(foto, nome, sobrenome, email, telefone, tipo, genero);

 try {
      const updateData = { nome, sobrenome, email, telefone, tipo, genero };
        if (foto) updateData.foto = foto; // só atualiza a foto se houver novo upload

        // Atualiza no banco
       await Usuario.update(
            updateData,
            { where: { id_usuario: req.session.user.id } } // usa o id da sessão
        );
                const user = await Usuario.findOne({ where: { id_usuario: req.session.user.id } });


                res.status(200).render('minhaConta',{user:user.toJSON()});  // envia o usuário como JSON

 } catch (error) {
        res.status(500).json({ error: "Erro interno no servidor" });

 }
});




router.post("/conta", upload.single("foto"), async (req, res) => {
const { nome, sobrenome,senha, email, telefone, tipo, genero } = req.body;
const foto = req.file ? '/img/users/' + req.file.filename : '/img/users/usuario sem foto.svg';



  try {
   
 

    const data = { nome, sobrenome,senha, email, telefone, tipo, genero, foto };
    await Usuario.create(data);
    console.log("criado com sucesso")
    
    res.status(200).render('login',{noLayout:true});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});


module.exports = router