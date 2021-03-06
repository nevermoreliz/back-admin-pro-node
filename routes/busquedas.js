const { Router } = require('express');
const { check } = require('express-validator');
const { getTodo, getDocumentosColeccion } = require('../controllers/busquedas');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


/**
 *  ruta: /api/todo 
 */

router.get('/:busqueda', validarJWT, getTodo);

router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColeccion);



module.exports = router;