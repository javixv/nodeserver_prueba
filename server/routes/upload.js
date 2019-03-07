const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
// Llamar al modelo de usuario
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')

const fs = require('fs');
const path = require('path');


// default options
app.use(fileUpload());


app.post('/upload/:tipo/:id', (req, res) => {

  let tipo = req.params.tipo
  
  let id = req.params.id

  if (Object.keys(req.files).length == 0) {
    return res.status(400)
      .json({
        ok: true,
        err: {
          message: 'No files were uploaded.'
        }
      });
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo;

  /**
   * Validar tipos
   */
  let tiposValidos = ['products', 'user']

  if (tiposValidos.indexOf(tipo) < 0) {

    return res.json({
      ok: false,
      message: 'tipos permitidos son: ' + tiposValidos.join(','),

    })
  }

  /**
   *  Validacion de extenciones
   */
  let file_Name = archivo.name.split('.');
  let extencion = file_Name[file_Name.length - 1];

  let extenciones = ['jpg', 'gif', 'png']

  if (extenciones.indexOf(extencion) < 0) {
    return res.json({
      ok: false,
      message: 'extenciones no permitida. Tu archivo requiere una extencion ' + extenciones.join(','),
      ext: extencion
    })
  }

  /**
   * Cambiar nombre del archivo
   */

  let fileName = `${id}-${new Date().getMilliseconds()}.${extencion}`;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${fileName}`, function (err) {
    if (err)
      return res.status(500).json({
        err
      });

    // Asignar imagen
     if (tipo === 'user') {
      imagenUsuario(id, res, fileName);     
     
     } 
     else {
       imagenProducto(id, res, fileName);
      
     }

    

  });

});

/**
 * Asignar imagen a un usuario
 */
function imagenUsuario(id, res, nombreArchivo) {
  
  Usuario.findById(id, (err, usuarioDB) => {

    if (err) {
      deleteImg(nombreArchivo, 'user')
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!usuarioDB) {
      deleteImg(nombreArchivo, 'user')
      return res.status(500).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      })
    }
    // Construir una ruta en espacifica de la img

    deleteImg(usuarioDB.img, 'user')

    usuarioDB.img = nombreArchivo;
    

    usuarioDB.save((err, userSave) => {

      res.json({
        ok: true,
        usuario: userSave,
        img: nombreArchivo
      })
    })
  })
}

/**
 * Asignar imagen a un producto
 */
function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {

    // Vereficar de si hay un error
    if (err) {
      deleteImg(nombreArchivo, 'products')
      return res.status(500).json({
        ok: false,
        err
      })
    };

    // Vereficar si el producto existe
    if (!productoDB) {
      deleteImg(nombreArchivo, 'products')
      return res.status(500).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      })
    };

    //Eliminar la imagen del servidor
    deleteImg(productoDB.img, 'products');

    productoDB.img = nombreArchivo;

    // Guardar los cambios en la DB de la tabla de productos
    productoDB.save((err, productSave) => {

      if (err) {
        deleteImg(nombreArchivo, 'products')
        return res.status(500).json({
          ok: false,
          err : {
            message : 'Error al actulizar la imagen'
          }
        })
      };

      res.json({
        ok: true,
        producto: productSave,
        img: nombreArchivo
      })
    });
  });
}

function deleteImg(nameImg, tipo) {
  let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nameImg}`);

  if (fs.existsSync(pathImg)) {

    fs.unlinkSync(pathImg);
  }
}

module.exports = app;