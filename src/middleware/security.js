const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        error: "Too many requests, please try again later."
    }
});

module.exports = {
    helmet: helmet(),
    rateLimiter: apiRateLimiter
};
