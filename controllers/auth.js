const { response, request } = require("express");
const bcrypt = require('bcryptjs')
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {

    const { email, password } = req.body;

    try {
        // verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        // verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Password no válida'
            })
        }

        // generar el Token - JWT
        const token = await generarJWT(usuarioDB.id)

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        })
    }

}

const googleSingIn = async (req = request, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        // verificar si el usuario existe
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {

            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });

        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // guardar en la base de datos
        await usuario.save();

        // generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',
        });

    }

}

const renewToken = async (req = request, res = response) => {

    const uid = req.uid

    // generar nuevo token = JWT    
    const token = await generarJWT(uid);

    res.json({
        ok: true,
        token
    });

}

module.exports = {
    login,
    googleSingIn,
    renewToken
}