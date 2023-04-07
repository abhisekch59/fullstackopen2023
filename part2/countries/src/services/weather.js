import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getWeather = city => {
    const params = {
        q: city,
        APPID: process.env.REACT_APP_WEATHER_API_KEY,
        units: 'Metric'
    }

    const request = axios.get(baseUrl, { params })
    return request.then(response => response.data)
  }
  
export default { getWeather }