const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pictures = sequelize.define('pictures', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    route: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    service_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'services',
            key: 'id',
        },
    },
}, {
    tableName: 'pictures',
    timestamps: true,
    underscored: true,
});

module.exports = Pictures;