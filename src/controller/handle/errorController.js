let serveFile = require('./../../../serveFile')
const fs = require('fs')



class ErrorController {
    showNotFound = (req,res) => {
        fs.readFile('.src/views/error-404.html', 'utf-8', (err, notFoundHtml) => {
            res.write(notFoundHtml);
            res.end();
        })
    }
}

module.exports = new ErrorController();