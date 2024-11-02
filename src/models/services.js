const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const Pictures = require('./pictures');

const Services = sequelize.define('services', {
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
    tableName: 'services',
    timestamps: true,
    underscored: true,
});

Services.hasMany(Pictures, {
    foreignKey: 'service_id',
    as: 'pictures',
});

module.exports = Services;