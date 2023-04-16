require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())
// app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', function(req, res) {
    return JSON.stringify(req.body)
});

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

const generateId = () => {
    return Math.floor(Math.random() * 100000)
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.get('/info', (request, response) => {
    const totPersons = persons.length
    const currDate = new Date()
    const currTimestamp = String(currDate)
    response.send(`<p>Phonebook has info for ${totPersons} people</p><p>${currTimestamp}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    //improper format
    if(!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if(!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    //duplicate contact
    const duplicatePerson = persons.find(person => person.name === body.name)
    if(duplicatePerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    //create the person
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})