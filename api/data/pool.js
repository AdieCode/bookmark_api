const { Pool } = require('pg');

let BookmarkDB
const DATABASE_URL = process.env.DATABASE_URL;
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;

if (process.env.NODE_ENV === 'PROD') {
    console.log('Connecting to production database');
    BookmarkDB = new Pool({
        connectionString: DATABASE_URL
    });
} else {
    console.log('Connecting to local database');
    BookmarkDB = new Pool({
        user: DB_USER,
        host: DB_HOST,
        database: DB_NAME,
        password: DB_PASSWORD,
        port: DB_PORT, 
    });
}

// BookmarkDB = new Pool({
//     user: DB_USER,
//     host: DB_HOST,
//     database: DB_NAME,
//     password: DB_PASSWORD,
//     port: DB_PORT, 
// });

module.exports = BookmarkDB;