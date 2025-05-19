const express = require('express');
const router = express.Router();
const getData = require('../../data/get.js');
const enrich = require("../../utils/enrich.js");

router.get('/get_user_manga_content', async (req, res) => { 
    return res.status(200).json({success: true, message: 'nothing to get for now'});
});

router.get('/get_user_anime_content', async (req, res) => { 
    return res.status(200).json({success: true, message: 'nothing to get for now'});
});

module.exports = router;
