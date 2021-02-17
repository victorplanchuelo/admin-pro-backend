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

    const uid = req.uid;
    const id = req.params.id;
    try {
        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return resp.status(404).json({
                ok: false,
                msg: 'No existe el hospital con ese ID'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        };

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, { new: true });

        resp
            .json({
                ok: true,
                msg: 'Actualizado hospital',
                hospital: hospitalActualizado
            });

    } catch (error) {
        console.log(error);
        resp.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }




    resp
        .json({
            ok: true,
            msg: 'Actualizar hospitales',
            //hospitales
        });
};

const deleteHospitales = async(req, resp = response) => {
    const id = req.params.id;
    try {
        const hospitalDB = await Hospital.findById(id);

        if (!hospitalDB) {
            return resp.status(404).json({
                ok: false,
                msg: 'No existe el hospital con ese ID'
            });
        }

        await Hospital.findByIdAndDelete(id);

        resp
            .json({
                ok: true,
                msg: 'Borrado hospital',
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
    getHospitales,
    postHospitales,
    putHospitales,
    deleteHospitales,
};