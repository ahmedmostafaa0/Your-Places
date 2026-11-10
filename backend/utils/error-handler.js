
const fs = require('fs');

const errorHandler = (err, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (unlinkError) => {
            if (unlinkError) {
                console.error('File deletion failed:', unlinkError);
            }
        });
    }

    const statusCode =
        Number.isInteger(err.statusCode) ? err.statusCode :
        Number.isInteger(err.status) ? err.status :
        Number.isInteger(err.response?.status) ? err.response.status :
        500;

    res.status(statusCode).json({
        message: err.message || 'An unknown error occurred.'
    });
};

module.exports = errorHandler;
