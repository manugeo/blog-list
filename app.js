const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const loginRouter = require('./controllers/login');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const testingRouter = require('./controllers/testing');
const logger = require('./utils/logger');
const config = require('./utils/config');
const { requestLogger, tokenExtractor, userExtractor, unknownEndpoint, errorHandler } = require('./utils/middleware');

logger.info('connecting to', config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI).then(() => {
  logger.info('connected to MongoDB');
}).catch((error) => {
  logger.error('error connecting to MongoDB:', error.message);
});

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(tokenExtractor);

app.use('/api/login', loginRouter);
app.use('/api/blogs', userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;