## This is the backend for my FullstackHelsinkiUni-repository

The API is available at https://fullstack-part-3.herokuapp.com/api/persons

## Available API endpoints

### Get all entries

```http
GET https://fullstack-part-3.herokuapp.com/api/persons
```

### Get entry by ID

```http
GET https://fullstack-part-3.herokuapp.com/api/persons/:id
```

### Post new entry

```http
POST https://fullstack-part-3.herokuapp.com/api/persons

{
  "name": "String",
  "number": "String",
}
```

### Update an entry

```http
PUT https://fullstack-part-3.herokuapp.com/api/persons/:id

{
  "name": "String",
  "number": "String",
}
```

### Delete an entry

```http
DELETE https://fullstack-part-3.herokuapp.com/api/persons/:id
```
