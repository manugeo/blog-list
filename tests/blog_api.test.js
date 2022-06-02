const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  console.log('Clearing db!');
  await Blog.deleteMany({});

  for (const blog of helper.initialBlogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }
  console.log('Added new blogs!');
});
test('blogs are returned as JSON', async () => {
  console.log('getting from db!');
  await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);
});

afterAll(() => mongoose.connection.close());