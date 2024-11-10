const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const Pictures = require('./pictures');
const Habitats = require('./habitats');

const Animals = sequelize.define('animals', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    race: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    view: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    habitat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'animals',
    timestamps: true,
    underscored: true,
});



module.exports = Animals;
