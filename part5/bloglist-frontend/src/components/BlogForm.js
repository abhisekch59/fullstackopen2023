const BlogForm = (props) => {
    return (
        <>
            <h2>create new</h2>
            <form onSubmit={props.blogFormSubmitHandler}>
                <div>
                    title: <input type="text" value={props.title} onChange={props.titleChangeHandler} />
                </div>
                <div>
                    author: <input type="text" value={props.author} onChange={props.authorChangeHandler} />
                </div>
                <div>
                    url: <input type="text" value={props.url} onChange={props.urlChangeHandler} />
                </div>
                <div>
                    <button type="submit">create</button>
                </div>
            </form>
        </>
    )
}

export default BlogForm