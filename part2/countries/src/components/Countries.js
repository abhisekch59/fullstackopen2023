import Weather from "./Weather"

const Countries = ({ countriesToDisplay, buttonClickHandler }) => {
    if(countriesToDisplay.length === 0) {
        return null
    }

    if(countriesToDisplay.length > 10) {
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )
    }

    if(countriesToDisplay.length > 1 && countriesToDisplay.length <= 10) {
        return (
            <>
                {countriesToDisplay.map(country => <div key={country.name.common}>{country.name.common} <button onClick={() => buttonClickHandler(country)}>show</button></div>)}
            </>
        )
    }

    return (
        <>
            <h1>{countriesToDisplay[0].name.common}</h1>
            <div>capital {countriesToDisplay[0].capital[0]}</div>
            <div>area {countriesToDisplay[0].area}</div>
            <h2>languages:</h2>
            <ul>
                {Object.keys(countriesToDisplay[0].languages).map(lan => <li key={lan}>{countriesToDisplay[0].languages[lan]}</li>)}
            </ul>
            <img src={countriesToDisplay[0].flags.png} alt={countriesToDisplay[0].flags.png}/>
            <Weather city={countriesToDisplay[0].capital[0]} />
        </>
    )
}

export default Countries