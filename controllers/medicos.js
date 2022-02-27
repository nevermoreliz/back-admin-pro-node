const { request, response } = require('express')
const Medico = require('../models/medico')

const getMedicos = async (req = request, res = response) => {

    

    try {

        const medicos = await Medico.find()
        .populate('usuario','nombre img')
        .populate('hospital', 'nombre img');

        res.json({
            ok: true,
            medicos
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        })
    }
    
}

const crearMedico = async (req = request, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB,
            msg: 'crearMedico'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Administrador'
        });

    }
}


const actualizarMedico = (req = request, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarMedico'
    })
}

const borrarMedico = (req = request, res = response) => {
    res.json({
        ok: true,
        msg: 'borrarMedico'
    })
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}