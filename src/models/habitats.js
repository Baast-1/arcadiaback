const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const Pictures = require('./pictures');
const Comments = require('./comments');

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

Habitats.hasMany(Pictures, {
    foreignKey: 'habitat_id',
    as: 'pictures',
});

Habitats.hasMany(Comments, {
    foreignKey: 'habitat_id',
    as: 'comments',
});

module.exports = Habitats;