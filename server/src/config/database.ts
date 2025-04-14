import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize dotenv for environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Sequelize with TypeScript
const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'cad_block_viewer',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'vishal',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  models: [path.join(__dirname, '../models')], // Auto-load models
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});


export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;