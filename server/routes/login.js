const express = require('express');

const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');

const app = express();


app.post('/login', function (req, res) {

    res.json({
        ok: true,
        //usuario: usuarioDB
    });
})


module.exports = app;