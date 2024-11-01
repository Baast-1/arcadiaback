const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Hours = sequelize.define('hours', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    start: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    end: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, {
    tableName: 'hours',
    timestamps: true,
    underscored: true,
});

module.exports = Hours;