const Persons = ({ personsToShow, personDeleteHandler }) => {
    return (
        <>
            {personsToShow.map(person => <div key={person.id}>{person.name} {person.number} <button onClick={() => personDeleteHandler(person)}>delete</button></div>)}
        </>
    )
}

export default Persons