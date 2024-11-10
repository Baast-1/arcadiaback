const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Reports = sequelize.define('reports', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    feed: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    grammage: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    detailState: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    animal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'reports',
    timestamps: true,
    underscored: true,
});



module.exports = Reports;
