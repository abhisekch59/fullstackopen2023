import { useState } from 'react'
import Countries from './components/Countries'
import countryService from './services/restCountries'

const App = () => {
  const [countryValue, setCountryValue] = useState('')
  const [countriesToDisplay, setCountriesToDisplay] = useState([])

  const handleCountryValueChange = (event) => {
    setCountryValue(event.target.value)
    if(event.target.value !== '') {
      countryService
        .getCountries(event.target.value)
        .then(response => setCountriesToDisplay(response))
        .catch(error => console.log(error))
    } else {
      setCountriesToDisplay([])
    }
  }
  
  const buttonClickHandler = (country) => {
    setCountriesToDisplay([country])
  }

  return (
    <div>
      find countries <input value={countryValue} onChange={handleCountryValueChange} />
      <Countries countriesToDisplay={countriesToDisplay} buttonClickHandler={buttonClickHandler} />
    </div>
  )
}

export default App;
