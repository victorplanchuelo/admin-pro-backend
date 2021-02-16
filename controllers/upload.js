const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

const { uploadImage } = require('../helpers/upload-image');

const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const putUploadImage = async(req, resp = response) => {
    const collection = req.params.collection.toLowerCase();
    const id = req.params.id;

    const tiposValidos = ['usuarios', 'hospitales', 'medicos'];

    if (!tiposValidos.includes(collection)) {
        return resp.status(400).json({
            ok: false,
            msg: 'La colección indicada debe ser usuarios/medicos/hospitales'
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return resp.status(400).json({
            ok: false,
            msg: 'No se subió ningún archivo.'
        });
    }

    // Procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return resp.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    // Crear path para guardar imagen
    const path = `./uploads/${collection}/${nombreArchivo}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        // Actualizar la BBDD
        uploadImage(collection, id, nombreArchivo);

        resp
            .json({
                ok: true,
                msg: 'Archivo subido',
                nombreArchivo
            });
    });
};

const getImage = async(req, resp = response) => {
    const collection = req.params.collection.toLowerCase();
    const image = req.params.image;

    // const pathImg = `./uploads/${tipo}/${image}`;
    const pathImg = path.join(__dirname, `../uploads/${collection}/${image}`);

    // Si no existe el path sacamos imagen por defecto
    if (fs.existsSync(pathImg)) {
        resp.sendFile(pathImg);
    }

    resp.sendFile(path.join(__dirname, `../uploads/no-img.jpg`));
};

module.exports = {
    putUploadImage,
    getImage
};