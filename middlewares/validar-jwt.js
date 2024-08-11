const {response} = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {

    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            ok:false,
            msg: 'No hay token en la cabecera'
        });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.SCRET_JWT_SEED
        );

        console.log(payload);

        req.name = payload.name;
        req.uid = payload.uid;

        

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token invalido'
        })
    }

    next();

}

module.exports = {
    validarJWT
}