
const { User, ApiKey} = require('../models'); // adjust path as needed


async function verifyApiKey(req, res, next) {
    const xApiKey = req.headers['x-api-key'];
    console.log("🚀 ~ verifyxApiKey ~ xApiKey:", xApiKey)
    if (!xApiKey) {
        return res.status(401).json({ message: 'API key is required' });
    }

    try {

        const apiKey = await ApiKey.findOne({where: { key: xApiKey}});
        console.log("🚀 ~ verifyApiKey ~ apiKey:", apiKey)

        if (!apiKey) {
            return res.status(401).json({ message: 'Invalid API key' });
        }


        const user = await User.findOne({
            where: { id: apiKey.user_id }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid user' });
        }

        console.log("🚀 ~ verifyApiKey ~ user:", user)
        delete user.dataValues.password; // Remove password from the user object
        // delete user.dataValues.apiKey; // Remove password from the user object
        // Optionally, you can attach the user to the request for further use in the route handler
        req.user = user;
        next();
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    verifyApiKey
};
