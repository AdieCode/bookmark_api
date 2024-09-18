const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const addData = require('../../data/add.js');
require('dotenv').config(); 

router.post('/check', (req, res, next) => {
    res.send({status:"this is the sign-up path."});
});

router.post('/', (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    addData.addUser(username, email, password, (err, response) => {
        const secret = process.env.JWT_KEY;
        if (err) {
            // Handle database error
            return res.status(500).json({ error: 'Internal server error: ' + err });
        }

        if (response) {
            // Credentials are correct
            const user = { email: email }; // used for jwt generation can add more info if you want to
            const token = jwt.sign(user, secret, { expiresIn: '1d' });
            return res.status(200).json({ message: 'Sign-up successful', token: token });
        } else {
            // Credentials are incorrect
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

module.exports = router;