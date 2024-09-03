const { Pool } = require('pg');
const BookmarkDB = require('./pool.js');
const { hashPassword, checkPassword } = require('../utils/auth.js');


const updateData = {
    updateReadableContentAllFieldsById: async function(id, fields, callback) {
        try {
            const setClauses = [];
            const values = [];
            let index = 1;

            for (const [key, value] of Object.entries(fields)) {
                setClauses.push(`${key} = $${index}`);
                values.push(value);
                index++;
            }

            if (setClauses.length === 0) {
                callback('No fields provided for update', false);
                return;
            }

            const query = `
                UPDATE readable_content
                SET ${setClauses.join(', ')}
                WHERE id = $${index}
            `;

            values.push(id);

            const result = await BookmarkDB.query(query, values);

            if (result.rowCount > 0) {
                callback(null, true); // Successfully updated
            } else {
                callback('No content found with the given ID', false); // No matching record found
            }
        } catch (error) {
            console.error('Error updating content:', error);
            callback(error, false);
        }
    },

    // update dat based on id given and opdates the accordingly with the fields given.
    updateReadableContentFieldsById: async function(id, fields, callback) {
        try {
            const setClauses = [];
            const values = [];
            let index = 1;

            for (const [key, value] of Object.entries(fields)) {
                setClauses.push(`${key} = $${index}`);
                values.push(value);
                index++;
            }

            if (setClauses.length === 0) {
                callback('No fields provided for update', false);
                return;
            }

            const query = `
                UPDATE readable_content
                SET ${setClauses.join(', ')}
                WHERE id = $${index}
            `;

            values.push(id);

            const result = await BookmarkDB.query(query, values);

            if (result.rowCount > 0) {
                callback(null, true); // Successfully updated
            } else {
                callback('No content found with the given ID', false); // No matching record found
            }
        } catch (error) {
            console.error('Error updating content:', error);
            callback(error, false);
        }
    },
   
};


module.exports = { updateData };