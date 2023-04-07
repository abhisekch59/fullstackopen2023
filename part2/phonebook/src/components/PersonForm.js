const PersonForm = (props) => {
    return (
        <form onSubmit={props.formSubmitHandler}>
            <div>
                name: <input value={props.nameValue} onChange={props.nameValueChangeHandler} />
            </div>
            <div>
                number: <input value={props.numberValue} onChange={props.numberValueChangeHandler} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm