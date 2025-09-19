const express = require("express");

const router = express.Router()

const Video =require("../models/Video");
const { Op } = require("sequelize");
const { route } = require("./GeneroController");

const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static'); // caminho do ffmpeg embutido
ffmpeg.setFfmpegPath(ffmpegPath);


// Define onde os arquivos serão salvos e com qual nome
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../public/videos')); // caminho correto relativo ao arquivo VideoController
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});



const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|avi|mov|mkv/;
  const ext = path.extname(file.originalname).toLowerCase();
  if(allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de vídeo são permitidos'));
  }
};

const upload = multer({ storage, fileFilter });



router.get('/criarMeuVideo', (req,res) => {
    res.render('criarVideo');
});

router.get("/", async (req,res) => {
    try {
        const meus_videos = await Video.findAll({
        where:{id_usuario: req.session.user.id} 
    });

    //console.log(meus_videos)
    const meus_videosSJON = meus_videos.map(v=>v.toJSON())
 res.render("meusVideos",{videos:meus_videosSJON})
    } catch (error) {
         res.status(400).render("meusVideos", { videos: [], error: "Nenhum vídeo encontrado" });
    }
   
   
})


router.post("/criar_video", upload.single('caminho'), async (req, res) => {
    try {
        const { titulo, descricao } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum vídeo enviado' });
        }

        // Caminho absoluto do vídeo no servidor
        const videoPath = req.file.path;

        // Transformar em caminho relativo para salvar no banco
        // Ex.: "C:/.../public/videos/caminho-123.mp4" => "videos/caminho-123.mp4"
        const relativeVideoPath = videoPath.split('public' + path.sep)[1].replace(/\\/g, '/');

        // Preparar thumbnail
        const timestamp = Date.now();
        const thumbnailFolder = path.join(__dirname, '../public/img/');
        const thumbnailName = `${timestamp}.png`;

        console.log('Arquivo recebido:', req.file);
        console.log('Body:', req.body);
        console.log('Caminho relativo salvo no DB:', relativeVideoPath);

        // Gerar thumbnail
        await new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .screenshots({
                    timestamps: ['10'],
                    filename: thumbnailName,
                    folder: thumbnailFolder,
                    size: '320x240'
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // Salvar vídeo no banco
        const novoVideo = await Video.create({
            titulo,
            descricao,
            caminho: relativeVideoPath, // caminho relativo
            thumbnail: `img/${thumbnailName}`,
            views: 0,
            id_usuario: req.session.user.id
        });

        console.log('Vídeo criado:', novoVideo.toJSON());

        // Redireciona para a página de "Meus Vídeos"
        res.redirect('/video');

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no upload do vídeo', error: err.message });
    }
});



router.get("/em_alta",async (req,res) =>{

   const hoje = new Date();
const ultimos30Dias = new Date();
ultimos30Dias.setDate(hoje.getDate() - 30);
     
     try {
         const videos = await Video.findAll({
            where:{
                createdAt:{[Op.gte]: ultimos30Dias} 
            },
            limit:100,
            order:[["createdAt", "DESC"]]
    });

    console.log(videos)
    const meus_videosSJON = videos.map(v=>v.toJSON())
    res.render("emAlta",{videos:meus_videosSJON})

    } catch (error) {
         res.status(400).render("emAlta", { videos: [], error: "Nenhum vídeo encontrado" });
    }

});


router.get("/:id_video", async (req,res)=>{
    const id_video = req.params.id_video;
    //console.log(id_video)
    try{
        const video = await Video.findOne({
        where:{
            id_video:id_video
        }
      })

        const videos = await Video.findAll({
            where:{
                id_genero_video: video.id_genero_video
            },
            
         }); 

       if (!video) {
             return res.render("video", { video: null }); 
      }


        console.log(video)
        const videoJSON = video.toJSON();

        const videosJSON = videos.map(v => v.toJSON());

          videoJSON.formattedDate = new Date(videoJSON.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        // para a lista de vídeos também, se quiser
        videosJSON.forEach(v => {
            v.formattedDate = new Date(v.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        });
     res.render("video",{video:videoJSON,videos:videosJSON,noLayout: true})
    }catch(error){
        res.status(400).render("video", { video: {message: "Nenhum vídeo encontrado"} });
    }
})



router.post("/:id_video", async (req, res) => {
    try {
        const video = await Video.findOne({
            where: { id_video: req.params.id_video }
        });

        if (!video) {
            return res.status(404).send({ message: "Vídeo não encontrado ou não disponível" });
        }

        console.log("id_usuario"+video.id_usuario);
        console.log("req paras"+ req.session.user.id)
        
        if (video.id_usuario !== req.session.user.id){
            return res.status(403).send({ message: "Você não possui permissão para deletar este vídeo" });
        }

        await Video.destroy({
            where: { id_video: req.params.id_video }
        });

        const nova_lista = await Video.findAll({
            where: { id_usuario: req.session.user.id }
        });

        const nova_listaJSON = nova_lista.map(v => v.toJSON());

        return res.render("meusVideos", { videos: nova_listaJSON });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Erro no servidor" });
    }
});





router.get("/:id_video", async (req,res)=>{
    const id_video = req.params.id_video;
    //console.log(id_video)
    try{
        const video = await Video.findOne({
        where:{
            id_video:id_video
        }
      })

        const videos = await Video.findAll({
            where:{
                id_genero_video: video.id_genero_video
            },
            
         }); 

       if (!video) {
             return res.render("video", { video: null }); 
      }


        console.log(video)
        const videoJSON = video.toJSON();

        const videosJSON = videos.map(v => v.toJSON());

          videoJSON.formattedDate = new Date(videoJSON.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        // para a lista de vídeos também, se quiser
        videosJSON.forEach(v => {
            v.formattedDate = new Date(v.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        });
     res.render("video",{video:videoJSON,videos:videosJSON,noLayout: true})
    }catch(error){
        res.status(400).render("video", { video: {message: "Nenhum vídeo encontrado"} });
    }
})







router.post("/atualizar/:id_video", async (req,res)=>{
    const id_video = req.params.id_video;
    const { titulo, descricao } = req.body; // <- isso estava faltando

    try{
        const video = await Video.findOne({
        where:{
            id_video:id_video
        }
      })


        if (!video) {
            return res.status(404).send({ message: "Vídeo não encontrado ou não disponível" });
        }

        
        if (video.id_usuario !== req.session.user.id){
            return res.status(403).send({ message: "Você não possui permissão para alterar este vídeo" });
        }


           const updateData = { titulo, descricao};
 
       await Video.update(
            updateData,
            {  where: { id_video: id_video } } // usa o id da sessão
        );

        const nova_lista = await Video.findAll({
            where: { id_usuario: req.session.user.id }
        });

        const nova_listaJSON = nova_lista.map(v => v.toJSON());

        return res.render("meusVideos", { videos: nova_listaJSON });


    }catch(error){
        res.status(400).render("video", { video: {message: "Nenhum vídeo encontrado"} });
    }
})




module.exports = router