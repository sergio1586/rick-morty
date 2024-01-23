const express = require('express');
const fs = require('fs');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);

const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    var contenido = fs.readFileSync('public/index.html');
    res.setHeader('Content-type', 'text/html');
    res.send(contenido);
});

app.post('/datos', async (req, res) => {
    const apiURL = 'https://rickandmortyapi.com/graphql';
    const seleccion = parseInt(req.body.seleccion);
    console.log('Selección recibida:', seleccion);
    const consultaGraphQL = `
    query {
        characters(page: ${seleccion}) {
        info {
            count
        }
        results {
            name
            image
            species
            status
            gender
            location {
            name
            }
        }
        }
    }`;
    try {
        const response = await axios.post(apiURL, { query: consultaGraphQL });
        const data = response.data;
        res.json(data.data.characters.results);
    } catch (error) {
        console.error('Error al obtener los personajes', error.response.data);
        res.status(500).send('Error interno del servidor');
    }
});


server.listen(port, () => {
    console.log(`App escuchando en el puerto ${port}`);
});
