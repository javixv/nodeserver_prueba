/*
 * Validacion de TOKEN 
 */

 /**
  * Creaccion de un middleware
  */
const jwt = require('jsonwebtoken');

  let validacionToken = (req, res, next) => {

    // obtengo el header
    let token = req.get('token');

    //verificar el token
    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                ok : false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();

    })  


  }

  let verificarROL = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

  };

  let validacionTokenImagen = (req, res, next) => {
      let token = req.query.token;

      //verificar el token
    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                ok : false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();

    }) 
  }

  module.exports = {
      validacionToken,
      verificarROL,
      validacionTokenImagen
  }