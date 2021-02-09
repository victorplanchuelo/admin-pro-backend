const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const Usuario = require('../models/usuario');

const postLogin = async(req, resp = response) => {
    const { email, password } = req.body;

    try {
        // Verificamos email
        const usuarioBD = await Usuario.findOne({ email });

        if (!usuarioBD) {
            return resp.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Verificamos password
        const validPass = bcrypt.compareSync(password, usuarioBD.password);
        if (!validPass) {
            return resp.status(400).json({
                ok: false,
                msg: 'El password no es correcto'
            });
        }

        // Generar el Token - JWT
        const token = await generarJWT(usuarioBD.id);

        resp
            .json({
                ok: true,
                msg: 'Login',
                token
            });
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado ... revisar logs'
        });
    }
};


module.exports = {
    postLogin,
};