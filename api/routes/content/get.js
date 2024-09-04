const express = require('express');
const router = express.Router();
const getManga = require("../../utils/aniList.js");

router.get('/get_content', async (req, res) => {  // Mark the function as async

    console.log("this tan")
    try {
      const value = await getManga();  // Await the asynchronous function
      res.json(value);  // Send the JSON object as the response
    } catch (error) {
      res.status(500).send('Error occurred: ' + error.message);
    }
});

module.exports = router;