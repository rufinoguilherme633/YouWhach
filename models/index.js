const Usuario = require("./Usuario");
const Video = require("./Video");
const GeneroVideo = require("./GeneroVideo");
const TipoUsuario = require("./TipoUsuario");
const Genero = require("./Genero")
// Relacionamentos
    Usuario.belongsTo(TipoUsuario, { foreignKey: "id_tipo_usuario" });
    TipoUsuario.hasMany(Usuario, { foreignKey: "id_tipo_usuario" });

Video.belongsTo(Usuario, { foreignKey: "id_usuario", onDelete: "CASCADE" });
Usuario.hasMany(Video, { foreignKey: "id_usuario" });

Video.belongsTo(GeneroVideo, { foreignKey: "id_genero_video" });
GeneroVideo.hasMany(Video, { foreignKey: "id_genero_video" });


Usuario.belongsTo(Genero, { foreignKey: "id_genero" });
Genero.hasMany(Usuario, { foreignKey: "id_genero" });

module.exports = { Usuario, Video, GeneroVideo, TipoUsuario, Genero };
