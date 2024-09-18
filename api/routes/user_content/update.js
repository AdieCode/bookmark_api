const express = require('express');
const router = express.Router();
const { updateData } = require('../../data/update.js');
require('dotenv').config(); 

// add item to user list
router.post('/update_readable_list_item', (req, res, next) => {
    const id = req.body.user_id;
    const content_id = req.body.content_id;
    const vol = req.body.vol;
    const chap = req.body.chap;
    const personal_score = req.body.personal_score;
    const content_status = req.body.content_status;

    updateData.updateReadableContentAllFieldsById(user_id, content_id, vol, chap, personal_score, content_status, (err, response) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error: ' + err });
        }

        if (response) {
            return res.status(200).json({ message: 'User list updated successful', succes: true });
        } 
    });
});

module.exports = router;