// const Joi = require('joi');




// const createModelSchema = Joi.object({
//     params: Joi.object({
//         userId: Joi.string().required(),
//         modelName: Joi.string().required()
//     })
// });

// // const deleteModelSchema = Joi.object({
// //     modelId: Joi.number().required()
// // });


// // const trainModelSchema = Joi.object({
// //     modelId: Joi.number().required(),

// //     documentation: Joi.alternatives().try(
// //         Joi.array().items(Joi.string()).required(),
// //         Joi.array().items(Joi.object({
// //             question: Joi.string().required(),
// //             DDL: Joi.string().required()
// //         })).required()
// //     ),
// //     trainingDataType: Joi.string().valid('SCHEMA', 'RELATIONS', 'SQL').required()
// // });

// // const askSchema = Joi.object({
// //     modelId: Joi.number().required(),
// //     question: Joi.string().required()
// // });


// module.exports = { createModelSchema };