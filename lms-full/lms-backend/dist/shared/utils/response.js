export const SendResponse = (res, { statusCode = 200, success = true, message, data, error, pagination, }) => {
    const response = {
        success,
        ...(message !== undefined && { message }),
        ...(data !== undefined && { data }),
        ...(error !== undefined && { error }),
        ...(pagination !== undefined && { pagination }),
    };
    return res.status(statusCode).json(response);
};
//# sourceMappingURL=response.js.map