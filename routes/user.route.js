var express = require("express");
var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");
var mdAuth = require("../middleware/auth");

var app = express();

var User = require("../models/user");

// Obtener todos los usuarios

app.get("/", (req, res, next) => {
  User.find({}, "_id name surname img role").exec((err, users) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando usuarios",
        errors: err,
      });
    }

    res.status(200).json({
      ok: true,
      users: users,
    });
  });
});

// Creear un nuevo usuario

app.post("/", mdAuth.verifyToken, (req, res) => {
  var body = req.body;
  var user = new User({
    name: body.name,
    surname: body.surname,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role,
  });

  user.save((err, saveUser) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al guardar el usuario",
        errors: err,
      });
    }
    res.status(201).json({
      ok: true,
      user: saveUser,
      tokenUser: req.user,
    });
  });
});

// Actualizar un usuario

app.put("/:id", mdAuth.verifyToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;
  User.findById(id, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err,
      });
    }

    if (!user) {
      return res.status(400).json({
        ok: false,
        mensaje: `No se encontró el usuario con el ${id}`,
        errors: err,
      });
    }

    (user.name = body.name),
      (user.surname = body.surname),
      (user.email = body.email),
      (user.role = body.role);

    user.save((err, saveUser) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el usuario",
          errors: err,
        });
      }

      saveUser.password = ":)";

      res.status(200).json({
        ok: true,
        user: saveUser,
      });
    });
  });
});

// Borrar un Usuario

app.delete("/:id", mdAuth.verifyToken, (req, res) => {
  var id = req.params.id;
  User.findByIdAndRemove(id, (err, deleteUser) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err,
      });
    }
    if (!deleteUser) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err,
      });
    }
    res.status(200).json({
      ok: true,
      user: deleteUser,
      message: "Usuario borrado",
    });
  });
});

module.exports = app;
