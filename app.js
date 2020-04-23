//Required

var express = require('express');
var mongoose = require('mongoose');

// Iniciar variables

var app = express();

// Conexion DB

/* mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, res)=>{
    if(err)throw err;

    
}) */
mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res)=>{
    if(err)throw err;
    console.log('Mongo DB :\x1b[32m%s\x1b[0m','online')
} );
// Rutas

app.get('/', (req, res, next)=>{
    res.status(200).json({
        ok: true,
        mensaje:'Petición Realizada correctamente'
    })
})

//Escuchar peticiones

app.listen(3000, ()=>{
console.log('Express server corriendo puerto 3000:\x1b[32m%s\x1b[0m','online')
})