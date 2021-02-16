/**
 * Path: /api/medicos
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { getMedicos, postMedicos, putMedicos, deleteMedicos } = require('../controllers/medicos');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', getMedicos);


router.post('/', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio'),
        check('hospital', 'El Id del hospital debe ser válido').isMongoId(),
        validarCampos
    ],
    postMedicos
);

router.put('/:id', [],
    putMedicos
);

router.delete('/:id', deleteMedicos);


module.exports = router;