import { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState('')

  const notificationTypes = {
    error: 'Error',
    success: 'Success'
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error('Wrong credentials')
      setNotificationMessage('wrong username or password')
      setNotificationType(notificationTypes.error)
      setTimeout(() => {
        setNotificationMessage('')
        setNotificationType('')
      }, 5000);
    }
  }

  const handleBlogSubmit = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title: title,
        author: author,
        url: url
      }
  
      const newlyCreatedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(newlyCreatedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotificationMessage(`a new blog ${newlyCreatedBlog.title} by ${newlyCreatedBlog.author} added`)
      setNotificationType(notificationTypes.success)
      setTimeout(() => {
        setNotificationMessage('')
        setNotificationType('')
      }, 5000);
    } catch (exception) {
      setNotificationMessage('blog creation failed')
      setNotificationType(notificationTypes.error)
      setTimeout(() => {
        setNotificationMessage('')
        setNotificationType('')
      }, 5000);
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedBloglistUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if(loggedBloglistUserJSON) {
      const user = JSON.parse(loggedBloglistUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <div>
      <LoginForm
        notificationMessage={notificationMessage}
        notificationType={notificationType}
        notificationTypes={notificationTypes}
        user={user}
        loginFormSubmitHandler={handleLogin}
        username={username}
        password={password}
        usernameChangeHandler={handleUsernameChange}
        passwordChangeHandler={handlePasswordChange} />
      <BlogList
        notificationMessage={notificationMessage}
        notificationType={notificationType}
        notificationTypes={notificationTypes}
        user={user}
        blogs={blogs}
        logoutClickHandler={handleLogout}
        blogFormSubmitHandler={handleBlogSubmit}
        title={title}
        titleChangeHandler={handleTitleChange}
        author={author}
        authorChangeHandler={handleAuthorChange}
        url={url}
        urlChangeHandler={handleUrlChange}/>
    </div>
  )
}

export default App