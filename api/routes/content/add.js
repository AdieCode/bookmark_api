const express = require('express');
const router = express.Router();
const addData = require('../../data/add.js');

router.post('/add_manga_content', async (req, res) => { 
    return res.status(200).json({success: true, message: 'nothing to add for now'});
});

router.post('/add_anime_content', async (req, res) => { 
    return res.status(200).json({success: true, message: 'nothing to add for now'});
});

module.exports = router;
