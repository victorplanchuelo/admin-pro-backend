const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const Usuario = require('../models/usuario');

const getUsuarios = async(req, resp) => {
    const desde = Number(req.query.desde) || 0;

    // const usuarios = await Usuario
    //     .find({}, 'nombre apellido1 email role google')
    //     .skip(desde)
    //     .limit(5);
    // const total = await Usuario.countDocuments();

    const [usuarios, total] = await Promise.all([
        Usuario
        .find({}, 'nombre apellido1 email role google')
        .skip(desde)
        .limit(5),

        Usuario.countDocuments()

    ]);


    resp
        .json({
            ok: true,
            msg: 'Listando usuarios',
            usuarios,
            totalUsuarios: total
        });
};

const postUsuario = async(req, resp = response) => {
    const { email, password } = req.body;

    try {
        const userExist = await Usuario.findOne({ email });

        if (userExist) {
            return resp.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //Generamos token
        const token = await generarJWT(usuario.id);

        resp
        //.status(404)
            .json({
            ok: true,
            msg: 'Creando usuario',
            usuario,
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

const putUsuario = async(req, resp = response) => {

    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return resp.status(404).json({
                ok: false,
                msg: 'No existe el usuario con ese ID'
            });
        }

        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {
            const ExisteEmail = await Usuario.findOne({ email });

            if (ExisteEmail) {
                return resp.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese correo'
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        resp
            .json({
                ok: true,
                msg: 'Actualizando usuario',
                usuario: usuarioActualizado
            });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const deleteUsuario = async(req, resp) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return resp.status(404).json({
                ok: false,
                msg: 'No existe el usuario con ese ID'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        resp
            .json({
                ok: true,
                msg: 'Borrando usuario',
                uid
            });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario
};