const express = require('express')

const fs = require('fs')

const path = require('path')

let { validacionTokenImagen} = require('../middlewares/autenticacion')

let app = express();


app.get('/imagen/:tipo/:img',validacionTokenImagen, (req, res) =>{

    let tipo = req.params.tipo;
    let img = req.params.img;


    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{

        let noImagenPath = path.resolve(__dirname,'../assets/no-image.jpg')
        res.sendFile(noImagenPath);
    }

})

module.exports = app;