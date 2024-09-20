const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const getData = require('../../data/get.js');
require('dotenv').config(); 

router.post('/check', (req, res, next) => {
    res.send({status:"this is the login path."});
});

router.post('/', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    // const date = new Date()
    getData.checkLogin(email, password, (err, response) => {
        const secret = process.env.JWT_KEY;
        if (err) {
            // Handle database error
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (response) {
            // Credentials are correct
            const user = { email: email }; // You can add more user info here
            const token = jwt.sign(user, secret, { expiresIn: '7d' });
            return res.status(200).json({ message: 'Login successful', token: token });
        } else {
            // Credentials are incorrect
            return res.status(401).json({ error: 'Invalid username or password' });
        }
    });

});


module.exports = router;