const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');
const crearUsuario = async(req, res = express.response) => {

    const {email, password} = req.body;

    try {
        
        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El email ya está registrado',
            })
        }
        
        usuario = new Usuario(req.body);

        //Encriptar contraseña

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //generar token
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            msg: 'Usuario creado correctamente',
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el usuario',
            error
        })
    }

}

const loginUsuario = async(req, res = express.response) => {

    const {email, password} = req.body;

    try {

        const usuario = await Usuario.findOne({email});

        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe',
            })
        }

        //confirmar contraseña

        const validPassword  = bcrypt.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta',
            })
        }

        //generar token
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok:true,
            msg: "login",
            uid: usuario.id,
            name: usuario.name,
            token
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
            error
        })
    }


}

const revalidarToken = async(req, res = express.response) => {

    const uid = req.uid;
    const name = req.name;

    //generar token
    const token = await generarJWT(uid, name);

    res.json({
        ok:true,
        msg:"renew",
        uid,name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}