const { response } = require('express');
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const getBusquedas = async(req, resp = response) => {

    const busqueda = req.params.data;
    const regex = new RegExp(busqueda, 'i');

    const [usuarios, hospitales, medicos] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Hospital.find({ nombre: regex }),
        Medico.find({ nombre: regex })
    ]);

    //const usuarios = await Usuario.find({ nombre: regex });

    resp
        .json({
            ok: true,
            msg: 'Listando por busqueda',
            usuarios,
            hospitales,
            medicos
        });
};


const getBusquedasPorColeccion = async(req, resp = response) => {
    const collection = req.params.collection.toLowerCase();
    const busqueda = req.params.data;
    const regex = new RegExp(busqueda, 'i');

    let data;
    switch (collection) {
        case 'usuario':
            data = await Usuario.find({ nombre: regex });
            break;
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                .populate('usuario', 'nombre img')
                .populate('hospital', 'nombre img');
            break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regex }).populate('usuario', 'nombre img');
            break;

        default:
            return resp.status(400).json({
                ok: false,
                msg: 'La colección no existe'
            });
    }

    resp
        .json({
            ok: true,
            msg: 'Búsqueda por colección',
            tabla: collection,
            resultado: data
        });
};

module.exports = {
    getBusquedas,
    getBusquedasPorColeccion,
};