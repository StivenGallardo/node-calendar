/**
 * Rutas de usuarios
 * host + /api/auth
 */


const {Router} = require('express');
const {check} = require('express-validator');
const router = Router();

const {crearUsuario, loginUsuario, revalidarToken} = require('../controllers/auth');
const { validarcampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
    '/new', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatorio minimo 6 caracteres').isLength({min: 6}),
        validarcampos
    ],
    crearUsuario);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatorio minimo 6 caracteres').isLength({min: 6}),
        validarcampos
    ],  
    loginUsuario );


router.get(
    '/renew', 
    [
        validarJWT
    ],  
    revalidarToken)

module.exports = router;