const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

usersRouter.post('/', async (request, response) => {
  const { userName, name, password } = request.body;

  if (!userName) return response.status(400).json({ error: 'Username is required.' });
  if (!password) return response.status(400).json({ error: 'Password is required.' });
  if (userName.length < 3) return response.status(400).json({ error: 'Username must be atleast 3 characters long.' });
  if (password.length < 3) return response.status(400).json({ error: 'Password must be atleast 3 characters long.' });

  const existingUser = await User.findOne({ userName });
  if (existingUser) return response.status(400).json({ error: `Username '${userName}' is already taken.` });

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