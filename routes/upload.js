const { Router } = require('express');
const fileUpload = require('express-fileupload');
const { putUploadImage, getImage } = require('../controllers/upload');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.use(fileUpload());

router.put('/:collection/:id', validarJWT, putUploadImage);

router.get('/:collection/:image', getImage);

module.exports = router;