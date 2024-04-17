const express = require('express');

const { callbackGoogleAuth, googleAuth, generateApiKey, registerUser } = require('../controllers/user.controller.js');
const { createModel, deleteModel, trainModel, ask, listAllModels } = require('../controllers/vector.controller.js');
const {verifyToken} = require('../middleware/authMiddleware.js'); // adjust the path as necessary
const {verifyApiKey} = require('../middleware/verifyApiKey.js'); // adjust the path as necessary
const { createModelSchema } = require('../controllers/validator.js');

// const { celebrate } = require('celebrate'); 



const router = express.Router();


// Register and Login APIs
router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', callbackGoogleAuth);
router.post('/user/apikey',verifyToken, generateApiKey );
router.post('/register', registerUser );


router.post('/create-model/:userId/:modelName', verifyToken, createModel);
router.post('/create-model/:userId/:modelName',verifyToken, createModel);
router.delete('/delete-model/:modelId',verifyToken, deleteModel);
router.get('/list-all-models',verifyToken, listAllModels);



// Test endpoint
router.get('/ask',verifyApiKey, ask);
// Create Model endpoint

// Delete Model endpoint

// Train Model endpoint
router.post('/train-model',verifyApiKey, trainModel);

// List All Models endpoint






module.exports = router;