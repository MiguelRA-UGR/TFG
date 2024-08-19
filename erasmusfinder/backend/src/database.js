const mongoose = require('mongoose');

//Cadena de conexión - Operador ternario para utilizar MONGODB_URI u otra cadena alternativa en caso de no encontrarla
const URI = `mongodb+srv://erasmus_finder_admin:erasmus_finder_admin@erasmusfindercluster.b2als.mongodb.net/?retryWrites=true&w=majority&appName=ErasmusFinderCluster`

mongoose.connect(URI);

const connection= mongoose.connection;

connection.once('open', ()=>(
    console.log('Conexión exitosa a ',URI)
))