const mongoose = require('mongoose');

//Cadena de conexión - Operador ternario para utilizar MONGODB_URI u otra cadena alternativa en caso de no encontrarla
const URI = process.env.MONGODB_URI

mongoose.connect(URI);

const connection= mongoose.connection;

connection.once('open', ()=>(
    console.log('Conexión exitosa a ',URI)
))