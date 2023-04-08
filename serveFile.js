const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');



const serveFile = async (filePath, contentType, response) => {
    try {


        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : '' //! utf8 or empty string để hiện ảnh
        );

        let data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;


        response.writeHead(
            filePath.includes('error-404.html') ? 404 : 200,
            { 'Content-Type': contentType }
        );

        response.end(

            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch (err) {
        console.log(err);
        response.statusCode = 500;
        response.end();
    }
}
module.exports = serveFile;