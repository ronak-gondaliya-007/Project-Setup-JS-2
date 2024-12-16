const sendSuccess = (res, statusCode = 200, message, stack, data) => {
    res.status(statusCode).json({
        status: 'success',
        message,
        stack,
        data
    });
};

const sendError = (res, statusCode, message, stack, error) => {
    res.status(statusCode).json({
        status: 'error',
        message,
        stack,
        error
    });
};

module.exports = {
    sendSuccess,
    sendError
};