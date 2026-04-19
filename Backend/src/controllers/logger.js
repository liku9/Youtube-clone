    export const logger = (req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    next();
    };

    export const logError = (error) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${error.message}`);
    if (error.stack) console.error(error.stack);
    };