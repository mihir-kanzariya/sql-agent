require('dotenv').config();

const axios = require('axios');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // adjust path as needed
// const { generateKey } = require('crypto');
const crypto = require('crypto');



const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = 'http://localhost:3000/auth/google/callback';

// Redirect user to Google's OAuth 2.0 server

const googleAuth = (req, res) => {
    console.log("🚀 ~ User:", JSON.stringify(User, null, 2))
    console.log("🚀 ~ User:", User.findOne)
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
    res.redirect(url);
}

const callbackGoogleAuth = async (req, res) => {
    const { code } = req.query;
    try {
        // Exchange code for tokens
        const { data: { id_token, access_token } } = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code'
        });

        // Fetch user's profile
        const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        // Check if user exists in DB or create a new one
        let user = await User.findOne({ where: { google_id: profile.id } });
        if (!user) {
            user = await User.create({
                name: profile.name,
                email: profile.email,
                google_id: profile.id,
                picture: profile.picture
            });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Authentication failed');
    }
}

const generateApiKey = async (req, res) => {
    try {
        const apiKey = crypto.randomBytes(20).toString('hex');
        const userId = req.user.userId; // Assuming `req.user` contains the authenticated user's info
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.apiKey = apiKey; // Update the user's API key
        await user.save();

        res.status(200).json({ message: 'API Key generated successfully', apiKey: apiKey });
    } catch (error) {
        console.error('Error updating API key:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports = {
    googleAuth,
    callbackGoogleAuth,
    generateApiKey
};

