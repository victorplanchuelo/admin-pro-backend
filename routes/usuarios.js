/**
 * Ruta: /api/usuarios
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, postUsuario, putUsuario, deleteUsuario } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);
router.post('/', [
        check('nombre', 'Nombre es obligatorio').not().isEmpty(),
        check('apellido1', 'Primer apellido es obligatorio').not().isEmpty(),
        check('password', 'Password es obligatorio').not().isEmpty(),
        check('email', 'Email es obligatorio').isEmail(),
        validarCampos,
    ],
    postUsuario
);

router.put('/:id', [
        validarJWT,
        check('nombre', 'Nombre es obligatorio').not().isEmpty(),
        check('apellido1', 'Primer apellido es obligatorio').not().isEmpty(),
        check('email', 'Email es obligatorio').isEmail(),
        //check('role', 'Rol es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    putUsuario
);

router.delete('/:id', validarJWT, deleteUsuario);

module.exports = router;