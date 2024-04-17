const { default: weaviate } = require('weaviate-ts-client');
// const { default: weaviate } = require('weaviate-ts-client');


// Create a Weaviate client instance
const client = weaviate.client({
    scheme: 'https',
    host: 'customercity-vv0royyl.weaviate.network',
    headers: {
        // "X-Openai-Api-Key": "b4dc9a2805624efebf73cb75b7238079",
        "X-Azure-Api-Key": "b4dc9a2805624efebf73cb75b7238079",
        // "baseURL": "https://raptor1.openai.azure.com",
        // "deploymentId": "embedding-dev",
        // "resourceName": "raptor1",
        // "isAzure": true
        
    }
});

// OpenAI_Chat.__init__(self, client=AzureOpenAI(api_key='', api_version='2024-02-15-preview', azure_endpoint=''), config=config)  # Azure API setup
// Example usage
// const queryEmbeddings = generateEmbeddings('Query content');
// similaritySearch(queryEmbeddings);
// Create a Weaviate class
// Create a Weaviate class
async function createWeaviateClass(className) {
    try {
        const classDefinition = {
            class: className,
            vectorizer: 'text2vec-openai',
            moduleConfig: {
                'text2vec-openai': {
                    "X-Openai-Api-Key": "b4dc9a2805624efebf73cb75b7238079",
                    "X-Azure-Api-Key": "b4dc9a2805624efebf73cb75b7238079",
                    "baseURL": "https://raptor1.openai.azure.com",
                    "deploymentId": "embedding-dev",
                    "resourceName": "raptor1",
                    "isAzure": true
                }   
            },
            properties: [
                {
                    name: 'question',
                    dataType: ['text']
                },
                {
                    name: 'content',
                    dataType: ['text'],
                    moduleConfig: {
                        'text2vec-openai': {
                            "X-Openai-Api-Key": "b4dc9a2805624efebf73cb75b7238079",
                            "X-Azure-Api-Key": "b4dc9a2805624efebf73cb75b7238079",
                            "baseURL": "https://raptor1.openai.azure.com",
                            "deploymentId": "embedding-dev",
                            "resourceName": "raptor1",
                            "isAzure": true
                        }
                    },
                },
                {
                    name: 'contentLength',
                    dataType: ['int'],
                    moduleConfig: {
                        'text2vec-openai': {
                            'skip': true
                        }
                    },
                },
                {
                    name: 'contentToken',
                    dataType: ['text'],
                    moduleConfig: {
                        'text2vec-openai': {
                            'skip': true
                        }
                    }
                },
                {
                    name: 'model',
                    dataType: ['text'],
                    moduleConfig: {
                        'text2vec-openai': {
                            'skip': true
                        }
                    },
                },
                {
                    name: 'userId',
                    dataType: ['text'],
                    moduleConfig: {
                        'text2vec-openai': {
                            'skip': true
                        }
                    },
                },
                {
                    name: 'trainingDataType',
                    dataType: ['text'],
                    moduleConfig: {
                        'text2vec-openai': {
                            'skip': true
                        }
                    },
                }
            ],
            
            // generative: 'azure-openai',
        };
        const response = await client
            .schema
            .classCreator()
            .withClass(classDefinition)
            .do();
        console.log('Weaviate class created successfully:', response);
    } catch (error) {
        console.error('Error creating Weaviate class:', error);
        return error
    }
}



// Function to perform similarity search in Weaviate
async function similaritySearch(model, question, trainingDataType, limit = 5) {
    try {
        result = await client.graphql
            .get()
            .withClassName(model)
            .withNearText({
                concepts: [question],
                targetVectors: ['content'],
            })
            .withWhere({
                path: ['trainingDataType'],
                operator: 'Equal',
                valueText: trainingDataType,
            })
            .withLimit(limit)
            .withFields('content _additional { distance }')
            .do();

        console.log(result);
        console.log('Similarity search results:', result);
        return result;
    } catch (error) {
        console.error('Error performing similarity search:', error);
        return error;
    }
}



// Example usage
// const className = 'YourClassName';
// createWeaviateClass(className);
// Delete a Weaviate class
async function deleteWeaviateClass(className) {
    try {
        const response = await client.deleteClass(className);
        console.log('Weaviate class deleted successfully:', response);
    } catch (error) {
        console.error('Error deleting Weaviate class:', error);
    }
}
// Example usage
// const className = 'YourClassName';
// deleteWeaviateClass(className);


async function createWeaviateRecord(question, content, model, userId, trainingDataType) {
    try {
        // Prepare the record data

        let obj = {
            content: content, // This will be vectorized as per your class definition
            contentLength: content.length,
            contentToken: "0", //TODO: calculate token
            model: model,
            userId: userId,
            question,
            trainingDataType
        }

        // Create the record
        
        result = await client.data
            .creator()
            .withClassName(model)
            .withProperties(obj)
            .do();

        console.log('Record created successfully:', result);
    } catch (error) {
        console.error('Error creating record:', error);
    }
}

async function deleteEphemeralObjects() {
    try {
        await client.batch
            .objectsBatchDeleter()
            .withClassName('Custcity')
            .withWhere({
                path: ['contentToken'],
                operator: 'Equal',
                valueText: '0',
            })
            .do();
        console.log('Ephemeral objects deleted successfully');
    } catch (error) {
        console.error('Error deleting ephemeral objects:', error);
    }
}

async function listAllClasses() {
    try {
        let col =  await client.schema.getter().do();
        console.log('Ephemeral objects deleted successfully', JSON.stringify(col, null, 2));
        return JSON.stringify(col, null, 2)
    } catch (error) {
        console.error('Error deleting ephemeral objects:', error);
        return error
    }
}
async function deleteSchema(className) { 
    // const className = 'Custcity';  // Replace with your class name
    try {
     let a =  await client.schema
          .classDeleter()
          .withClassName(className)
          .do();
        console.log("Deletion successfully", a)
        return "Class Deletion successfully"
        
    } catch (error) {
        console.log("🚀 ~ deleteSchema ~ error:", error)
        return error
        
    }

}


module.exports = {
    similaritySearch,
    createWeaviateClass,
    deleteWeaviateClass,
    createWeaviateRecord,
    deleteSchema,
listAllClasses,
deleteEphemeralObjects
};