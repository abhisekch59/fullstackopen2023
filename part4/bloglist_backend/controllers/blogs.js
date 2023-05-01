const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    // const decodedToken = jwt.verify(request.token, process.env.SECRET)
    // if(!decodedToken.id) {
    //     return response.status(401).json({ error: 'token invalid' })
    // }
    const user = await User.findById(request.user)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    })
    
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
    const blogToBeDeleted = await Blog.findById(request.params.id)
    // const decodedToken = jwt.verify(request.token, process.env.SECRET)
    // if(!decodedToken.id) {
    //     return response.status(401).json({ error: 'token invalid' })
    // }
    if(blogToBeDeleted.user.toString() === request.user.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {
        response.status(401).json({ error: 'unauthorised' })
    }
    // await Blog.findByIdAndRemove(request.params.id)
    // response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const updatedBlogData = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedBlogData, { new: true, runValidators: true, context: 'query' })
    response.status(200).json(updatedBlog)
})

module.exports = blogsRouter