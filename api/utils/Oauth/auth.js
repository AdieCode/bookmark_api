const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const qs = require('querystring');
require('dotenv').config(); 

const idCheck = require('./idCheck.js'); // Import the idCheck module

const secret = process.env.JWT_KEY; // JWT secret

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI; // Google OAuth callback

// GitHub OAuth client details
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const githubRedirectUri = process.env.GITHUB_REDIRECT_URI; // This should match what you set in GitHub OAuth settings

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
        const authHeader = req?.headers?.authorization;
        
        if(!authHeader){
            return res.status(401).json({ auth: false, error: 'Token not provided' });
            
        } else if(!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ auth: false, error: 'invalid token provided, Bearer is missing ' });
        }
    
        const token = authHeader.replace('Bearer ', '');
    
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                console.error(err)
                return res.status(401).json({ auth: false, error: 'Unauthorized, you are not authorized to access this endpoint' });
            }
            console.log(decoded)
            req.user = decoded;
            next();
        });

    } catch (error) {
        console.log("Error occurred :", error)
        return res.status(500).json({ auth: false, error: 'No token provided' });
    }
};

// Google OAuth flow
const googleOAuth = async (req, res) => {
    const code = req.query.code;
    
    if (!code) {
        return res.status(400).json({ error: 'Code not provided' });
    }

    try {
        // Exchange the code for an access token
        const tokenResponse = await axios.post(
            'https://oauth2.googleapis.com/token',
            qs.stringify({
                client_id: googleClientId,
                client_secret: googleClientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: googleRedirectUri,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const { access_token, id_token } = tokenResponse.data;

        if (!access_token || !id_token) {
            return res.status(400).json({ error: 'Unable to authenticate with Google' });
        }

        // Use the id_token to get user details from Google
        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const googleUser = userResponse.data;

        const userData = await idCheck.checkIfGoogleUserExists(googleUser);

        const user = {
            Oauth: true,
            id: userData?.id,
            username: userData?.username,
            status: 'active'
        };

        // Generate JWT for authenticated user
        const token = jwt.sign(user, secret, { expiresIn: '7d' });

        // Redirect user to front-end with the token (optional)
        res.redirect(`${process.env.FRONTEND_URL}/google/callback?token=${token}`);

    } catch (error) {
        console.error('Google OAuth error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to authenticate with Google' });
    }
};


// GitHub OAuth flow
const githubOAuth = async (req, res) => {
    const code = req.query.code;
    
    if (!code) {
        return res.status(400).json({ error: 'Code not provided' });
    }

    try {
        // Exchange the code for an access token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: githubClientId,
                client_secret: githubClientSecret,
                code: code,
                redirect_uri: githubRedirectUri,
            },
            {
                headers: {
                    accept: 'application/json',
                },
            }
        );
        
        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res.status(400).json({ error: 'Unable to authenticate with GitHub' });
        }

        // Use the access token to get user details from GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const githubUser = userResponse.data;
        
        const userData = await idCheck.checkIfGithubUserExists(githubUser);

        const user = {
            Oauth: true,
            id: userData.id,
            username: userData.username,
            status: 'active'
        };

        // Generate JWT for authenticated user
        const token = jwt.sign(user, secret, { expiresIn: '7d' });

        // Redirect user to front-end with the token (optional)
        res.redirect(`${process.env.FRONTEND_URL}/github/callback?token=${token}`);

    } catch (error) {
        console.error('GitHub OAuth error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to authenticate with GitHub' });
    }
};

module.exports = { hashPassword, checkPassword, isAuthenticated, googleOAuth, githubOAuth};
