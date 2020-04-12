// Require

var express = require('express');
var mongoose = require('mongoose');

// Inicializamos las variables
var app = express();


// Conectamos a la db
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;
    console.log("Base de datos - \x1b[32m%s\x1b[0m", "online");
});

// Rutas

app.get("/", (req, resp, next) => {
    resp.status(200).json({
        ok: true,
        mensaje: 'Todo esta bien'
    });
});

// Escuchamos el puerto 3000
app.listen(3000, () => {
    console.log("Corriendo en el puerto 3000 - \x1b[32m%s\x1b[0m", "online");
});