const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (const blog of helper.initialBlogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe('blog api tests', () => {
  test('blogs are returned as JSON', async () => {
    await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);
  });
  
  test("blog's unique identifier is named as 'id'", async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  })
});

afterAll(() => mongoose.connection.close());