const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const Hospital = require('../models/hospital');

const getHospitales = async(req, resp = response) => {
    const hospitales = await Hospital.find().populate('usuario', 'nombre img');

    resp
        .json({
            ok: true,
            msg: 'Listando hospitales',
            hospitales
        });
};

const postHospitales = async(req, resp = response) => {

    const uidUsuario = req.uid;

    const hospital = new Hospital({
        usuario: uidUsuario,
        ...req.body
    });

    try {
        const hospitalDB = await hospital.save();

        resp
            .json({
                ok: true,
                msg: 'Crear hospitales',
                hospital: hospitalDB
            });
    } catch (error) {
        resp
            .status(500)
            .json({
                ok: false,
                msg: 'Error inesperado al crear el hospital',
            });
    }


};

const putHospitales = async(req, resp = response) => {

    resp
        .json({
            ok: true,
            msg: 'Actualizar hospitales',
            //hospitales
        });
};

const deleteHospitales = async(req, resp = response) => {

    resp
        .json({
            ok: true,
            msg: 'Borrar hospitales',
            //hospitales
        });
};

module.exports = {
    getHospitales,
    postHospitales,
    putHospitales,
    deleteHospitales,
};