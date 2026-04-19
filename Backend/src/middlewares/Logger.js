// middleware/logger.js
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Once the request finishes, log the results
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`--- [LOG] ${req.method} ${req.originalUrl} ---`);
    console.log(`Time:    ${new Date().toISOString()}`);
    console.log(`Params:  `, JSON.stringify(req.params, null, 2));
    console.log(`Query:   `, JSON.stringify(req.query, null, 2));
    console.log(`Body:    `, JSON.stringify(req.body, null, 2));
    console.log(`Status:  ${res.statusCode}`);
    console.log(`Duration: ${duration}ms`);
    console.log(`-------------------------------------------`);
  });

  next();
};