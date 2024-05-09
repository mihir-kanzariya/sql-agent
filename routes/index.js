const express = require('express');

const { callbackGoogleAuth, googleAuth, generateApiKey, registerUser, loginUser, verifyEmail } = require('../controllers/user.controller.js');
const { createModel, deleteModel, trainModel, ask, listAllModels, resetTrainingData, prepareFileForFineTune, askMySql } = require('../controllers/vector.controller.js');
const {    getByUserId, getByApiKeyId, findAllByUserId, deleteByApiKeyId, updateByApiKeyId, createApiKey } = require('../controllers/apikeys.controller.js');
const { presignedUrl, presignedUrlToRead } = require('../controllers/file.controller.js');
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
router.post('/login', loginUser );
router.get('/verify-email', verifyEmail)


router.post('/create-model/:modelName', verifyToken, createModel);
// router.post('/create-model/:userId/:modelName',verifyToken, createModel);
router.delete('/delete-model/:modelId',verifyToken, deleteModel);
router.get('/list-all-models',verifyToken, listAllModels);
router.delete('/reset-training-data/:modelId',verifyToken, resetTrainingData);


// apikeys CRID
router.get('/apikeys/user', verifyToken, getByUserId);
// router.get('/apikeys/:apiKeyId', verifyToken, getByApiKeyId);
router.get('/apikeys', verifyToken, findAllByUserId);
router.post('/apikeys', verifyToken, createApiKey);
router.delete('/apikeys/:apiKeyId', verifyToken, deleteByApiKeyId);
router.put('/apikeys/:apiKeyId', verifyToken, updateByApiKeyId);



// Train Model endpoint
router.post('/train-model',verifyApiKey, trainModel);
router.post('/fine-tune',verifyApiKey, trainModel);
router.get('/ask',verifyApiKey, ask);


// routes for Demo 
router.get('/presigned-url/:name', verifyToken, presignedUrl);
router.get('/presigned-url-read', verifyToken, presignedUrlToRead);
router.get('/train-my-sql',verifyToken, prepareFileForFineTune);
router.get('/ask-my-sql',verifyToken, askMySql);


// List All Models endpoint






module.exports = router;