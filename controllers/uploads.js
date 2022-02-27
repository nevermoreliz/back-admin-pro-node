const {request, response} = require('express');
const {v4: uuidv4} = require('uuid');
const {actualizarImagen} = require('../helpers/actualizar-imagen');

const path = require('path');
const fs = require("fs");

const fileUpload = async (req = request, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;


    try {

        // validar tipo
        const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({
                ok: false,
                msg: 'No es un medico, usuario u hospital'
            })
        }

        // validar que exista un archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'no hay ningun archivo'
            });
        }

        // procesar la imagen .....
        const file = req.files.imagen;

        const nombreCortado = file.name.split('.');
        const extensionArchivo = nombreCortado[nombreCortado.length - 1];

        // validar extensionArchivo
        const extensionesValida = ['png', 'jpg', 'jpeg', 'gif'];
        if (!extensionesValida.includes(extensionArchivo)) {
            return res.status(400).json({
                ok: false,
                msg: 'No es una extension permitida'
            })
        }

        // generar el nombre del archivo
        const nombreArchivo = `${uuidv4()}.${extensionArchivo}`

        // path para guardar la imagen
        const path = `./uploads/${tipo}/${nombreArchivo}`;

        // mover la imagen
        file.mv(path, (err) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al mover la imagen'
                });
            }

            // actualizar base de datos
            actualizarImagen(tipo, id, nombreArchivo);

            res.json({
                ok: true,
                msg: 'Archivo subido',
                nombreArchivo
            });
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const retornaImagen = (req = request, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }


}

module.exports = {
    fileUpload,
    retornaImagen
}