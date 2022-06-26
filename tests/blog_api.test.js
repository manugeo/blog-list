const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt')
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

describe('blog api tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    for (const blog of helper.initialBlogs) {
      const blogObject = new Blog(blog);
      await blogObject.save();
    }
  });

  test('blogs are returned as JSON', async () => {
    await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);
  });

  test("blog's unique identifier is named as 'id'", async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  })
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();
  });

  test('Creation succeeds with a valid username', async () => {
    const initialUsers = await helper.usersInDb();
    const newUser = { username: 'modera10', name: 'Modera Uchiha', password: 'sukiyomi' };
    await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(initialUsers.length + 1);

    const userNames = usersAtEnd.map(user => user.username);
    expect(userNames).toContain(newUser.username);
  });

  test('creation fails with a proper status code and message if username already exists', async () => {
    const initialUsers = await helper.usersInDb();
    const newUser = { username: 'root', name: 'Super User', password: 'password' };
    const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain("Username 'root' is already taken.");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(initialUsers);
    
  });
});

afterAll(() => mongoose.connection.close());