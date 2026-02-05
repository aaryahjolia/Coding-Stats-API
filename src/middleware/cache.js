const NodeCache = require('node-cache');
const config = require('../config');

const cache = new NodeCache({ stdTTL: config.CACHE_TTL });

module.exports = (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
        return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        try {
            // If it's a string that can be parsed as JSON, send it as JSON
            // Otherwise, send it as is (for the home page string)
            if (typeof cachedResponse === 'string') {
                const data = JSON.parse(cachedResponse);
                return res.json(data);
            }
            return res.json(cachedResponse);
        } catch (e) {
            return res.send(cachedResponse);
        }
    }

    // Wrap res.send to cache the response
    const originalSend = res.send;
    res.send = function (body) {
        // Only cache successful responses
        if (res.statusCode === 200) {
            cache.set(key, body);
        }
        return originalSend.apply(res, arguments);
    };

    next();
};
