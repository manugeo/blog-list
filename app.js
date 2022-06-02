const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const logger = require('./utils/logger');
const config = require('./utils/config');
const { requestLogger, unknownEndpoint, errorHandler } = require('./utils/middleware');

logger.info('connecting to', config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI).then(() => {
  logger.info('connected to MongoDB');
}).catch((error) => {
  logger.error('error connecting to MongoDB:', error.message);
});

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;