const BookmarkDB = require('./pool.js');

const updateData = {
    // content
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

    updateReadableContentFieldsByContentId: async function(content_id, fields, callback) {
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
                WHERE content_id = $${index}
            `;

            values.push(content_id);

            const result = await BookmarkDB.query(query, values);

            if (result.rowCount > 0) {
                callback(null, true);
            } else {
                callback('No content found with the given content_id', false);
            }
        } catch (error) {
            console.error('Error updating content:', error);
            callback(error, false);
        }
    },

    updateWatchableContentFieldsById: async function(id, fields, callback) {
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
                UPDATE watchable_content
                SET ${setClauses.join(', ')}
                WHERE id = $${index}
            `;

            values.push(id);

            const result = await BookmarkDB.query(query, values);

            if (result.rowCount > 0) {
                callback(null, true);
            } else {
                callback('No content found with the given ID', false);
            }
        } catch (error) {
            console.error('Error updating content:', error);
            callback(error, false);
        }
    },

    updateWatchableContentFieldsByContentId: async function(content_id, fields, callback) {
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
                UPDATE watchable_content
                SET ${setClauses.join(', ')}
                WHERE content_id = $${index}
            `;

            values.push(content_id);

            const result = await BookmarkDB.query(query, values);

            if (result.rowCount > 0) {
                callback(null, true);
            } else {
                callback('No content found with the given content_id', false);
            }
        } catch (error) {
            console.error('Error updating content:', error);
            callback(error, false);
        }
    },

    //user content
    updateUserReadableContentFieldsById: async function(user_id, fields, callback) {
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
                UPDATE user_readable_content
                SET ${setClauses.join(', ')}
                WHERE user_id = $${index}
            `;

            values.push(user_id);

            const result = await BookmarkDB.query(query, values);

            if (result.rowCount > 0) {
                callback(null, true); // Successfully updated
            } else {
                callback('No user content found with the given ID', false); // No matching record found
            }
        } catch (error) {
            console.error('Error updating content:', error);
            callback(error, false);
        }
    },

    updateUserReadableContentFieldsByContentId: async function(content_id, fields, callback) {
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
                UPDATE user_readable_content
                SET ${setClauses.join(', ')}
                WHERE content_id = $${index}
            `;

            values.push(content_id);

            const result = await BookmarkDB.query(query, values);

            if (result.rowCount > 0) {
                callback(null, true);
            } else {
                callback('No user content found with the given content_id', false);
            }
        } catch (error) {
            console.error('Error updating content:', error);
            callback(error, false);
        }
    },

    updateUserWatchableContentFieldsById: async function(user_id, fields, callback) {
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
                UPDATE user_watchable_content
                SET ${setClauses.join(', ')}
                WHERE user_id = $${index}
            `;

            values.push(user_id);

            const result = await BookmarkDB.query(query, values);

            if (result.rowCount > 0) {
                callback(null, true);
            } else {
                callback('No user content found with the given ID', false);
            }
        } catch (error) {
            console.error('Error updating content:', error);
            callback(error, false);
        }
    },

    updateUserWatchableContentFieldsByContentId: async function(content_id, fields, callback) {
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
                UPDATE user_watchable_content
                SET ${setClauses.join(', ')}
                WHERE content_id = $${index}
            `;

            values.push(content_id);

            const result = await BookmarkDB.query(query, values);

            if (result.rowCount > 0) {
                callback(null, true);
            } else {
                callback('No user content found with the given content_id', false);
            }
        } catch (error) {
            console.error('Error updating content:', error);
            callback(error, false);
        }
    },
   
};

module.exports = updateData;