const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { File, Model } = require('../models'); // adjust path as needed
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');



const presignedUrl = async (req, res) => {
    const { name  } = req.params;
    console.log("🚀 ~ presignedUrl ~ req:", req.headers)
    console.log("🚀 ~ presignedUrl ~ name:", name)
    const {  size, ContentType } = req.query;
    const userId = req.user.userId; 

    // Check if the file extension is .sql
    if (!name.endsWith('.sql')) {
        return res.status(400).json({ error: 'Only .sql files are supported.' });
    }

    const file_id = uuidv4();

    const fileName = `${userId}/${name.replace(/\.[^/.]+$/, '')}-${file_id}.sql`;
    // const fileName = `${userId}/${name.replace(/\.[^/.]+$/, '')}.sql`;

    AWS.config.update({
        accessKeyId: process.env.WASABI_ACCESS_KEY,
        region: `us-west-1`,
        secretAccessKey: process.env.WASABI_SECRET_KEY,
    });

    const ep = new AWS.Endpoint(process.env.WASABI_ENDPOINT);
    const s3 = new AWS.S3({ endpoint: ep });

    try {
        // // Define metadata
        const metadata = {
            'user-id': `${userId}`,
            'file-UUID': `file_id/${file_id}`,
            'file-name': `${name}`,
            'file-size': `${size}` || "0",
            'file-content-type': `${name}` || 'application/sql',
            // Add more metadata properties as needed
        };


        // Generate presigned URL with metadata
        const presignedUrl = s3.getSignedUrl('putObject', {
            Bucket: `${process.env.WASABI_BUCKET_NAME}`,
            Key: fileName,
            ContentType: 'text/plain',
            // ACL: '*',
            Expires: 100000,
            // 'x-amz-acl': 'public-read',
            Metadata: metadata // Include metadata in the request
        });
        // console.log("🚀 ~ presignedUrl ~ userId:", userId)
        const model = await Model.findOne({
            where: {
                name: 'default_opensql',
                user_id: userId
            }
        });
        // console.log("🚀 ~ presignedUrl ~ model:", model)

        // Save file details to File model in Sequelize
        let createdFile = await File.create({
            name: name,
            uuid: file_id,
            key: fileName,
            size: size || 0,
            model_id: model.dataValues.id,
            user_id: userId,
            content_type: ContentType || 'application/sql',
            active: false,
        });



        res.json({ presignedUrl, key: fileName, file: createdFile });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        res.status(500).json({ error: 'Failed to generate presigned URL.' });
    }
}

const presignedUrlToRead = async (req, res) => {
  
    const {  key } = req.query;
    const userId = req.user.userId; 
    AWS.config.update({
        accessKeyId: process.env.WASABI_ACCESS_KEY,
        region: `us-west-1`,
        secretAccessKey: process.env.WASABI_SECRET_KEY,
    });

    const ep = new AWS.Endpoint(process.env.WASABI_ENDPOINT);
    const s3 = new AWS.S3({ endpoint: ep });
  
    try {
   
        // Generate presigned URL with metadata
        const presignedUrl = s3.getSignedUrl('getObject', {
            Bucket: `${process.env.WASABI_BUCKET_NAME}`,
            Key: key,
            // ContentType: 'text/plain',
            // ACL: '*',
            Expires: 100000,
            // 'x-amz-acl': 'public-read',
            // Metadata: metadata // Include metadata in the request
        });

        res.json({ presignedUrl, key });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        res.status(500).json({ error: 'Failed to generate presigned URL.' });
    }
}



// module.exports = ;

module.exports = {
    presignedUrl,
    presignedUrlToRead
};

