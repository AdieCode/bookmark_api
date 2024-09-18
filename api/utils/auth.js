const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const secret = process.env.JWT_KEY; // Use the same secret key used in your JWT creation

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

async function checkPassword(inputPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(inputPassword, hashedPassword);
        if (match) {
            return true;
    
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
}

const isAuthenticated = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if(!authHeader){
            throw new Error("No token provided");
            
        } else if(!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ auth: false, error: 'invalid token provided, Bearer is missing ' });
        }
    
        const token = authHeader.replace('Bearer ', '');
    
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                return res.status(401).json({ auth: false, error: 'Unauthorized, you are not authorized to access this endpoint' });
            }
            req.user = decoded;
            next();
        });

    } catch (error) {
        console.log("Error occurred :", error)
        return res.status(500).json({ auth: false, error: 'No token provided' });
    }
};

module.exports = { hashPassword, checkPassword, isAuthenticated };
