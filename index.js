const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()

var accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'), {flags:'a' })

// This line enables the use of Express' json method
app.use(express.json())
// This line enables morgan to log data either into console or into file
app.use(morgan('combined', { stream: accessLogStream }))
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
app.get('/',(req,res) => {
    res.send('<h1>Hello World!</h1>')
})

// info page
app.get('/info',(req,res) => {
    res.send(`Phonebook has info for ${persons.length} people<br />${Date()}`)
})

// raw JSON
app.get('/api/persons',(req,res) => {
    res.json(persons)
})

// Search by ID
app.get('/api/persons/:id',(req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person =>
        person.id === id)
    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})

// Delete by ID
app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person =>
        person.id !== id)
    
    res.status(204).end()
})

// Generate ID for the new entry
const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(p =>
        p.id))
    : 0
    return maxId + 1
}

const generateNum = (number) => {
    if (number == undefined || number == "") {
        return Math.floor(Math.random() * 9999999999)
    }
    else {
        return number
    }
}

// Post a new entry to the JSON object
app.post('/api/persons', (request,response) => {

    const body = request.body
    console.log(body)
    if(!body.name) {
        return response.status(400).json({
            error: 'content missing.'
        })
    }
    if(persons.find(person =>
        person.name === body.name))
        {
            return response.status(400).json({
                error: 'name must be unique.'
            })
        }

    const person = {
        name: body.name,
        number: generateNum(body.number),
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(body)
})

// Start the server at port 3001
// const PORT = 3001
// process.env.PORT = PORT
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// })