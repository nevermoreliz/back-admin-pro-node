/**
 *  hospitales
 *  ruta : '/api/medicos'
 */


const { Router } = require('express');
const { check } = require('express-validator');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


/**
 * Peticiones Get
 */
router.get('/', getMedicos);

/**
 *  Peticiones Post
 */

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe ser valido').isMongoId(),
    validarCampos
], crearMedico);


/**
 * Peticiones Put
 */
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe ser valido').isMongoId(),
    validarCampos

], actualizarMedico);

/**
 * Peticiones Delete
 */
router.delete('/:id', [

], borrarMedico);


module.exports = router;
