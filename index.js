require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')
const { response } = require('express')
const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
// This line enables the use of Express' json method
app.use(express.json())

// This line enables morgan to log data either into console or into file
var accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'), {flags:'a' })
app.use(morgan('combined', { stream: accessLogStream }))

// This line enables CORS for us to be able to run the backend locally
app.use(cors())



// Hard coded data...
let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-1234567"
    },
    {
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

// the root address
app.get('/',(request,response) => {
    response.send('<h1>Hello World!</h1>')
})

// info page
app.get('/info',(request,response) => {
    response.send(`Phonebook has info for ${persons.length} people<br />${Date()}`)
})

// raw JSON
app.get('/api/persons',(request,response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })
})

// Search by ID
app.get('/api/persons/:id',(request,response, next) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                response
                    .json(person
                        .toJSON())
            }
            else
            {
                response
                    .status(404)
                    .end()
            }
        })
        .catch(error => next(error))
})

// Post a new entry to the JSON object
app.post('/api/persons', (request,response) => {

    const body = request.body
    // if the JSON object in the POST request does not have a name specified, return a status code 400
    if(!body.name) {
        return response.status(400).json({ error: 'content missing.' })
    }

    // if the JSON object in the POST request has a name that already exists in the database, return a status code 400
    if(persons.find(person =>
        person.name === body.name))
        {
            return response.status(400).json({
                error: 'name must be unique.'
            })
        }

    // build a new object based on Schema specified
    const person =  new Person({
        name: body.name,
        number: generateNum(body.number),
    })

    // send the object to MongoDB database
    person
        .save()
        .then(savedPerson => savedPerson.toJSON())
        .then(savedAndFormattedPerson => {
            response.json(savedAndFormattedPerson)
        })
        .catch(error => next(error))
})

// Delete by ID
app.delete('/api/persons/:id', (request,response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// This function generates a random number for the given person if none is specified
const generateNum = (number) => {
    if (number == undefined || number == "") {
        return Math.floor(Math.random() * 9999999999)
    }
    else {
        return number
    }
}

app.put('/api/persons/:id',(request,response,next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request,params.id,person,{ new: true})
        .then(updatedName => {
            response.json(updatedName),
            updatedNumber => {
                response.json(updatedNumber)
        }
        })
        .catch(error => next(error))
})

// This function handles unknown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'})
    next(error)
}

app.use(unknownEndpoint)

// This function handles malformatted ID errors
const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    
    if(error.name === 'CastError') {
        return response.status(400).send( { error:'malformatted id' })
    }
    else if (error.name === 'ValidationError')
    {
        return response.status(400).json({ error: error.message})
    }

    next(error)
}

// This line enables the errorhandler we've defined above
app.use(errorHandler)

// Start the server at either a port defined in an environment variable or, if that fails, port 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})