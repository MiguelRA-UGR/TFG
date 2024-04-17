const express = require('express');
const cors = require('cors');
const app = express();

//Configuración
//Definir Puerto de escucha del servidor (el 4000 o cualquier otro disponible)
//4000 para que no choque con el 3000 que utiliza React por defecto
app.set('port', process.env.PORT || 4000);

//Middlewares
app.use(cors());
app.use(express.json());

//Rutas
app.get('/', (req, res) =>{
    res.send('Ejecutando API REST full')
})

//Ruta para API de usuarios
app.use('/api/users', require('./routes/users'));
app.use('/api/dests', require('./routes/dests'));

//Exportar la app para utilizarlo en otras partes del proyecto
module.exports = app;