
// const ApiKey = require('../models/apikey.model');
const { ApiKey } = require('../models'); // adjust path as needed
const crypto = require('crypto');


// Import necessary modules and models

// Controller to get API keys by user_id
const getByUserId = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log("🚀 ~ getByUserId ~ userId:", userId)

        const apiKeys = await ApiKey.findAll({ userId });

        // Write proper response when necessary

        
        return res.status(200).json({
            status: 'success',
            message: `ApiKey fetched successfully.`,
            data: apiKeys
            
        });
    } catch (error) {
        // Handle error and write proper response
        return res.status(400).json({
                status: 'error',
                message: `Internal Server Error.`
            });
    }
};
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
// Controller to create a new API key
const createApiKey = async (req, res) => {
    
    // await sleep(10000)
    try {
        const userId = req.user.userId;
        console.log("🚀 ~ createApiKey ~ userId:", userId)
        
        // Create a new API key
        const newApiKey = new ApiKey({
            user_id: userId,
            name: 'Default',
            key: crypto.randomBytes(20).toString('hex')
        });
        
        // Save the new API key to the database
        const savedApiKey = await newApiKey.save();
        
        // Write proper response when necessary
        return res.status(201).json({
            status: 'success',
            message: 'API key created successfully.',
            data: savedApiKey
        });
    } catch (error) {
        // Handle error and write proper response
        return res.status(400).json({
            status: 'error',
            message: error.message || 'Internal Server Error.'
        });
    }
};

// Controller to get API keys by apikey_id
const getByApiKeyId = async (req, res) => {
    try {
        const { apikey_id } = req.params;
    

        // Add validations for apikey_id if needed
        if (!apikey_id) {
            throw new Error('Invalid apikey_id');
        }

        const apiKey = await ApiKey.findById(apikey_id);

        // Write proper response when necessary

        return res.status(200).json({
            status: 'success',
            message: `ApiKey fetched successfully.`,
            data: apiKey
            
        });
       
    } catch (error) {
        // Handle error and write proper response
        return res.status(400).json({
                status: 'error',
                message: `Internal Server Error.`
            });
    }
};

// Controller to get all API keys
const findAllByUserId = async (req, res) => {
    try {
        const userId = req.user.userId;

        
        // Add validations for userId if needed

        const apiKeys = await ApiKey.findAll({ userId });

        // Write proper response when necessary

        return res.status(200).json({
            status: 'success',
            message: `ApiKey fetched successfully.`,
            data: apiKey
            
        });
        
    } catch (error) {
        // Handle error and write proper response
        return res.status(400).json({
                status: 'error',
                message: `Internal Server Error.`
            });
    }
};

// Controller to delete API key by apikey_id
const deleteByApiKeyId = async (req, res) => {
    try {
        const { apikey_id } = req.params;

        // Add validations for apikey_id if needed

        await ApiKey.findByIdAndDelete(apikey_id);

        // Write proper response when necessary

        return res.status(200).json({
            status: 'success',
            message: `Apikey: ${apikey_id} deleted successfully.`,
            // data: apiKey
            
        });
       
    } catch (error) {
        // Handle error and write proper response
        return res.status(400).json({
                status: 'error',
                message: `Internal Server Error.`
            });
    }
};

// Controller to update API key by apikey_id
const updateByApiKeyId = async (req, res) => {
    try {
        const { apikey_id } = req.params;
        const { body } = req;

        // Add validations for apikey_id and body if needed

        const updatedApiKey = await ApiKey.findByIdAndUpdate(apikey_id, body, { new: true });

        // Write proper response when necessary

        return res.status(200).json({
            status: 'success',
            message: `APIkey: ${apikey_id} updated successfully.`,
            data: updatedApiKey
            
        });
       
    } catch (error) {
        // Handle error and write proper response
        return res.status(400).json({
                status: 'error',
                message: `Internal Server Error.`
            });
    }
};


// Export the controller functions
module.exports = {
    getByUserId,
    getByApiKeyId,
    findAllByUserId,
    deleteByApiKeyId,
    updateByApiKeyId,
    createApiKey
};