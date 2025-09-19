const db = require("./db");

const GeneroVideo = db.sequelize.define("genero_video",{

    id_genero_video:{
        type:db.Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    genero_video:{
        type:db.Sequelize.STRING
    },
     descricao:{
        type:db.Sequelize.STRING
    }
},{
    freezeTableName:true
});

module.exports = GeneroVideo