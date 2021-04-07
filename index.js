const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");

app.use(express.static("build"));
// This line enables CORS for us to be able to run the backend locally
app.use(cors());
// This line enables the use of Express' json method
app.use(express.json());

// This function handles malformatted ID errors
const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:", request.path);
    console.log("Body:", request.body);
    console.log("---");
    next();
};

app.use(requestLogger);

app.get("/api/persons", (request, response) => {
    Person.find({}).then((persons) => {
        response.json(persons);
    });
});

// Post a new entry to the JSON object
app.post("/api/persons", (request, response, next) => {
    const body = request.body;
    // if the JSON object in the POST request does not have a name specified, return a status code 400
    if (!body.name) {
        return response.status(400).json({ error: "content missing." });
    }

    // if the JSON object in the POST request has a name that already exists in the database, return a status code 400
    if (persons.find((person) => person.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique.",
        });
    }

    // build a new object based on Schema specified
    const person = new Person({
        name: body.name,
        number: generateNum(body.number),
    });

    // send the object to MongoDB database
    person
        .save()
        .then((savedPerson) => savedPerson.toJSON())
        .then((savedAndFormattedPerson) => {
            response.json(savedAndFormattedPerson);
        })
        .catch((error) => next(error));
});

// Search by ID
app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => next(error));
});

// Delete by ID
app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

// Update by ID
app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(request, params.id, person, { new: true })
        .then((updatedName) => {
            response.json(updatedName),
                (updatedNumber) => {
                    response.json(updatedNumber);
                };
        })
        .catch((error) => next(error));
});

// This function generates a random number for the given person if none is specified
const generateNum = (number) => {
    if (number == undefined || number == "") {
        return Math.floor(Math.random() * 9999999999);
    } else {
        return number;
    }
};

// This function handles unknown endpoints
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// This line enables the errorhandler we've defined above
app.use(errorHandler);

// Start the server at either a port defined in an environment variable
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
