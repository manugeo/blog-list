const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { title, author, likes, url } = request.body || {};
  if (!title) return response.status(400).json({ error: "title is required." });
  if (!url) return response.status(400).json({ error: "url is required." });
  const blog = new Blog(Object.assign({}, { likes: 0 }, request.body));
  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogsRouter;