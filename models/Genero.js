const db = require("./db");

const Genero = db.sequelize.define("genero",{

    id_genero:{
        type:db.Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    genero:{
        type:db.Sequelize.STRING
    },
     descricao:{
        type:db.Sequelize.STRING
    }
},{
    freezeTableName:true
});


module.exports = Genero;