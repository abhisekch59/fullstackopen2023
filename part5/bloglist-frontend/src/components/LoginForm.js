import Notification from "./Notification"

const LoginForm = (props) => {
    if(props.user !== null) {
        return null
    }
    return (
        <>
            <h2>log in to application</h2>
            <Notification message={props.notificationMessage} type={props.notificationType} types={props.notificationTypes} />
            <form onSubmit={props.loginFormSubmitHandler}>
                <div>
                    username: <input type="text" value={props.username} onChange={props.usernameChangeHandler} />
                </div>
                <div>
                    password: <input type="password" value={props.password} onChange={props.passwordChangeHandler} />
                </div>
                <div>
                    <button type="submit">login</button>
                </div>
            </form>
        </>
    )
}

export default LoginForm