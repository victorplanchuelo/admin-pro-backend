const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const deleteImage = (path) => {
    if (fs.existsSync(path)) {
        //Se borra la imagen anterior
        fs.unlinkSync(path);
    }
};

const findModelAndSaveNewImage = async(model, tipo, nombreArchivo, id) => {
    const varModel = await model.findById(id);
    if (!varModel) {
        return false;
    }

    const oldPath = `./uploads/${tipo}/${varModel.img}`;
    deleteImage(oldPath);

    varModel.img = nombreArchivo;
    await varModel.save();
    return true;
};

const uploadImage = async(tipo, id, nombreArchivo) => {
    let oldPath = '';
    switch (tipo) {
        case 'medicos':
            return await findModelAndSaveNewImage(Medico, tipo, nombreArchivo, id);
        case 'hospitales':
            return await findModelAndSaveNewImage(Hospital, tipo, nombreArchivo, id);
        case 'usuarios':
            return await findModelAndSaveNewImage(Usuario, tipo, nombreArchivo, id);
    }
};

module.exports = {
    uploadImage
};