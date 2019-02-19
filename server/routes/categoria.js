const express = require('express');

let { validacionToken } = require('../middlewares/autenticacion')

let app = express();

let Categoria = require('../models/categoria');

/**
 * Mostrar todas las categorias 
 */
app.get('/categoria', (req, res) => {


})

/**
 * Mostrar todas las categorias por ID
 */
app.get('/categoria/:id', (req, res) => {


})

/**
 * Crear una nueva categorias 
 */
app.post('/categoria', validacionToken, (req, res) => {


})

/**
 * editar una categorias 
 */
app.put('/categoria/:id', (req, res) => {


})

/**
 * Eliminar la categorias 
 */
app.delete('/categoria/:id', (req, res) => {


})

module.exports = app;