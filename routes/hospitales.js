/**
 *  hospitales
 *  ruta : '/api/hospitales'
 */


const { Router } = require('express');
const { check } = require('express-validator');
const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


/**
 * Peticiones Get
 */
router.get('/', getHospitales);

// crear un hospital
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
    validarCampos
], crearHospital);


/**
 * Peticiones Put
 */
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre del hospital es necesario.').not().isEmpty(),
    validarCampos

], actualizarHospital);

/**
 * Peticiones Delete
 */
router.delete('/:id', [
    validarJWT
], borrarHospital);


module.exports = router;
