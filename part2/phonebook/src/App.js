import { useState, useEffect } from 'react'
import personService from './services/person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState('')

  const notificationTypes = {
    error: 'Error',
    success: 'Success'
  }

  useEffect(() => {
    personService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      id: 0
    }
    const duplicateFound = persons.find(person => person.name === personObject.name)
    if(duplicateFound) {
      duplicateFound.number = newNumber
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(duplicateFound.id, duplicateFound)
          .then(response => {
            setNotificationMessage(`Updated ${newName}`)
            setNotificationType(notificationTypes.success)
            setPersons(persons.map(person => person.id !== duplicateFound.id ? person : response))
            setNewName('')
            setNewNumber('')
            setTimeout(() => {
              setNotificationMessage('')
              setNotificationType('')
            }, 5000);
          })
          .catch(error => {
            setNotificationMessage(`Information of ${newName} has already been removed from the server`)
            setNotificationType(notificationTypes.error)
            setTimeout(() => {
              setNotificationMessage('')
              setNotificationType('')
            }, 5000);
          })
      } else {
        //do nothing
      }
    } else {
      //calculate the new id as maximum ID + 1
      const maxId = Math.max(...persons.map(person => person.id))
      personObject.id = maxId + 1
      personService
        .create(personObject)
        .then(response => {
          setNotificationMessage(`Added ${newName}`)
          setNotificationType(notificationTypes.success)
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
          setTimeout(() => {
            setNotificationMessage('')
            setNotificationType('')
          }, 5000);
        })
        .catch(error => {
          setNotificationMessage(`Could not create ${newName}`)
          setNotificationType(notificationTypes.error)
          setTimeout(() => {
            setNotificationMessage('')
            setNotificationType('')
          }, 5000);
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const personDeleteHandler = (personObjectToDelete) => {
    if(window.confirm(`Delete ${personObjectToDelete.name}`)) {
      personService
        .deletePerson(personObjectToDelete.id)
        .then(response => {
          setNotificationMessage(`Deleted ${personObjectToDelete.name}`)
          setNotificationType(notificationTypes.success)
          setPersons(persons.filter(person => person.id !== personObjectToDelete.id))
          setTimeout(() => {
            setNotificationMessage('')
            setNotificationType('')
          }, 5000);
        })
        .catch(error => {
          setNotificationMessage(`Could not delete ${personObjectToDelete.name}`)
          setNotificationType(notificationTypes.error)
          setTimeout(() => {
            setNotificationMessage('')
            setNotificationType('')
          }, 5000);
        })
    }
  }

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter))
    : persons

  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType} types={notificationTypes} />
      <Filter filterValue={filter} filterValueChangeHandler={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        formSubmitHandler={addName}
        nameValue={newName}
        nameValueChangeHandler={handleNameChange}
        numberValue={newNumber}
        numberValueChangeHandler={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} personDeleteHandler={personDeleteHandler} />
    </>
  )
}

export default App;
