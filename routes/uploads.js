const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { check } = require('express-validator');
const { fileUpload, retornaImagen } = require('../controllers/uploads');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.use(expressFileUpload());

/**
 *  ruta: /api/uploads 
 */

router.put('/:tipo/:id', validarJWT, fileUpload);

router.get('/:tipo/:foto', retornaImagen);


module.exports = router;