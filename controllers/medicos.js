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
                medico: medicoDB
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
    const uid = req.uid;
    const id = req.params.id;

    try {
        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            return resp.status(404).json({
                ok: false,
                msg: 'No existe el médico con ese ID'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        };

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        resp
            .json({
                ok: true,
                msg: 'Actualizado medico',
                medico: medicoActualizado
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

const deleteMedicos = async(req, resp = response) => {

    const id = req.params.id;
    try {
        const medicoDB = await Medico.findById(id);

        if (!medicoDB) {
            return resp.status(404).json({
                ok: false,
                msg: 'No existe el médico con ese ID'
            });
        }

        await Medico.findByIdAndDelete(id);

        resp
            .json({
                ok: true,
                msg: 'Borrado médico',
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
    getMedicos,
    postMedicos,
    putMedicos,
    deleteMedicos,
};