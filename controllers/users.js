const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

usersRouter.post('/', async (request, response) => {
  const { userName, name, password } = request.body;

  const saltOrRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltOrRounds);

  const user = new User({ userName, name, passwordHash });
  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

module.exports = usersRouter;