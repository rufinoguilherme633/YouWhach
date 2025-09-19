const db = require("./db");

const Video = db.sequelize.define("video", {
    id_video: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    titulo: {
        type: db.Sequelize.STRING(255),
        allowNull: false
    },
    descricao: {
        type: db.Sequelize.STRING(255),
        allowNull: false
    },
    caminho:{
        type: db.Sequelize.STRING(255),
        allowNull: false
    },
    thumbnail :{
        type: db.Sequelize.STRING(255),
        allowNull: false
    },
    views: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    freezeTableName: true, // evita plural automático (videos)
    
});


module.exports = Video;
