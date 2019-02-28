const express = require('express');
let { validacionToken } = require('../middlewares/autenticacion')

let app = express();

let Producto = require('../models/producto');

/**
 * Obtener todos los produtos
 */
app.get('/producto', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible :true})
            .sort(desde)
            .limit(5)
            .populate('usuario','nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, produtoDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok : true,
                    produtoDB
                })
            })


});

/**
 * Buscar un produtos por ID
 */
app.get('/producto/:id', (req, res) => {

let id = req.params.id

    Producto.findById(id, (err, productoDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok : true,
            productoDB
        })
    })
});

/**
 * Crear un nuevo produtos
 */
app.post('/producto', validacionToken, (res, req) => {

    
let body = req.body;

let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria,
    usuario: req.usuario._id
})

producto.save((err, productoDB) => {

    if (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    res.status(201).json({
        ok: true,
        producto : productoDB
    })

})
});

/**
 * Actulizar un produtos
 */
app.put('/producto/:id',validacionToken, (res, req) => {

    let id = req.params.id;
    let body = req.body;
    
    Producto.findById(id, (err, produtoDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!produtoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok : true,
            produtoDB
        })


        produtoDB.nombre = body.nombre;
        produtoDB.descripcion = body.descripcion;
        produtoDB.disponible = body.disponible;
        produtoDB.precioUni = body.precioUni;
        produtoDB.categoria = body.categoria;


        produtoDB.save((err, pg) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto : pg
            })
        })
    })

});

/**
 * Eliminar un produtos o cambiar de estado Act o Des.
 */
app.delete('/producto/:id',validacionToken, (res, req) => {

    let id = req.params.id

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!produtoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, pb) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: pb
            })
        })
    })

});

module.exports.app;