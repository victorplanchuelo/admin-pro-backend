/**
 * Ruta: /api/login
 * Ruta: /api/register
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { postLogin } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', [
        check('password', 'Password es obligatorio').not().isEmpty(),
        check('email', 'Email es obligatorio').isEmail(),
        validarCampos,
    ],
    postLogin
);


module.exports = router;