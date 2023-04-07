import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const Weather = ({ city }) => {
    const [weather, setWeather] = useState([])
    
    useEffect(() => {
        weatherService
            .getWeather(city)
            .then(response => {
                setWeather([response])
            })
            .catch(error => console.log('error in getting weather'))
    }, [city])

    if(weather.length === 0) {
        return null
    }

    return (
        <>
            <h2>Weather in {city}</h2>
            <div>temperature {weather[0].main.temp} Celcius</div>
            <img src={`https://openweathermap.org/img/wn/${weather[0].weather[0].icon}@2x.png`} alt={weather[0].weather[0].description}></img>
            <div>wind {weather[0].wind.speed} m/s</div>
        </>
    )
}

export default Weather