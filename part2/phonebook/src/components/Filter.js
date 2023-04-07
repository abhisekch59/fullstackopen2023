const Filter = ({ filterValue, filterValueChangeHandler }) => {
    return (
        <>
            filter shown with <input value={filterValue} onChange={filterValueChangeHandler}/>
        </>
    )
}

export default Filter