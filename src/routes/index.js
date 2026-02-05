const express = require('express');
const router = express.Router();
const platformController = require('../controllers/platform.controller');
const cacheMiddleware = require('../middleware/cache');

// Main platform route with caching
router.get('/:platform/:handle', cacheMiddleware, platformController.getPlatformData);

// Root route
router.get('/', (req, res) => {
    res.status(200).send("You hit the wrong endpoint!");
});

module.exports = router;
