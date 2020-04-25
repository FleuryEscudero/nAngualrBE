var express = require("express");

var app = express();

var Hospital = require("../models/hospital");
var User = require("../models/user");
var Medicians = require("../models/medician");

// Busqueda por collection

app.get("/collection/:table/:arg", (req, res) => {
  var table = req.params.table;
  var arg = req.params.arg;
  var regex = new RegExp(arg, "i");
  var promise;

  switch (table) {
    case "medician":
      promise = medicianSearch(arg, regex);
      break;

    case "hospital":
      promise = hospitalSearch(arg, regex);
      break;

    case "user":
      promise = userSearch(arg, regex);
      break;

    default:
      return res.status(400).json({
        ok: false,
        mensaje: "No hay datos relacionados a su búsqueda"
      });
  }
  promise.then(data =>{
    res.status(200).json({
      ok: true,
      [table]: data
    });
  })
});

// Busqueda General

app.get("/all/:arg", (req, res, next) => {
  var arg = req.params.arg;
  var regex = new RegExp(arg, "i");

  Promise.all([
    hospitalSearch(arg, regex),
    medicianSearch(arg, regex),
    userSearch(arg, regex),
  ]).then((response) => {
    res.status(200).json({
      ok: true,
      hospitals: response[0],
      medicians: response[1],
      users: response[2],
    });
  });
});

function hospitalSearch(arg, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ name: regex })
      .populate("user", "name email")
      .exec((err, hospitals) => {
        if (err) {
          reject("Error al cargar hospitales");
        } else {
          resolve(hospitals);
        }
      });
  });
}
function medicianSearch(arg, regex) {
  return new Promise((resolve, reject) => {
    Medicians.find({ name: regex })
      .populate("user", "name email")
      .populate("hospital")
      .exec((err, medicians) => {
        if (err) {
          reject("Error al cargar medicos");
        } else {
          resolve(medicians);
        }
      });
  });
}
function userSearch(arg, regex) {
  return new Promise((resolve, reject) => {
    User.find({}, "name surname email role")
      .or([{ name: regex }, { email: regex }])
      .exec((err, users) => {
        if (err) {
          reject("Error al cargar los usuarios", err);
        } else {
          resolve(users);
        }
      });
  });
}

module.exports = app;
