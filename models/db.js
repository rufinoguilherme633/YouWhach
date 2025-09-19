const Sequelize = require("sequelize");
const sequelize = new Sequelize("youWhach","root","root",{
    host:"localhost",
    port:"3306",
    dialect:"mysql"
});

module.exports = {
    sequelize:sequelize,
    Sequelize:Sequelize
}