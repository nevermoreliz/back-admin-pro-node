const { request, response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require("../models/usuario")
const { generarJWT } = require("../helpers/jwt")

const getUsuarios = async (req = request, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google img').skip(desde).limit(5),
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios,
        total
    })
}

const crearUsuario = async (req = request, res = response) => {
    const { email, password } = req.body

    try {

        const existeEmail = await Usuario.findOne({ email })
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'el Correo ya esta registrado'
            })
        }

        const usuario = new Usuario(req.body)

        // encriptar contraseña
        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync(password, salt)

        // guardar Usuario
        await usuario.save();

        // generar el Token - JWT
        const token = await generarJWT(usuario.id)

        res.json({
            ok: true,
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'error en el servidor'
        })
    }

}

// TODO: validar token y comprobar si es el usuario correscto
const actualizarUsuario = async (req = request, res = response) => {

    const uid = req.params.id
    try {

        const usuarioDb = await Usuario.findById(uid)
        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'no existe un usuario por ese id'
            })
        }

        const { password, google, email, ...campos } = req.body;

        if (usuarioDb.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

// 
const borrarUsuario = async (req = request, res = response) => {
    const uid = req.params.id;

    try {
        const usuarioDb = await Usuario.findById(uid);
        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            })
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}