// const { 
//     listAllClasses,
//     // similaritySearch,
//     createWeaviateRecord,
//     createWeaviateClass,
//     deleteSchema} = require('../vectordb/weaviate.js');
const { generateEmbeddings, similaritySearch, generateSQL } = require('../vectordb/supabase.js');
const { createChunk } = require('../helper/helper.js');

const { generateSQLPrompt, createChatMessages } = require('../prompt/index.js');

const { Model } = require('../models'); // adjust path as needed
const Joi = require('joi');




const createModel = async (req, res) => {
    try {
        const { modelName } = req.params;

        // Validation for modelName
        const modelNameRegex = /^[a-zA-Z_]+$/;
        if (!modelNameRegex.test(modelName)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid modelName. Only lowercase, uppercase, and underscore characters are allowed.'
            });
        }

        const existingModel = await Model.findOne({
            where: {
                name: modelName,
                user_id: req.user.id
            }
        });

        if (existingModel) {
            return res.status(400).json({
                status: 'error',
                message: `Model with name ${modelName} already exists for this user.`
            });
        }

        const user = await Model.create({
            name: modelName,
            user_id: req.user.id
        });
        // await createWeaviateClass(modelName);
        res.json({
            status: 'success',
            message: `Model: ${modelName} created successfully.`,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error creating vector class.',
            error: error.message
        });
    }
};


const deleteModel = async (req, res) => {
    try {
        const { modelId } = req.params;
        // Validation for modelId
        if (!modelId || typeof modelId !== 'string') {
            return res.status(400).json({
            status: 'error',
            message: 'Invalid modelId. It should be a non-empty string.'
            });
        }
        const userId = req.user.userId;
        const deletedModel = await Model.destroy({
            where: {
                id: modelId,
                user_id: userId
            }
        });
        if (deletedModel === 0) {
            return res.status(404).json({
                status: 'error',
                message: `Model with ID ${modelId} not found.`
            });
        }
        res.json({
            status: 'success',
            message: `Model with ID ${modelId} deleted successfully.`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting model.',
            error: error.message
        });
    }
};


const trainModel = async (req, res) => {
    try {
        const { modelId, documentation, trainingDataType } = req.body;

        // Validation for documentation
        // if (!Array.isArray(Array.from(documentation)) || !Array.from(documentation).every(doc => typeof doc === 'string')) {
        //     return res.status(400).json({
        //     status: 'error',
        //     message: 'Invalid documentation. It should be an array of strings.'
        //     });
        // }

        // Validation for trainingDataType
        if (!trainingDataType || typeof trainingDataType !== 'string') {
            return res.status(400).json({
            status: 'error',
            message: 'Invalid trainingDataType. It should be a non-empty string.'
            });
        }
        if (!modelId || typeof modelId !== 'string') {
            return res.status(400).json({
            status: 'error',
            message: 'Invalid modelId. It should be a non-empty string.'
            });
        }
        const userId = req.user.id
        const isSQL = trainingDataType === 'SQL'
        let docForSQL = []
        if (isSQL) {
            docForSQL = documentation.map((doc) => `${doc.question} ${doc.DDL}`)
        }

        let chunks = await createChunk((isSQL ? docForSQL : documentation), isSQL)
        await generateEmbeddings(chunks, modelId, userId, trainingDataType, documentation)
        
        res.status(200).json({
            status: 'success',
            message: `Vector record created successfully in model: ${documentation}.`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error creating vector record.',
            error: error.message
        });
    }
};


const ask = async (req, res) => {
    try {
        const { modelName, question } = req.query;
        const userId = req.user.id;
        // Validation for question
        if (!question || typeof question !== 'string') {
            return res.status(400).json({
            status: 'error',
            message: 'Invalid question. It should be a non-empty string.'
            });
        }
        

        if (!modelName || typeof modelName !== 'string') {
            return res.status(400).json({
            status: 'error',
            message: 'Invalid modelId. It should be a non-empty string.'
            });
        }

        const model = await Model.findOne({
            where: {
                name: modelName,
                user_id: userId
            }
        });

        if (!model) {
            return res.status(404).json({
                status: 'error',
                message: `Model with name ${modelName} not found.`
            });
        }

        const modelId = model.id;

        const relatedSchema = await similaritySearch(question, 10, modelId, userId, "SCHEMA");
        const relatedRelations = await similaritySearch(question, 2, modelId, userId, "RELATIONS");
        const relatedSql = await similaritySearch(question, 8, modelId, userId, "SQL");

        const mergedSchema = relatedSchema.map(obj => obj.content).join(' ');
        const mergedRelations = relatedRelations.map(obj => obj.content).join(' ');

        const mergedSql = relatedSql && relatedSql.length > 0 ? relatedSql.slice(0, relatedSql.length > 3 ? 3 : relatedSql.length).map(obj => `\nReference Question:  ${obj.question}\nReference Answer: ${obj.content}`).join(' ') : '';

        const SysPrompt = generateSQLPrompt(mergedSchema, mergedRelations, mergedSql);
        const messages = createChatMessages(SysPrompt, question, relatedSql);
        const sql = await generateSQL(SysPrompt, messages);

        res.send(sql);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving similar items.',
            error: error.message
        });
    }
};

const listAllModels = async (req, res) => {
    try {
        const models = await Model.findAll({
            where: {
                user_id: req.user.userId
            }
        });
        res.json(models);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error listing all models.',
            error: error.message
        });
    }
};



module.exports = {
    createModel,
    deleteModel,
    trainModel,
    ask,
    listAllModels
};

