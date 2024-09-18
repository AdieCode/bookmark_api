const BookmarkDB = require('./pool.js');
const { checkPassword } = require('../utils/auth.js');


const getData = {
    checkUsername: async function(username) {
        // checks if username already exists
        try {
            const result = await BookmarkDB.query('SELECT * FROM users WHERE username = $1', [username]);
            return result.rows.length > 0;
        } catch (error) {
            console.error('Error checking username:', error);
            return false;
        }
    },

    checkEmail: async function(email) {
        // checks if email already exists
        try {
            const result = await BookmarkDB.query('SELECT * FROM users WHERE email = $1', [email]);
            return result.rows.length > 0;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    },

    checkLogin : function(email, password, callback) {
        BookmarkDB.query('SELECT * FROM users WHERE email = $1', [email], async (err, res) => {
            if (err) {
                console.error('Error checking login credentials:', err);
                callback(err, false);
                return;
            }
            
            // Check if any matching records were found
            if (res.rows.length > 0) {
                const isValidPassword = await checkPassword(password, res.rows[0].password);
                if (isValidPassword){
                    callback(null, true);
                } else {
                    callback(null, false);
                }
                // Credentials are correct
            } else {
                // No matching records found, credentials are incorrect
                callback(null, false);
            }
        });
    },

    getAllRows: async function(tableName) {
        try {
            const result = await BookmarkDB.query(`SELECT * FROM ${tableName}`);
            return result.rows; 
        } catch (error) {
            console.error(`Error retrieving all rows from table ${tableName}:`, error);
            throw error;
        }
    }
}

module.exports = getData;