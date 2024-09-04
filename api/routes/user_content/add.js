const express = require('express');
const router = express.Router();
const { addData } = require('../../data/add.js');
require('dotenv').config(); 

// add item to user list
router.post('/update_list', (req, res, next) => {
    const user_id = req.body.user_id;
    const content_id = req.body.content_id;
    const vol = req.body.vol;
    const chap = req.body.chap;
    const personal_score = req.body.personal_score;
    const content_status = req.body.content_status;

    addData.addUserReadableContent(user_id, content_id, vol, chap, personal_score, content_status, (err, response) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error: ' + err });
        }

        if (response) {
            return res.status(200).json({ message: 'User list updated successful', succes: true });
        } 
    });
});

// Add readable content to the database
router.post('/add_content', (req, res, next) => {
    const anilist_content_id = req.body.anilist_content_id;
    const title = req.body.title;
    const description = req.body.description;
    const cover_image_url = req.body.cover_image_url;
    const release_date = req.body.release_date;
    const type = req.body.type;

    addData.addReadableContent(anilist_content_id, title, description, cover_image_url, release_date, type, (err, response) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error: ' + err });
        }

        if (response) {
            return res.status(200).json({ message: 'Content added successfully', success: true });
        } else {
            return res.status(400).json({ error: 'Failed to add content' });
        }
    });
});

module.exports = router;