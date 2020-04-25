var express = require("express");

var app = express();
var fileUpload = require("express-fileupload");
var fs = require("fs");

//Models

var User = require("../models/user");
var Medician = require("../models/medician");
var Hospital = require("../models/hospital");

// Middleware

app.use(fileUpload());

// Rutas

app.put("/:table/:id", (req, res) => {
  var table = req.params.table;
  var id = req.params.id;

  var validTable = ["medicians", "users", "hospitals"];

  if (validTable.indexOf(table) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "coleción no Valida",
      error: { message: "Las coleciones validas son: " + validTable },
    });
  }

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: "No hay imagenes para cargar",
      error: { message: "Debe seleccionar al menos una imagen" },
    });
  }

  //get Filename

  var file = req.files.image;
  console.log(file);
  var split = file.name.split(".");
  var ext = split[split.length - 1];

  // solo extensiones de imagenes

  var validExt = ["png", "jpeg", "jpg", "gif"];

  if (validExt.indexOf(ext) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "Extension no Valida",
      error: { message: "Las extensiones validas son : " + validExt },
    });
  }

  //custom Filename

  var filename = `${id}-${new Date().getMilliseconds()}.${ext}`;

  var path = `./uploads/${table}/${filename}`;

  file.mv(path, (err) => {
    console.log(path);
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "No se encuentra el archivo solicitado",
        error: err,
      });
    }

    uploadByType(table, id, filename, res);

    /* res.status(200).json({
      ok: true,
      mensaje: "Archivo movido Exitosamente",
    }); */
  });
});

function uploadByType(table, id, filename, res) {

  if (table === "users") {
    User.findById(id, (err, user) => {
      if (!user) {
        return res.status(400).json({
          ok: true,
          mensaje: "No Existe el usuario",
        });
      }

      var pPath = "./uploads/users/" + user.image;

      if (fs.existsSync(pPath)) {
        fs.unlinkSync(pPath);
      }

      user.image = filename;
      user.save((err, updatedUser) => {
        if (!updatedUser) {
          return res.status(500).json({
            ok: false,
            mensaje: `No se encuentra el usuario seleccionado`,
            errors: err,
          });
        }

        updatedUser.password = ":D";
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen de Usuario actualizada",
          user: updatedUser,
        });
      });
    });
  }

  if (table === "medicians") {
    Medician.findById(id, (err, medician) => {
      if (!medician) {
        return res.status(400).json({
          ok: true,
          mensaje: "No Existe el medico",
        });
      }
      var pPath = "./uploads/medicians/" + medician.image;

      if (fs.existsSync(pPath)) {
        fs.unlinkSync(pPath);
      }

      medician.image = filename;
      medician.save((err, updatedMedician) => {
        if (!updatedMedician) {
          return res.status(500).json({
            ok: false,
            mensaje: `No se encuentra el medico seleccionado`,
            errors: err,
          });
        }
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen del medico actualizada",
          medician: updatedMedician,
        });
      });
    });
  }

  if (table === "hospitals") {
    Hospital.findById(id, (err, hospital) => {
      if (!hospital) {
        return res.status(400).json({
          ok: true,
          mensaje: "No Existe el hospital",
        });
      }
      var pPath = "./uploads/hospitals/" + hospital.image;

      if (fs.existsSync(pPath)) {
        fs.unlinkSync(pPath);
      }

      hospital.image = filename;
      hospital.save((err, updatedHospital) => {
        if (!updatedHospital) {
          return res.status(500).json({
            ok: false,
            mensaje: `No se encuentra el medico seleccionado`,
            errors: err,
          });
        }
        return res.status(200).json({
          ok: true,
          mensaje: "Imagen del medico actualizada",
          hospital: updatedHospital,
        });
      });
    });
  }
}

module.exports = app;
