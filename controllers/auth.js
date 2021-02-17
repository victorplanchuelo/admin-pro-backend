const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const postLoginGoogle = async(req, res = response) => {

    const googleToken = req.body.token;

    try {
        const { given_name, family_name, email, picture } = await googleVerify(googleToken);

        // Verificar si hay alguien con ese email
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        //console.log(usuarioDB);

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: given_name,
                apellido1: family_name,
                email,
                password: '@@@',
                img: picture,
                google: true,
                role: 'USER_ROLE'
            });
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            msg: 'Google Signin',
            token
        });

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token invalido'
        });
    }

};

const getRenewToken = async(req, res = response) => {

    const uid = req.uid;
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        token
    });
};


module.exports = {
    postLogin,
    postLoginGoogle,
    getRenewToken
};