require('dotenv').config();
const { ApiKey } = require('../models'); // adjust path as needed
const {sendVerificationEmail, sendEmail} = require("../helper/helper")
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { User, Model } = require('../models'); // adjust path as needed
// const { generateKey } = require('crypto');
const crypto = require('crypto');
// const  = require("")


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.NODE_ENV == 'development' ? `http://localhost:3000/auth/google/callback` : `${process.env.GOOGLE_REDIRECT_URI}/auth/google/callback`;

console.log("🚀 ~ NODE_ENV:", process.env.NODE_ENV)
console.log("🚀 ~ GOOGLE_REDIRECT_URI:", GOOGLE_REDIRECT_URI)
// Redirect user to Google's OAuth 2.0 server
let googleAuth = (req, res) => {
    console.log("🚀 ~ User:", JSON.stringify(User, null, 2))
    console.log("🚀 ~ User:", User.findOne)
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
    return res.redirect(url);
}

const callbackGoogleAuth = async (req, res) => {
    const { code, geography } = req.query;
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
            console.log("Creating new user...")
            user = await User.create({
                name: profile.name,
                email: profile.email,
                google_id: profile.id,
                picture: profile.picture,
                disable: false,
                geography: geography || 'US',
                lastLoggedInDate: new Date(),
                verified:true
            });

           let model =  await Model.create({
                name: 'default_opensql',
                user_id: user.id
            });
           console.log("🚀 ~ callbackGoogleAuth ~ model:", model)
        }
        
        
        // below statment is not working
        let aa = await User.update({ lastLoggedInDate: new Date() }, {
            where: { id: user.id }
        });
        
        console.log("updating last login date", aa)
        delete user.dataValues.password; // Remove password from the user object

        // Generate JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '6h' });

        return res.json({ token, user });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Authentication failed');
    }
}

const registerUser = async (req, res) => {
    const { email, password, geography } = req.body;

    // Validate email and password
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.trim() === '') {
        return res.status(400).json({ message: 'Password cannot be empty' });
    }

    // Rest of the code...

    try {
        // Check if user with the same email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        
        // Create the user
        const user = await User.create({
            name: email?.split("@")[0] ,
            email,
            password: hashedPassword,
            geography: geography || 'US',
            // verificationToken,
            // verified: false
            // default geography
            // other user properties
        });
        const verificationToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await Model.create({
            name: 'default_opensql',
            user_id: user.id
        });
        // console.log("Updating verifaction token")
        // await User.update(
        //     { verificationToken: verificationToken,verified: false },
        //     { where: { id: user.id } }
        //   )
        // console.log("DONE: Updating verifaction token")

        user.verificationToken= verificationToken
        user.verified= false

        await user.save()

        // Generate a verification token

        // Sending the verification email using Brevo
        let isSent = await sendVerificationEmail(email, verificationToken);


        // ... code to send verification email ...
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '6h' });

        return res.status(201).json({ token, user, message: 'User registered successfully', email: isSent });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🚀 ~ verifyEmail ~ decoded:", decoded)

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            // return res.status(404).json({ message: 'User not found' });
        return res.redirect(`${GOOGLE_REDIRECT_URI}?verified=false&msg=User not found`);

        }

        // Update user's verified status
        user.verified = true;
        user.verificationToken = null;
        await user.save();

        return res.redirect(`${GOOGLE_REDIRECT_URI}?verified=true&msg=success fully verifies`);
        // res.redirect(`https://opensql.ai`);
    } catch (error) {
        console.error('Error verifying email:', error);
        return res.redirect(`${GOOGLE_REDIRECT_URI}?verified=false&msg=Invalid or expired token`);

        return res.status(400).json({ message: 'Invalid or expired token' });
    }
}

const resetPassword =  async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.trim() === '') {
        return res.status(400).json({ message: 'Password cannot be empty' });
    }

    try {
        // Verify and decode the JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the decoded token ID
        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Update the user's password
        await user.update({ password: hashedPassword, verificationToken: null });

        res.json({ message: 'Your password has been successfully reset. Please log in with your new password.' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Reset token has expired, please request a new one.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid reset token. Please ensure you have the correct URL or request a new one.' });
        }
        console.error('Reset Password Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
  
  const forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Validate the email
    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Valid email is required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            // Note: In production, you might want to avoid sending specific messages about email existence
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token with JWT
        const resetToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Token expires in 15 min
        );

        // Create reset URL (Adjust the URL as necessary for your front-end route)
        const resetUrl = `${process.env.GOOGLE_REDIRECT_URI}/reset-password/${resetToken}`;

        // Send the email
        const emailSubject = 'Password Reset Request';
        const emailBody = `You have requested a password reset. Please go to the following link to reset your password: <a href="${resetUrl}">Reset</a>`;

        await sendEmail(emailBody, emailSubject, email);

        res.json({ message: 'If your email address exists in our database, you will receive a password reset link shortly.' });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    // Validate email and password
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.trim() === '') {
        return res.status(400).json({ message: 'Password cannot be empty' });
    }
    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify the password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (user.password !== hashedPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        if (!user.verified) {
            return res.status(401).json({ message: 'Verify Email.' });
        }


        // Update lastLoggedInDate
        user.lastLoggedInDate = new Date();
        await user.save();

        // Generate JWT
        const token = jwt.sign({ userId: user.id, verified: user.verified }, process.env.JWT_SECRET, { expiresIn: '6h' });
        return res.json({ token, user });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



const generateApiKey = async (req, res) => {
    try {
        const apiKey = crypto.randomBytes(20).toString('hex');
        const userId = req.user.userId; // Assuming `req.user` contains the authenticated user's info
        const user = await User.findByPk(userId);
        console.log("🚀 ~ generateApiKey ~ userId:", userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.apiKey = apiKey; // Update the user's API key
        await user.save();
        
        return res.status(200).json({ message: 'API Key generated successfully', apiKey: apiKey });
    } catch (error) {
        console.error('Error updating API key:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
// See i want very simple one UI, which make your job easy and fit my budget. 
const verifyMail = async (req, res) => {
    const { email } = req.body;
    // Validate email
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');
        user.verificationToken = verificationToken;
        await user.save();
        // Send verification email with the verification link
        const verificationLink = `${process.env.BASE_URL}/verify?token=${verificationToken}`;
        // ... code to send verification email with the verificationLink ...
        return res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        console.error('Error sending verification email:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = {
    googleAuth,
    callbackGoogleAuth,
    generateApiKey,
    registerUser,
    loginUser,
    verifyEmail,
    resetPassword, forgotPassword
};

