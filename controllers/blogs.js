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

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0
  });
  const result = await blog.save();
  response.status(201).json(result);
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