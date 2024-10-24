// Import necessary modules
import { Sequelize } from 'sequelize';
import dbConfig from '../config/database.js';
import initUserModel from './user.js'; // Adjust based on your model location

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
};

// Import and initialize all models
db.user = initUserModel(sequelize, Sequelize);

// Apply associations if defined in models
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;
