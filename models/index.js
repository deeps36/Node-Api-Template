import { Sequelize } from 'sequelize';
import dbConfig from '../config/database.js';
import initUserModel from './user.js'; 

// Create a Sequelize instance
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.ssl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

// Initialize the database object to store models
const db = {
  Sequelize,
  sequelize,
  user: initUserModel(sequelize, Sequelize), // Initialize user model
};

// Apply associations if defined in models
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

// Export the database object
export default db;
