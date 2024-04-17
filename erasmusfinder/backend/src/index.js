require('dotenv').config()

//Traer app desde el archivo app.js
const app = require('./app');
require('./database')

//Configuración de la lógica del servidor
async function main(){
    //Escuchar el port a través de la aplicación
    await app.listen(app.get('port'));
    console.log('Ejecutando servidor en el puerto', app.get('port'));
}

main();