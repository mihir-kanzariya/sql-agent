const { supabaseClient } = require('./supabaseClient.js');
const OpenAI = require('openai');
const axios = require('axios');




// const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_API_KEY');
let tokensConsumed = 0;

let functionCalls = 0;
let totalReq = 0;
let totalTokens = 0




async function generateEmbeddings(inputArr, model_id, user_id, trainingDataType, docForSQL) {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_APIKEY
        });

        const filterArr = inputArr.filter((chunk) => {
            return chunk.content !== null && chunk.content !== undefined && chunk.content !== "";
        });

        const reqObj = {
            model: 'text-embedding-ada-002',
            input: filterArr.map((chunk) => chunk.content)
        };

        const embeddingResponse = await openai.embeddings.create(reqObj);

        tokensConsumed += embeddingResponse?.data?.usage?.prompt_tokens ?? 0;
        functionCalls += 1;
        totalReq++;
        totalTokens += embeddingResponse?.data?.usage?.prompt_tokens ?? 0;

        await Promise.all(embeddingResponse?.data.map(async (e) => {
            const insertData = {
                question: trainingDataType === 'SQL' ? docForSQL[e.index]?.question : null,
                content: trainingDataType === 'SQL' ? docForSQL[e.index].DDL.replace(/\r?\n|\r/g, ' ') : filterArr[e.index].content.replace(/\u0000/g, ' '),
                content_length: filterArr[e.index]?.content_length ?? 0,
                content_tokens: filterArr[e.index]?.content_tokens ?? 0,
                embedding: e.embedding,
                model_id,
                user_id,
                training_data_type: trainingDataType
            };

            const { error } = await supabaseClient
                .from(`chatgpt`)
                .insert(insertData)
                .select('*');

            if (error) {
                console.error("Error occurred during insertion:", error);
                return error
    
            }
        }));

        console.log("SAVED");
        return "data";
    } catch (error) {
        console.error('Error generating embeddings:', error);
        return error
        
    }
}


async function similaritySearch(query, matches, modelId, userId, trainingDataType) {
    try {
        const input = query.replace(/\n/g, ' ');
        const embedRes = await axios.post('https://api.openai.com/v1/embeddings', {
            model: 'text-embedding-ada-002',
            input
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_APIKEY}`
            }
        });

        const { embedding } = embedRes.data.data[0];
        const { data: chunks, error } = await supabaseClient.rpc('chatgpt_search', {
            match_count: matches,
            modelid: modelId,
            query_embedding: embedding,
            similarity_threshold: 0.01,
            trainingdatatype: trainingDataType,
            userid: userId
        });

        if (error) {
            console.error("SUPABSE Error:", JSON.stringify(error));
            return error;
        }

        return chunks;
    } catch (error) {
        console.error(error);
        return error;
    }
}


async function generateSQL(prompt, messages) {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_APIKEY
        });

        const requestBody = {
            model: 'gpt-3.5-turbo',
            messages,
            temperature: 0.2,
            // stream: true
        };

        const response = await openai.chat.completions.create(requestBody);
        console.log(response.choices[0]?.message.content); // Handle the response data here
        return response.choices[0]?.message.content;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = {
    generateEmbeddings,
    similaritySearch,
    generateSQL
};