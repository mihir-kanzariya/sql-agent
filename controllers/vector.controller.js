// const { 
//     listAllClasses,
//     // similaritySearch,
//     createWeaviateRecord,
//     createWeaviateClass,
//     deleteSchema} = require('../vectordb/weaviate.js');
const { generateEmbeddings, similaritySearch, generateSQL, generateEmbeddingsForQuestion } = require('../vectordb/supabase.js');
const { createChunk, prepareArrayOfStringForFinetune, processDataset } = require('../helper/helper.js');
const axios = require('axios');

const { supabaseClient } = require('../vectordb/supabaseClient.js');

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

        console.log("🚀 ~ createModel ~ req.user:", req.user)
        const existingModel = await Model.findOne({
            where: {
                name: modelName,
                user_id: req.user.userId
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
            user_id: req.user.userId
        });
        // await createWeaviateClass(modelName);
        return res.json({
            status: 'success',
            message: `Model: ${modelName} created successfully.`,
            data: user
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
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
        return res.json({
            status: 'success',
            message: `Model with ID ${modelId} deleted successfully.`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error deleting model.',
            error: error.message
        });
    }
};


const trainModel = async (req, res) => {
    try {
        const { modelName, documentation, trainingDataType } = req.body;

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
        if (!modelName || typeof modelName !== 'string') {
            return res.status(400).json({
            status: 'error',
            message: 'Invalid modelId. It should be a non-empty string.'
            });
        }
        const userId = req.user.id

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
        const isSQL = trainingDataType === 'SQL'
        let docForSQL = []
        if (isSQL) {
            docForSQL = documentation.map((doc) => `${doc.question} ${doc.DDL}`)
        }

        let chunks = await createChunk((isSQL ? docForSQL : documentation), isSQL)
        await generateEmbeddings(chunks, modelId, userId, trainingDataType, documentation, null)
        
        return res.status(200).json({
            status: 'success',
            message: `Vector record created successfully in model: ${documentation}.`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
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
        const embeddings = generateEmbeddingsForQuestion(question)
        const [relatedSchema, relatedRelations, relatedSql] = await Promise.all([
            similaritySearch(embeddings, 10, modelId, userId, "SCHEMA", fileId, 'ui'),
            similaritySearch(embeddings, 2, modelId, userId, "RELATIONS", fileId, 'ui'),
            similaritySearch(embeddings, 8, modelId, userId, "SQL", fileId, 'ui')
        ]);
        const mergedSchema = relatedSchema.map(obj => obj.content).join(' ');
        const mergedRelations = relatedRelations.map(obj => obj.content).join(' ');

        const mergedSql = relatedSql && relatedSql.length > 0 ? relatedSql.slice(0, relatedSql.length > 3 ? 3 : relatedSql.length).map(obj => `\nReference Question:  ${obj.question}\nReference Answer: ${obj.content}`).join(' ') : '';

        const SysPrompt = generateSQLPrompt(mergedSchema, mergedRelations, mergedSql);
        const messages = createChatMessages(SysPrompt, question, relatedSql);
        const sql = await generateSQL(SysPrompt, messages);

        return res.status(200).json({
            status: 'Success',
            data: { sql },
            message: `SQL generated successfully for question: ${question}`
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
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
        console.log("🚀 ~ listAllModels ~ models:", models.length)
        console.log("🚀 ~ listAllModels ~ models:", models[0])
        // delete models[0]
        // let result = [];
        // for (let i = 0; i < models.length; i++) {
        //     const model = models[i];
        //     console.log("-------------")
        //     console.log("🚀 ~ listAllModels ~ model:", model)
        //     console.log("🚀 ~ listAllModels ~ req.user.userId:", req.user.userId)
        //     console.log("🚀 ~ listAllModels ~  model.dataValues.id:",  model.dataValues.id)
        //     const { data, error } = await supabaseClient
        //     .from('chatgpt')
        //     .select('')
        //     .eq('user_id', req.user.userId)
        //     .eq('model_id', model.dataValues.id);
        //     console.log("🚀 ~ listAllModels ~ error:", error)
            
        //     console.log("🚀 ~ listAllModels ~ data:", data)
        //     model.dataValues.count =data ? data.length : 0;
        //     result.push(model)
        // }
            
        models.shift()
        return res.json(models);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error listing all models.',
            error: error.message
        });
    }
};


const resetTrainingData = async (req, res) => {
    const { modelId } = req.params;
      // Validation for modelId
      if (!modelId || typeof modelId !== 'string') {
        return res.status(400).json({
        status: 'error',
        message: 'Invalid modelId. It should be a non-empty string.'
        });
    }
    const userId = req.user.userId;
    
    try {
        const { data: deletedData, error: deleteError } = await supabaseClient
            .from('chatgpt')
            .delete()
            .eq('model_id', modelId)
            .eq('user_id', userId);

        if (deleteError) {
            console.error("Supabase delete error:", deleteError);
            return res.status(500).json({
            status: 'error',
            message: 'Error deleting training data.',
            error: deleteError.message
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Training data deleted successfully.'
        });

        

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error in deleting Training data.',
            error: error.message
        });
    }
};

const prepareFileForFineTune = async (req, res) => {    
    try {
        const { presignedUrl, fileId } = req.query;
        console.log("🚀 ~ prepareFileForFineTune ~ presignedUrl:", presignedUrl)
        console.log("🚀 ~ prepareFileForFineTune ~ presignedUrl:", req.query)
        let url = 'https://opensql.s3.us-west-1.wasabisys.com/4/hr-6376a9b4-212b-465f-bc04-a590b742b6e6.sql?AWSAccessKeyId=PB3SF6B4ZHEXUOIAGRRT&Expires=1714869521&Signature=8YfmubBTm5zlRaM1rxAyRg3lc9s%3D'
        
        // Make GET request to the presigned URL
        const response = await axios.get(presignedUrl, {timeout: 120000 });
        // console.log(">>>>>", response.data);
        
        // Call function to prepare array of strings for fine-tuning
        let dataset = await prepareArrayOfStringForFinetune(response.data);
        // let dataset = {
        //     SCHEMA: [
        //       'tableName: department, columns: [departmentid, name, groupname, modifieddate]',
        //       'tableName: employee, columns: [businessentityid, nationalidnumber, loginid, jobtitle, birthdate, maritalstatus, gender, hiredate, salariedflag, vacationhours, sickleavehours, currentflag, rowguid, modifieddate, organizationnode]',
        //       'tableName: employeedepartmenthistory, columns: [businessentityid, departmentid, shiftid, startdate, enddate, modifieddate]',
        //       'tableName: employeepayhistory, columns: [businessentityid, ratechangedate, rate, payfrequency, modifieddate]',
        //       'tableName: jobcandidate, columns: [jobcandidateid, businessentityid, resume, modifieddate]',
        //       'tableName: shift, columns: [shiftid, name, starttime, endtime, modifieddate]'
        //     ],
        //     RELATIONS: [
        //       'employee has a foreign key to department',
        //       'employeedepartmenthistory has a foreign key to department',
        //       'employeedepartmenthistory has a foreign key to employee',
        //       'employeedepartmenthistory has a foreign key to shift',
        //       'employeepayhistory has a foreign key to employee',
        //       'jobcandidate has a foreign key to employee'
        //     ],
        //     SQL: [
        //       {
        //         question: 'List all employees who are currently active and their job titles.',
        //         DDL: 'SELECT p.firstname, p.lastname, e.jobtitle FROM humanresources.employee e JOIN person.person p ON e.businessentityid = p.businessentityid WHERE e.currentflag = true;'
        //       },
        //       {
        //         question: 'Find the departments that have employees with the highest vacation hours.',
        //         DDL: 'SELECT d.name, SUM(e.vacationhours) AS total_vacation_hours FROM humanresources.employee e JOIN humanresources.employeedepartmenthistory edh ON e.businessentityid = edh.businessentityid JOIN humanresources.department d ON edh.departmentid = d.departmentid GROUP BY d.name ORDER BY total_vacation_hours DESC;'
        //       },
        //       {
        //         question: 'Get the average salary rate for employees hired after a specific date.',
        //         DDL: "SELECT AVG(ep.rate) AS average_salary_rate FROM humanresources.employeepayhistory ep JOIN humanresources.employee e ON ep.businessentityid = e.businessentityid WHERE e.hiredate > 'SpecificDate';"
        //       }
        //     ]
        //   }
      
        const userId = req.user.userId
        console.log("🚀 ~ prepareFileForFineTune ~ userId:", userId)

        const model = await Model.findOne({
            where: {
                name: 'default_opensql',
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
        

        try {
            await processDataset(dataset, modelId, userId, fileId);
        } catch (error) {
            console.error('Error:', error);
        }
        
        await Model.update({ active: true }, { where: { fileId, active: false } });
        
        return res.status(200).json({
            status: 'success',
            message: 'File prepared for fine-tuning.'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error preparing file for fine-tuning.',
            error: error.message
        });
    }
};

const askMySql = async (req, res) => {
    try {
        const { question, fileId } = req.query;
        console.log("🚀 ~ askMySql ~ fileId:", fileId)
        const userId = req.user.userId

        // Validation for question
        if (!question || typeof question !== 'string') {
            return res.status(400).json({
            status: 'error',
            message: 'Invalid question. It should be a non-empty string.'
            });
        }
        
        const model = await Model.findOne({
            where: {
                name: 'default_opensql',
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
        const embeddings = await generateEmbeddingsForQuestion(question)
        // console.log("🚀 ~ askMySql ~ embeddings:", embeddings)

        const [relatedSchema, relatedRelations, relatedSql] = await Promise.all([
            similaritySearch(embeddings, 10, modelId, userId, "SCHEMA", fileId, 'ui'),
            similaritySearch(embeddings, 2, modelId, userId, "RELATIONS", fileId, 'ui'),
            similaritySearch(embeddings, 8, modelId, userId, "SQL", fileId, 'ui')
        ]);
        // console.log("🚀 ~ relatedSchema >>>", relatedSchema, )
        // console.log("🚀 ~ relatedRelations >>>",  relatedRelations)
        // console.log("🚀 ~ relatedSql >>>",  relatedSql)


        const mergedSchema = relatedSchema.map(obj => obj.content).join(' ');
        const mergedRelations = relatedRelations.map(obj => obj.content).join(' ');

        const mergedSql = relatedSql && relatedSql.length > 0 ? relatedSql.slice(0, relatedSql.length > 3 ? 3 : relatedSql.length).map(obj => `\nReference Question:  ${obj.question}\nReference Answer: ${obj.content}`).join(' ') : '';

        const SysPrompt = generateSQLPrompt(mergedSchema, mergedRelations, mergedSql);
        const messages = createChatMessages(SysPrompt, question, relatedSql);
        const sql = await generateSQL(SysPrompt, messages);

        return res.status(200).json({
            status: 'Success',
            data: { sql },
            message: `SQL generated successfully for question: ${question}`
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Error retrieving similar items.',
            error: error.message
        });
    }
};


module.exports = {
    createModel,
    deleteModel,
    trainModel,
    ask,
    listAllModels,
    resetTrainingData,
    prepareFileForFineTune,
    askMySql
};

