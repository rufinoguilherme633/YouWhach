const db = require("./models/db");
const { Usuario, Video, GeneroVideo, TipoUsuario ,Genero} = require("./models");
const GeneroController = require("./controllers/GeneroController");
const GeneroVideoController = require("./controllers/GeneroVideoController");
const TipoUsuarioController = require("./controllers/TipoUsuarioController");
const UsuarioController = require('./controllers/UsuarioController')
const VideoController = require("./controllers/VideoController")
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path")

const session = require("express-session")

const app = new express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public"))); // <- aqui

app.engine("handlebars", handlebars.engine({
    defaultLayout:'main',
    layoutsDir: path.join(__dirname,'views/layouts'),
    partialsDir: path.join(__dirname, "views/partials")
}))

app.set('view engine', 'handlebars');



app.use(session({
    secret: "asdfghjkjhgfdfg",
    resave: false,              // não salva a sessão se não houve alterações
    saveUninitialized: false,   // não cria sessão até que algo seja armazenado
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hora
        secure: false            // true só em produção com HTTPS
    }
}));
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});
app.use("/genero",GeneroController );
app.use("/tipoUsuario",TipoUsuarioController);
app.use("/generoVideo",GeneroVideoController);
app.use("/video",VideoController);
app.use("/usuario",UsuarioController)

app.get("/login", (req,res) => {
    res.render("login", {noLayout:true, noHeader:true})
})
// criar os databases

// db.sequelize.sync({ force: true })
//    .then(() => console.log("Tabelas criadas com sucesso"))
//    .catch(err => console.error("Erro ao criar tabelas:", err));

app.post("/logar", async (req, res) => {
    const { email, password } = req.body;
console.log(req.body);

    try {
        const usuario = await Usuario.findOne({
            where: {
                email: email,
                senha: password // ⚠️ ideal seria usar hash (bcrypt), não senha pura
            }
        });

        if (!usuario) {

            console.log("E-mail ou senha inválidos")
            return res.status(401).json({ error: "E-mail ou senha inválidos" });
        }



        // Salva dados mínimos na sessão
        req.session.user = {
            id: usuario.id_usuario,
           nome: usuario.nome,
            tipo: usuario.id_tipo_usuario, // se tiver esse campo
            foto:usuario.foto
        };

        console.log(req.session.user);

        res.redirect("/video"); 

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});



app.get('/criarConta',(req,res)=>{
    
    res.render('criarConta',{noLayout:true, noHeader:true})
})


app.get('/configuracoes',(req,res)=>{
    
    res.render('configuracoes',{ userId: req.session.user.id })
})





const port = 8080

app.listen(port, () => {
    console.log("Servidor ligado")
})