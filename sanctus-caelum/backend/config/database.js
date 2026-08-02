// set up the DB connection
const { Sequelize } = require('sequelize');
const path = require('path');

// the connection object for the sqlite database
// it points to the local db file in the backend folder
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../sanctus_caelum.db')
});

// exporting it so other files can reuse the same connection
module.exports = sequelize;