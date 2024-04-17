const crypto = require('crypto');
const { encode } = require('gpt-3-encoder');


function generateApiKey() {
    return 
}


async function createChunk(documentation, isSQL) {
    console.log("🚀 ~ createChunk ~ documentation:", documentation)

    return documentation.map(ele => {

        return  {
            content: ele,
            content_length: ele.length,
            content_token: encode(ele.trim()).length,
            // trainingDataType
        }
    })
    
}
// Example usage
// const text = 'Hello, world!';
// generateEmbeddings(text)
//     .then(embeddings => {
//         console.log('Generated embeddings:', embeddings);
//     })
//     .catch(error => {
//         console.error('Error generating embeddings:', error);
//     });

module.exports = {
    createChunk
};