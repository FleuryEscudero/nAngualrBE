var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

var SEED= require('../config/config').SEED;

var app = express();

var User = require("../models/user");



// Login

app.post('/',(req,res)=>{


    var body = req.body;
   

    User.findOne({email: body.email},(err,userDB)=>{

        if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al buscar usuario",
              errors: err,
            });
          }

          if (!userDB) {
            return res.status(400).json({
              ok: false,
              mensaje: `credenciales incorrectas email`,
              errors: err,
            });
          }

          if(!bcrypt.compareSync(body.password, userDB.password)){
            return res.status(400).json({
                ok: false,
                mensaje: `credenciales incorrectas password`,
                errors: err,
              });
          }

        //   crear un token
          userDB.password = ':D';
        var token = jwt.sign({user: userDB}, SEED , { expiresIn: 14400}) //14400 = 4 horas

        res.status(200).json({
            ok: true,
            user:userDB,
            token:token,
            id: userDB.id,
            mensaje:'Login correcto',
          });
    })


    

})



module.exports = app;