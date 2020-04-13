// ============================================================
//  Importaciones
// ============================================================
var express = require('express');
var Usuarios = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ============================================================
//  Configurando variables
// ============================================================
var app = express();

app.post('/', (req, resp, next) => {
    const body = req.body;

    Usuarios.findOne({ email: body.email }, (errorLogin, usuarioDB) => {
        if(errorLogin){
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario.',
                errors: errorLogin
            });
        }

        if(!usuarioDB){
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error en credenciales - email',
                errors: { mesagge: 'El e-mail no existe en la base de datos.'}
            });
        }

        if(!body.password || !bcrypt.compareSync(body.password, usuarioDB.password)){
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error en credenciales - password',
                errors: { mesagge: 'La contraseña es incorrecta.'}
            });
        }
        usuarioDB.password = undefined;
        const token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 })
        resp.status(200).json({
            ok: true,
            usuario: usuarioDB,
            id: usuarioDB._id,
            token
        });
    });
});


module.exports = app;