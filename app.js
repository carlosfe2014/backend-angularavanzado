// ============================================================
//  Importaciones
// ============================================================
var express = require('express');
var mongoose = require('mongoose');
var appRutes = require('./routes/app');
var bodyParser = require('body-parser');
var appUsuarios = require('./routes/usuarios');
var appLogin = require('./routes/login');



// ============================================================
//  Inicializamos las variables
// ============================================================
var app = express();
// BodyParser: configuración para que procese datos de application/x-www-form-urlencoded
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ============================================================
//  Conectamos a la base de datos
// ============================================================
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;
    console.log("Base de datos - \x1b[32m%s\x1b[0m", "online");
});

// ============================================================
//  Rutas
// ============================================================
app.use('/login', appLogin);
app.use('/usuarios', appUsuarios);
app.use('/', appRutes);


// ============================================================
//  Levantamos el servidor en el puerto 3000
// ============================================================
app.listen(3000, () => {
    console.log("Corriendo en el puerto 3000 - \x1b[32m%s\x1b[0m", "online");
});