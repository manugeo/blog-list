const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  console.log('Inside blogs router!');
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { title, author, likes, url, description } = request.body || {};
  if (!title) return response.status(400).json({ error: "title is required." });
  if (!url) return response.status(400).json({ error: "url is required." });
  if (!description) return response.status(400).json({ error: "description is required." });

  const user = request.user;
  const blog = new Blog({
    title,
    author,
    url,
    description,
    likes: likes || 0,
    user: user?.id || null
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
  const user = request.user;
  const blog = await Blog.findById(request.params.id);
  if (!(blog && blog._id)) return response.status(400).json({ error: "Can't find the blog."});

  const canBeDeleted = (blog.user.toString() === user._id.toString());
  if (!canBeDeleted) return response.status(401).json({ error: "Permission denied. Can't delete the blog." });

  await blog.remove();
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true });
  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;