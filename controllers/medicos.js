const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const Medico = require('../models/medico');

const getMedicos = async(req, resp = response) => {
    const medicos = await Medico
        .find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre');

    resp
        .json({
            ok: true,
            msg: 'Listando medicos',
            medicos
        });
};

const postMedicos = async(req, resp = response) => {

    const uidUsuario = req.uid;

    const medico = new Medico({
        usuario: uidUsuario,
        ...req.body
    });

    try {
        const medicoDB = await medico.save();

        resp
            .json({
                ok: true,
                msg: 'Crear médico',
                hospital: medicoDB
            });
    } catch (error) {
        resp
            .status(500)
            .json({
                ok: false,
                msg: 'Error inesperado al crear el médico',
            });
    }
};

const putMedicos = async(req, resp = response) => {

    resp
        .json({
            ok: true,
            msg: 'Actualizar medicos',
            //medicos
        });
};

const deleteMedicos = async(req, resp = response) => {

    resp
        .json({
            ok: true,
            msg: 'Borrar medicos',
            //medicos
        });
};

module.exports = {
    getMedicos,
    postMedicos,
    putMedicos,
    deleteMedicos,
};