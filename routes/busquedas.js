const { Router } = require('express');
const { getBusquedas, getBusquedasPorColeccion } = require('../controllers/busquedas');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:data', validarJWT, getBusquedas);
router.get('/:collection/:data', validarJWT, getBusquedasPorColeccion);

module.exports = router;