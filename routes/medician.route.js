var express = require("express");
var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");
var mdAuth = require("../middleware/auth");

var app = express();

var Medician = require("../models/medician");

// Obtener todos los usuarios

app.get("/", (req, res, next) => {

  var from = req.query.from || 0;
  from = Number(from);

  Medician.find({})
  .skip(from)
  .limit(5)
  .populate('user','name email')
  .populate('hospital')
  .exec((err, medicians) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando los medicos",
        errors: err,
      });
    }

    Medician.count({},(err,count)=>{
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al contar los Medicos",
          errors: err,
        });
      }
      res.status(200).json({
        ok: true,
        medicians,
        count
      });
    })
  });
});

// Creear un nuevo usuario

app.post("/", mdAuth.verifyToken, (req, res) => {
  var body = req.body;
  var medician = new Medician({
    name: body.name,
    image: body.img,
    user: body.user,
    hospital: body.hospital
  });

  medician.save((err, saveMedician) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al guardar el medico",
        errors: err,
      });
    }
    res.status(201).json({
      ok: true,
      medician: saveMedician
    });
  });
});

// Actualizar un usuario

app.put("/:id", mdAuth.verifyToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;
  Medician.findById(id, (err, medician) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar al medico",
        errors: err,
      });
    }

    if (!medician) {
      return res.status(400).json({
        ok: false,
        mensaje: `No se encontró el medico con el ${id}`,
        errors: err,
      });
    }

    medician.name = body.name,
    medician.user = body.user,
    medician.hospital = body.hospital,

    medician.save((err, saveMedician) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el medico",
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        medician: saveMedician,
      });
    });
  });
});

// Borrar un Usuario

app.delete("/:id", mdAuth.verifyToken, (req, res) => {
  var id = req.params.id;
  Medician.findByIdAndRemove(id, (err, deleteMedician) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar al medico",
        errors: err,
      });
    }
    if (!deleteMedician) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err,
      });
    }
    res.status(200).json({
      ok: true,
      medician: deleteMedician,
      message: "Medico borrado",
    });
  });
});

module.exports = app;
