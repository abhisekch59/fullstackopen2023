const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (blogs.length === 0) {
        return 0
    }

    if (blogs.length === 1) {
        return blogs[0].likes
    }

    const reducer = (accumulator, blog) => {
        return accumulator + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const result = {
        title: "",
        author: "",
        likes: -1
    }

    blogs.forEach(blog => {
        if (result.likes < blog.likes) {
            result.title = blog.title
            result.author = blog.author
            result.likes = blog.likes
        }
    })

    return result
}

const mostBlogs = (blogs) => {
    const blogCounts = lodash.countBy(blogs, (blog) => blog.author)

    const result = {
        author: "",
        blogs: -1
    }
    for (var prop in blogCounts) {
        if (blogCounts[prop] > result.blogs) {
            result.author = prop
            result.blogs = blogCounts[prop]
        }
    }

    return result
}

const mostLikes = (blogs) => {
    const groupByAuthor = lodash.groupBy(blogs, (blog) => blog.author)
    const reducer = (accumulator, blog) => {
        return accumulator + blog.likes
    }
    const result = {
        author: "",
        likes: -1
    }
    for(var prop in groupByAuthor) {
        const blogsOfCurrentAuthor = groupByAuthor[prop]
        const likesofCurrentAuthor = blogsOfCurrentAuthor.reduce(reducer, 0)
        if(result.likes < likesofCurrentAuthor) {
            result.author = prop
            result.likes = likesofCurrentAuthor
        }
    }
    return result
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}