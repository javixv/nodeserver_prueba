const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();


// default options
app.use(fileUpload());


app.post('/upload', (req, res) => {

    if (Object.keys(req.files).length == 0) {
        return res.status(400)
                  .json({
                      ok: true,
                      err : {
                            message :'No files were uploaded.'
                        }                        
                        });
      }

      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo;


  /**
   *  Validacion de extenciones
   */
   let fileName = archivo.name.split('.');
   let extencion = fileName[fileName.length -1];

   let extenciones = ['jpg', 'gif','png']

   if (extenciones.indexOf(extencion) < 0){
       return res.json({
           ok : false,
           message : 'extenciones no permitida. Tu archivo requiere una extencion ' + extenciones.join(','),
           ext : extencion
       })
   }

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${archivo.name}`, function(err) {
    if (err)
      return res.status(500).json({err});

    res.json({ 
        message : 'File uploaded!'
    });
  });

});

module.exports =  app;