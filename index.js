const express = require('express');
const cors = require('cors');
const { helmet, rateLimiter } = require('./src/middleware/security');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/error');
const config = require('./src/config');

const app = express();

// Global Middlewares
app.use(helmet);
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/', routes);

// 404 Handler
app.use((req, res) => {
    res.status(404).send({
        success: false,
        error: "Invalid Request"
    });
});

// Global Error Handler
app.use(errorHandler);

const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}!`);
});

module.exports = app;