const { Pool } = require('pg');
// for prod
// const DATABASE_URL = process.env.DATABASE_URL;

// Connection pool configuration when online server deployed
// const codeSwitcher = new Pool({
//     connectionString: DATABASE_URL,
// });

// for dev
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;

const BookmarkDB = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT, 
});

module.exports = BookmarkDB;