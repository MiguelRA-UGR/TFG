const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

//Configuración
app.set('port', process.env.PORT || 4000);

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ruta para obtener la lista de nombres de archivos de insignias
const badgesFolderPath = path.join(__dirname, '../public/imgs/badges');
app.get('/api/badges', (req, res) => {
  fs.readdir(badgesFolderPath, (err, files) => {
    if (err) {
      console.error('Error al leer la carpeta de insignias:', err);
      res.status(500).send('Error interno del servidor');
    } else {
        const badgeNames = files.map(file => path.parse(file).name);
        res.json(badgeNames);
    }
  });
});

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

//Exportar la app para utilizarlo en otras partes del proyecto
module.exports = app;
