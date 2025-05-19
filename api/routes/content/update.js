const express = require('express');
const router = express.Router();
const updateData = require('../../data/update.js');

router.post('/update_manga_content', (req, res, next) => {
    return res.status(200).json({success: true, message: 'nothing to update for now'});
});

router.post('/update_anime_content', (req, res, next) => {
    return res.status(200).json({success: true, message: 'nothing to update for now'});
});

module.exports = router;