const axios = require('axios');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

const downloadCardSetup = async () => {
    try {
        // Send GET request to the API
        const response = await axios.get('http://localhost:4000/api/card-setup', {
            responseType: 'arraybuffer' // Ensure the response is treated as binary data
        });

        // Define the file path to save the response
        const filePath = path.join(__dirname, 'card-setup-response.zip');

        // Write the response data to the file
        fs.writeFileSync(filePath, response.data);

        // unzip the file
        fs.createReadStream(filePath)
            .pipe(unzipper.Extract({ path: __dirname }))
            .on('close', () => {
                console.log('Card setup files extracted successfully.');
            });

        console.log(`File saved successfully at ${filePath}`);
    } catch (error) {
        console.error('Error downloading the card setup:', error.message);
    }
};

// Run the function
downloadCardSetup();
