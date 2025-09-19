const db = require("./db");

const TipoUsuario = db.sequelize.define("tipo_usuario",{

    id_tipo_usuario:{
        type:db.Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    tipo_usuario:{
        type:db.Sequelize.STRING
    },
     descricao:{
        type:db.Sequelize.STRING
    }
},{
    freezeTableName:true
});

module.exports = TipoUsuario