const app = require('./app');

// Iniciar el servidor
const server = app.listen(app.get('port'), () => {
    console.log('Ejecutando servidor en el puerto', app.get('port'));
});

module.exports = { app, server };