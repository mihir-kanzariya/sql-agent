const axios = require('axios');

async function checkForInsertStatements(url) {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });

        const reader = response.data;
        let completed = false;
        let lastChunkEnd = "";

        return new Promise((resolve, reject) => {
            reader.on('data', chunk => {
                // Combine the end of the last chunk with the new chunk to avoid missing matches split across chunks
                let chunkText = lastChunkEnd + chunk.toString();
                console.log("🚀 ~ returnnewPromise ~ chunkText:", chunkText)

                // Regex to find "INSERT INTO" possibly followed by another "INSERT INTO"
                const insertRegex = /INSERT INTO[\s\S]*?INSERT INTO/;

                if (insertRegex.test(chunkText)) {
                    console.log("Consecutive 'INSERT INTO' statements found.");
                    reader.destroy(); // Stop reading if found
                    resolve(true);
                }

                // Save the end of this chunk to prepend to the next chunk
                lastChunkEnd = chunkText.slice(-100); // Save the last 100 characters for overlap
            });

            reader.on('end', () => {
                if (!completed) {
                    console.log("No consecutive 'INSERT INTO' statements found.");
                    resolve(false);
                }
            });

            reader.on('error', err => {
                console.error("Error while reading the file:", err);
                reject(err);
            });
        });

    } catch (err) {
        console.error("Error fetching or processing file:", err);
        return false;
    }
}


// Example usage
const presignedUrl = 'https://s3.us-west-1.wasabisys.com/opensql/e-order.sql?AWSAccessKeyId=N558937DZY356Z64GX85&Expires=1715188252&Signature=I%2FHyDl4HTrSSg3UEAEf50RCSsjo%3D';
checkForInsertStatements(presignedUrl).then(found => {
    if (found) {
        console.log("Process halted due to potential SQL query injection risks.");
    } else {
        console.log("File does not contain consecutive 'INSERT INTO' statements.");
    }
});
