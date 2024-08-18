const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

//Configuración
app.set('port', process.env.PORT || 4000);

//Middlewares
app.use(cors(
    {
        origin: ["https://deploy-ern-1whq.vercel.app"],
        methods: ["POST","GET"],
        credentials: true
    }
));
app.use(express.json());
app.use(express.static('public'));


// Rutas existentes
app.get('/', (req, res) =>{
    res.send('Ejecutando API REST full')
})

app.use('/api/users', require('./routes/users'));
app.use('/api/dests', require('./routes/dests'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/photos', require('./routes/photos'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/forums', require('./routes/forums'));
app.use('/api/threads', require('./routes/threads'));
app.use('/api/replies', require('./routes/replies'));
app.use('/api/notifications', require('./routes/notifications'));

//Exportar la app para utilizarlo en otras partes del proyecto
module.exports = app;
