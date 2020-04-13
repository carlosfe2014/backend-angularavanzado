var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


exports.verificaToken = (req, resp, next) => {
    var token = req.query.token;

    jwt.verify(token, SEED, (error, decoded) => {
        if(error){
            return resp.status(401).json({
                ok: false,
                mensaje: 'El token no es válido',
                errors: error
            });
        } else {
            req.usuario = decoded.usuario;
            next();
        }
    })
};