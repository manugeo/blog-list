const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!username) return response.status(400).json({ error: 'Username is required.' });
  if (!password) return response.status(400).json({ error: 'Password is required.' });
  if (username.length < 3) return response.status(400).json({ error: 'Username must be atleast 3 characters long.' });
  if (password.length < 3) return response.status(400).json({ error: 'Password must be atleast 3 characters long.' });

  const existingUser = await User.findOne({ username });
  if (existingUser) return response.status(400).json({ error: `Username '${username}' is already taken.` });

  const saltOrRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltOrRounds);
  const user = new User({ username, name, passwordHash });
  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, url: 1, description: 1, likes: 1 });
  response.json(users);
});

module.exports = usersRouter;