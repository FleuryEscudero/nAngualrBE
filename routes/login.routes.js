var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

var SEED= require('../config/config').SEED;
var CLIENT_ID = require('../config/config').CLIENT_ID;

var app = express();

var User = require("../models/user");

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

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

// Google Login 
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const payload = ticket.getPayload();
  // const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  
  return {
    name: payload.name,
    email: payload.email,
    image: payload.picture,
    google: true
  }
}

app.post('/google', async (req,res)=>{

  var token = req.body.token;
  var googleUser = await verify(token)
                  .catch(e=>{
                   return res.status(400).json({
                      ok: false,
                      mensaje: `Token no valido`,
                      errors: e,
                  })
                })

    User.findOne({email:googleUser.email}, (err,userDB)=>{
      if(err){
        return res.status(500).json({
          ok: false,
          mensaje:'Usuario no encontrado',
          error: err
        })
      }

      if(userDB){

        if(userDB.google ===false){
          return res.status(400).json({
            ok: false,
            mensaje:'Debe usar su autenticacion normal',
          })
        } else {
          var token = jwt.sign({user: userDB}, SEED , { expiresIn: 14400}) //14400 = 4 horas

          res.status(200).json({
              ok: true,
              user:userDB,
              token:token,
              id: userDB.id
            });
        }

      }else {
        //El usuario se tiene que crear de google
        var user = new User();
        user.name = googleUser.name;
        user.email = googleUser.email;
        user.image = googleUser.image;
        user.google = googleUser.google;
        user.password = ':D';

user.save((err, userDB)=>{
  var token = jwt.sign({user: userDB}, SEED , { expiresIn: 14400}) //14400 = 4 horas

          res.status(200).json({
              ok: true,
              user:userDB,
              token:token,
              id: userDB.id
            });
})

      }

    });
});

module.exports = app;