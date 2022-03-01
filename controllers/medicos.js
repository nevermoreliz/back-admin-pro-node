const { request, response } = require('express')
const Medico = require('../models/medico')

const getMedicos = async (req = request, res = response) => {

    try {

        const medicos = await Medico.find()
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');

        res.json({
            ok: true,
            medicos
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
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


const actualizarMedico = async (req = request, res = response) => {


    const id = req.params.id;
    const uid = req.uid;
    try {

        const medico = await Medico.findById(id);
        if (!medico) {

            res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado por id.'
            });

        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const borrarMedico = async (req = request, res = response) => {

    const id = req.params.id;

    try {

        const medico = await Medico.findById(id);
        if (!medico) {

            res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado por id.'
            });

        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            medico: 'Medico Borrado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}