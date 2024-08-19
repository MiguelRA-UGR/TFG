const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
require('./database');

// Crear la aplicación Express
const app = express();

// Configuración del puerto
app.set('port', process.env.PORT || 4000);

// Middlewares
app.use(cors(
    {
        origin: ["https://frontenddeployment-miguelra-ugrs-projects.vercel.app"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    }
));
app.use(express.json());
app.use(express.static('public'));

// Rutas existentes
app.get('/', (req, res) => {
    res.send('Ejecutando API REST full');
});

app.use('/api/users', require('./routes/users'));
app.use('/api/dests', require('./routes/dests'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/photos', require('./routes/photos'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/forums', require('./routes/forums'));
app.use('/api/threads', require('./routes/threads'));
app.use('/api/replies', require('./routes/replies'));
app.use('/api/notifications', require('./routes/notifications'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo no ha ido bien!');
});

// Iniciar el servidor
async function main() {
    try {
        await app.listen(app.get('port'));
        console.log('Ejecutando servidor en el puerto', app.get('port'));
    } catch (err) {
        console.error('Error al iniciar el servidor:', err);
    }
}

main();
