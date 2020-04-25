var express = require("express");
var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");
var mdAuth = require("../middleware/auth");

var app = express();

var Hospital = require("../models/hospital");

// Obtener todos los usuarios

app.get("/", (req, res, next) => {
  var from = req.query.from || 0;
  from = Number(from);
  Hospital.find({})
  .skip(from)
  .limit(5)
  .populate('user', 'name email')
  .exec((err, hospitals) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando los medicos",
        errors: err,
      });
    }

    Hospital.count({},(err,count)=>{
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error al contar los hospitales",
          errors: err,
        });
      }
      res.status(200).json({
        ok: true,
        hospitals,
        count
      });
    })
  });
});

// Creear un nuevo usuario

app.post("/", mdAuth.verifyToken, (req, res) => {
  var body = req.body;
  var hospital = new Hospital({
    name: body.name,
    image: body.img,
    user: body.user
  });

  hospital.save((err, saveHospital) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al guardar el medico",
        errors: err,
      });
    }
    res.status(201).json({
      ok: true,
      hospital: saveHospital
    });
  });
});

// Actualizar un hospital

app.put("/:id", mdAuth.verifyToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;
  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar al medico",
        errors: err,
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: `No se encontró el hospital con el ${id}`,
        errors: err,
      });
    }

    hospital.name = body.name,
    hospital.user = body.user;

    hospital.save((err, saveHospital) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar el medico",
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        hospital: saveHospital,
      });
    });
  });
});

// Borrar un Usuario

app.delete("/:id", mdAuth.verifyToken, (req, res) => {
  var id = req.params.id;
  Hospital.findByIdAndRemove(id, (err, deleteHospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar al hospital",
        errors: err,
      });
    }
    if (!deleteHospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "Este hospital ya esta borrado",
        errors: err,
      });
    }
    res.status(200).json({
      ok: true,
      hospital: deleteHospital,
      message: "Hospital borrado",
    });
  });
});

module.exports = app;
