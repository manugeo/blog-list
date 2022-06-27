const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.post('/', async (request, response) => {
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken?.id) {
    return response.status(401).json({ error: 'token missing or invalid '});
  }

  const { title, author, likes, url } = request.body || {};
  if (!title) return response.status(400).json({ error: "title is required." });
  if (!url) return response.status(400).json({ error: "url is required." });

  const user = await User.findById(decodedToken.id);
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user?._id || null
  });
  const savedBlog = await blog.save();

  if (user) {
    // Note: updating the user document as well.
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
  }

  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true });
  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;