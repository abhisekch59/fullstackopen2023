const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
}, 100000)

const api = supertest(app)

describe('reading blogs from db', () => {
    test('blogs are returned as json', async () => {
        const resultBlogs = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        expect(resultBlogs.body).toHaveLength(helper.initialBlogs.length)
    })
    
    test('blogs should contain id', async () => {
        const resultBlogs = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        expect(resultBlogs.body[0].id).toBeDefined()
    })
})

describe('creating new blog in db', () => {
    beforeEach(async () => {
        //create a test user for conducting the tests
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({ username: 'userforblogcreation',name: 'user for blog creation', passwordHash: passwordHash })

        await user.save()
    })
    test('new blogs can be saved to db', async () => {
        const newBlog = {
            title: "testing blog to be saved in DB",
            author: "test author",
            url: "test url",
            likes: 55
        }

        //login and get the token
        const userObj = {
            username: 'userforblogcreation',
            password: 'secret'
        }
        const loginObj = await api
            .post('/api/login')
            .send(userObj)
            .expect(200)
        
        const token = loginObj.body.token
    
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const contents = await helper.blogsInDB()
        const titles = contents.map(content => content.title)
    
        expect(contents).toHaveLength(helper.initialBlogs.length + 1)
        expect(titles).toContain('testing blog to be saved in DB')
    })
    
    test('new blog without likes property has likes set to 0', async () => {
        const newBlogWithoutLikes = {
            title: "blog without likes",
            author: "test author for blog without likes",
            url: "test url for blog without likes",
        }

        //login and get the token
        const userObj = {
            username: 'userforblogcreation',
            password: 'secret'
        }
        const loginObj = await api
            .post('/api/login')
            .send(userObj)
            .expect(200)
        
        const token = loginObj.body.token
    
        const savedBlog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogWithoutLikes)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        expect(savedBlog.body.likes).toBe(0)
    })
    
    test('new blog without title will give error and not save to database', async () => {
        const newBlogWithoutTitle = {
            author: "test author without title",
            url: "test url without title",
            likes: 55
        }
        //login and get the token
        const userObj = {
            username: 'userforblogcreation',
            password: 'secret'
        }
        const loginObj = await api
            .post('/api/login')
            .send(userObj)
            .expect(200)
        
        const token = loginObj.body.token
    
        const blogsBeforeAdding = await helper.blogsInDB()
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogWithoutTitle)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        const blogsAfterAdding = await helper.blogsInDB()
        
        expect(blogsBeforeAdding).toHaveLength(blogsAfterAdding.length)
    })
    
    test('new blog without url will give error and not save to database', async () => {
        const newBlogWithoutUrl = {
            title: "test blog without url",
            author: "test author without url",
            likes: 55
        }

        //login and get the token
        const userObj = {
            username: 'userforblogcreation',
            password: 'secret'
        }
        const loginObj = await api
            .post('/api/login')
            .send(userObj)
            .expect(200)
        
        const token = loginObj.body.token
    
        const blogsBeforeAdding = await helper.blogsInDB()
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlogWithoutUrl)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        const blogsAfterAdding = await helper.blogsInDB()
        
        expect(blogsBeforeAdding).toHaveLength(blogsAfterAdding.length)
    })
})

describe('update a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const blogToUpdate = blogsAtStart[0]

        blogToUpdate.likes = 999

        const updatedBlog = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogToUpdate)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDB()
        const updatedBlogFromDB = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
        expect(updatedBlogFromDB.likes).toBe(blogToUpdate.likes)
        expect(blogsAtStart).toHaveLength(blogsAtEnd.length)
    })

    test('fails with status code 400 if id is invalid', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const invalidId = '5a3d5da59070081a82a3445'

        const blogToUpdate = blogsAtStart[0]
        const initialLikes = blogToUpdate.likes

        blogToUpdate.likes = 999

        const updatedBlog = await api
            .put(`/api/blogs/${invalidId}`)
            .send(blogToUpdate)
            .expect(400)
        
        const blogsAtEnd = await helper.blogsInDB()
        const updatedBlogFromDB = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
        expect(updatedBlogFromDB.likes).not.toBe(blogToUpdate.likes)
        expect(updatedBlogFromDB.likes).toBe(initialLikes)
        expect(blogsAtStart).toHaveLength(blogsAtEnd.length)
    })
})

describe('deletion of a blog', () => {
    beforeEach(async () => {
        //create a test user for conducting the tests
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({ username: 'userforblogcreation',name: 'user for blog creation', passwordHash: passwordHash })

        await user.save()
    })
    test('succeeds with status code 204 if id is valid', async () => {

        //login and get the token
        const userObj = {
            username: 'userforblogcreation',
            password: 'secret'
        }
        const loginObj = await api
            .post('/api/login')
            .send(userObj)
            .expect(200)
        
        const token = loginObj.body.token

        const newBlog = {
            title: "testing blog to be saved and deleted in DB",
            author: "test author",
            url: "test url",
            likes: 55
        }
    
        const blogToDelete = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtStart = await helper.blogsInDB()
        
        await api
            .delete(`/api/blogs/${blogToDelete.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDB()

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

        const titles = blogsAtEnd.map(blog => blog.title)

        expect(titles).not.toContain(blogToDelete.title)
    })

    test('fails with status code 400 if id is invalid', async () => {
        const blogsAtStart = await helper.blogsInDB()
        const invalidId = '5a3d5da59070081a82a3445'

        await api
            .delete(`/api/blogs/${invalidId}`)
            .expect(400)
        
        const blogsAtEnd = await helper.blogsInDB()
        expect(blogsAtStart).toHaveLength(blogsAtEnd.length)
    })
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: '12345'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
            
        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    })
})

describe('new user creation', () => {
    test('proper user gets saved to db successfully', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: "properuser",
            name: "proper user",
            password: '12345'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDB()
        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain(newUser.username)
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    })

    test('user creation without username gives error with status 400', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            name: "without username",
            password: '12345'
        }

        const returnedError = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDB()
        const names = usersAtEnd.map(user => user.name)
        expect(names).not.toContain(newUser.name)
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        expect(returnedError.body.error).toContain('Path `username` is required')
    })

    test('user creation with username having length less than 3 gives error with status 400', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            name: "with username le 3",
            username: "ab",
            password: '12345'
        }

        const returnedError = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDB()
        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).not.toContain(newUser.username)
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        expect(returnedError.body.error).toContain('minimum allowed length (3)')
    })

    test('user creation without password gives error with status 400', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            name: "without password",
            username: "userwithoutpassword"
        }

        const returnedError = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDB()
        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).not.toContain(newUser.username)
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        expect(returnedError.body.error).toContain('password missing')
    })

    test('user creation with password having length less than 3 gives error with status 400', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            name: "with password less than len 3",
            username: "userwithpasswordlelen3",
            password: "12"
        }

        const returnedError = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDB()
        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).not.toContain(newUser.username)
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
        expect(returnedError.body.error).toContain('password must be atleast 3 characters long')
    })

    test('duplicate username should not be allowed', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: 'root',
            name: 'superuser',
            password: '12345'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toEqual(usersAtStart)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})