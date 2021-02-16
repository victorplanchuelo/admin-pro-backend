/**
 * Path: /api/hospitales
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { getHospitales, postHospitales, putHospitales, deleteHospitales } = require('../controllers/hospitales');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', getHospitales);


router.post('/', [
        validarJWT,
        check('nombre', 'El nombre del hospital es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    postHospitales
);

router.put('/:id', [],
    putHospitales
);

router.delete('/:id', deleteHospitales);


module.exports = router;