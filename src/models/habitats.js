const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Habitats = sequelize.define('habitats', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'habitats',
    timestamps: true,
    underscored: true,
});

module.exports = Habitats;