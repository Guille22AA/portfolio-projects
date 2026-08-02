const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// the table for the suggestions
const ChampionSuggestion = sequelize.define('ChampionSuggestion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true  },
  name: {
    type: DataTypes.STRING,
    allowNull: false  },
  anime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'championSuggestions',
  timestamps: false
});

module.exports = ChampionSuggestion;