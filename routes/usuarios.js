// ============================================================
//  Importaciones
// ============================================================
var express = require('express');
var Usuarios = require('../models/usuario');
var bcrypt = require('bcryptjs');
var authMiddleware = require('../middleware/auth');

// ============================================================
//  Configurando variables
// ============================================================
var app = express();



// ============================================================
//  Usuario CRUD
// ============================================================

// ============================================================
//  Listar todos los usuarios
// ============================================================
app.get('/', (req, resp, next) => {
    Usuarios.find({}, 'nombre email img role').exec((error, queryData) => {
        if(error){
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error en la base de datos',
                errors: error
            });
        }
        resp.status(200).json({
            ok: true,
            usuario: queryData
        });
    });
});

// app.use('/', (req, resp, next) => {
//     var token = req.query.token;
//
//     jwt.verify(token, SEED, (error, decoded) => {
//         if(error){
//             return resp.status(401).json({
//                 ok: false,
//                 mensaje: 'El token no es válido',
//                 errors: error
//             });
//         } else {
//             next();
//         }
//     })
// });

// ============================================================
//  Crear nuevo usuario
// ============================================================
app.post('/', authMiddleware.verificaToken, (req, resp) =>{

    const body = req.body;

    const usuario = new Usuarios({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    usuario.save((error, saveOk) => {
        if(error) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: error
            });
        }
        resp.status(201).json({
            ok: true,
            usuario: saveOk,
            usuarioToken: req.usuario
        });
    });
});

// ============================================================
//  Actualizar usuario
// ============================================================

app.put('/:id', authMiddleware.verificaToken, (req, resp) => {
    const id = req.params.id;
    const body = req.body;

    Usuarios.findById(id, (errorBuscando, usuario) => {
        if(errorBuscando){
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: errorBuscando
            });
        }

        if(!usuario){
            return resp.status(404).json({
                ok: false,
                mensaje: `El usuario con id: ${id} no existe en la base de datos`,
                errors: { message: 'Usuario no encontrado'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save((errorGuardando, usuarioGuardado) => {
            if(errorGuardando){
                return resp.status(404).json({
                    ok: false,
                    mensaje: 'Error al guardar usuario',
                    errors: errorGuardando
                });
            }
            usuarioGuardado.password = undefined;
            resp.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuario
            });
        });
    });
});

// ============================================================
//  Eliminar usuario mediante id
// ============================================================
app.delete('/:id', authMiddleware.verificaToken, (req, resp) => {

    const id = req.params.id;

    Usuarios.findByIdAndRemove(id, (errorEliminado, usuarioEliminado) => {

        if(errorEliminado) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar usuario',
                errors: errorEliminado
            })
        }

        if(!usuarioEliminado){
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe el usuario en la base de datos',
                errors: { message: 'No existe el usuario en la base de datos' }
            })
        }

        usuarioEliminado.password = undefined;

        resp.status(200).json({
            ok: true,
            usuario: usuarioEliminado,
            usuarioToken: req.usuario
        });
    });


});

module.exports = app;