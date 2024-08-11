
const express = require('express');
const Evento = require('../models/Evento');

const getEventos = async (req, res= express.response) => {

    const eventos = await Evento.find().populate('user', 'name');

    res.status(200).json({
        ok: true,
        msg: 'Eventos obtenidos correctamente',
        eventos
    })
}

const actualizarEvento = async(req, res = express.response) => {

    const eventoId = req.params.id;
    const uid = req.uid;
    try {

        const evento = await Evento.findById(eventoId);

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe',
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos para editar este evento',
            })
        }
        
        const nuevoEvento = {
            ...req.body,
            user:uid,
        }

        const eventoactualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new : true});


        return res.status(200).json({
            ok: true,
            msg: 'Actualizar eventos',
            evento: eventoactualizado
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el evento',
            error
        })
    }

}

const crearEvento = async(req, res = express.response) => {

    try {

        const evento = new Evento(req.body);
        evento.user = req.uid;

        await evento.save();

        return res.status(200).json({
            ok: true,
            msg: 'Crear evento',
            evento
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el evento',
            error
        })
    }


}

const eliminarEvento = async(req, res = express.response) => {


    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe',
            })
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos para editar este evento',
            })
        }

        await Evento.findByIdAndDelete(eventoId);

        res.status(200).json({
            ok: true,
            msg: 'Evento eliminado',
        })
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el evento',
            error
        })
    }
}

module.exports = {
    getEventos,
    actualizarEvento,
    crearEvento,
    eliminarEvento,
    // ... otros métodos
}