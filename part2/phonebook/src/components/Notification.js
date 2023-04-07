const Notification = ({ message, type, types }) => {
    const errorMessageStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    const successMessageStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }
    
    if(message === '') {
        return null
    }

    if(type === types.error) {
        return (
            <div style={errorMessageStyle}>
                {message}
            </div>
        )
    }

    if(type === types.success) {
        return (
            <div style={successMessageStyle}>
                {message}
            </div>
        )
    }
//this should not occur, but by default, error message
    return (
        <div style={errorMessageStyle}>
            {message}
        </div>
    )
}

export default Notification;