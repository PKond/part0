const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
// app.use(morgan("tiny"));

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

app.get("/api/persons", (request, response) => {
  response.send(persons);
});

app.get("/info", (request, response) => {
  const countPeople = persons.length;
  const sentence = `Phonebook has info for ${countPeople} people`;
  const currentTime = new Date().toString();

  response.send(`
    <p>${sentence}</p>
    <p>${currentTime}</p>
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  const person = persons.find((p) => id === p.id);
  if (!person) {
    return response.status(404).send({ error: "Person not found" });
  }

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => id !== p.id);

  response.status(204).send();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number is missing",
    });
  }

  const nameExists = persons.some((person) => person.name === body.name);
  if (nameExists) {
    return response.status(400).json({
      error: "Name must be unique",
    });
  }

  const newId = Math.floor(Math.random() * 10000);

  const newPerson = {
    id: String(newId),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  app.use(morgan(':id :method :url :response-time'))

  response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
