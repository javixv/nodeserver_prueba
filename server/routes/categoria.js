const express = require('express');

let { validacionToken, verificarROL } = require('../middlewares/autenticacion')

let app = express();

let Categoria = require('../models/categoria');

/**
 * Mostrar todas las categorias 
 */
app.get('/categoria', (req, res) => {

    Categoria.find({})
             .exec((err, categorias) =>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok : true,
                    categorias
                })
             })


})

/**
 * Mostrar todas las categorias por ID
 */
app.get('/categoria/:id', (req, res) => {

    //para obtener el ID
    let id = req.params.id

    Categoria.findById( id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok : true,
            categoria : categoriaDB
        })
    })

})

/**
 * Crear una nueva categorias 
 */
app.post('/categoria', validacionToken, (req, res) => {
  // regresa la nueva categoria
    // req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });


    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });



});

/**
 * editar una categorias 
 */
app.put('/categoria/:id', (req, res) => {

    //para obtener el ID
    let id = req.params.id;
    let body = req.body;

    //creamos un objetos para editar la categoria
    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});

/**
 * Eliminar la categorias 
 */
app.delete('/categoria/:id', [validacionToken, verificarROL], (req, res) => {

 //para obtener el ID
 let id = req.params.id;
 

 Categoria.findByIdAndRemove(id , (err, categoriaDB) => {
    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    if (!categoriaDB) {
        return res.status(400).json({
            ok: false,
            err : {
                message :"id no existe"
            }
        });
    }

    res.json({
        ok : true,
        message : "categoria borrada OK"
    })
 })
})

module.exports = app;