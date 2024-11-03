const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Comments = sequelize.define('comments', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    state: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    upgrade: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    habitat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'comments',
    timestamps: true,
    underscored: true,
});

module.exports = Comments;