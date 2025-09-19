const db = require("./db");

const Usuario = db.sequelize.define("usuario", {
    id_usuario: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    sobrenome: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    email: {
        type: db.Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    senha: {
        type: db.Sequelize.STRING(255),
        allowNull: false
    },
    telefone: {
        type: db.Sequelize.STRING(20),
        allowNull: true
    },
    foto: {
        type: db.Sequelize.STRING(255),
        allowNull: true
    }
}, {
    freezeTableName: true, // não deixa pluralizar (usuarios)
    
});


module.exports = Usuario;
