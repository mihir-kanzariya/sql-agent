const express = require('express');
const router = require('./routes/index.js');
const { testDBConnection } = require('./helper/sequelize.js');
const { generateEmbeddings } = require('./vectordb/supabase.js');
const { encode } = require('gpt-3-encoder');
const cors = require('cors');




// Your code here


require('dotenv').config();
const app = express();
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
    credentials: true // Allow cookies to be sent from the client
  }));
app.use(express.json());
// Allow all cross-origin requests
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });





testDBConnection()
// let ele = `TableName: Dashboard,
// Properties: MiddleSize, RightSize, CreatedDate, LastModifiedDate, SystemModstamp, TitleColor, TitleSize, TextColor, BackgroundStart, LeftSize, LastModifiedById, BackgroundEnd, BackgroundDirection`
// console.log(encode(ele.trim()).length,)
// // generateEmbeddings([{ content: "hello worlds", content_length: 2,
// // content_tokens:2 }, { content: "My name is mihir",content_length: 2,
// // content_tokens:2 }], 1, 1)
app.use('/api/v1', router);
// Sample GET API
// app.get('/api', (req, res) => {
//     res.send('Hello, World!');
// });


// Start the server
const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});