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
        const user = await Model.create({
            name: modelName,
            user_id: req.user.userId
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
        const userId = req.user.userId
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
        const { modelId, question } = req.query;
        const userId = req.user.userId;

        const relatedSchema = await similaritySearch(question, 10, modelId, userId, "SCHEMA");
        const relatedRelations = await similaritySearch(question, 2, modelId, userId, "RELATIONS");
        const relatedSql = await similaritySearch(question, 8, modelId, userId, "SQL");

        const mergedSchema = relatedSchema.map(obj => obj.content).join(' ___________________');
        const mergedRelations = relatedRelations.map(obj => obj.content).join('___________________ ');

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

