/**
 * Rutas de usuarios
 * host + /api/events
 */


const {Router} = require('express');
const {check} = require('express-validator');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarcampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');
const router = Router();

router.use(validarJWT);

router.get('/',  getEventos);

router.post(
    '/', 
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de inicio es obligatoria').custom(isDate),
        validarcampos
    ],
    crearEvento);

router.put(
    '/:id', 
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de inicio es obligatoria').custom(isDate),
        validarcampos
    ],
    actualizarEvento);

router.delete('/:id',  eliminarEvento);

module.exports = router;