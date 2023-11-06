import Blog from './Blog'
import BlogForm from './BlogForm'
import Notification from './Notification'

const BlogList = (props) => {
    if(props.user === null) {
        return null
    }
    return (
        <>
            <h2>blogs</h2>
            <Notification message={props.notificationMessage} type={props.notificationType} types={props.notificationTypes} />
            <p>{props.user.name} logged in <button onClick={props.logoutClickHandler}>logout</button></p>
            <BlogForm
                blogFormSubmitHandler={props.blogFormSubmitHandler}
                title={props.title}
                titleChangeHandler={props.titleChangeHandler}
                author={props.author}
                authorChangeHandler={props.authorChangeHandler}
                url={props.url}
                urlChangeHandler={props.urlChangeHandler} />
            <div>
                {props.blogs.map(blog => <Blog key={blog.id} blog={blog} /> )}
            </div>
        </>
    )
}

export default BlogList