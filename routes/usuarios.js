const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


/**
 *  ruta: /api/usuarios 
 */

/**
 * Peticiones Get
 */
router.get('/', validarJWT,getUsuarios);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
], crearUsuario);


/**
 * Peticiones Put
 */
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El rol es obligatorio').not().isEmpty(),
    validarCampos
], actualizarUsuario);

/**
 * Peticiones Delete
 */
 router.delete('/:id', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El rol es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], borrarUsuario);


module.exports = router;