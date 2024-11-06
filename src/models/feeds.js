const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Feeds = sequelize.define('feeds', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
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
    tableName: 'feeds',
    timestamps: true,
    underscored: true,
});



module.exports = Feeds;
