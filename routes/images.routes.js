var express = require("express");

var app = express();
const path = require("path");
const fs = require("fs");
// Rutas

app.get("/:table/:image", (req, res, next) => {
  var table = req.params.table;
  var image = req.params.image;
  var imagePath = path.resolve(__dirname, `../uploads/${table}/${image}`);

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    var noImagePath = path.resolve(__dirname, '../assets/no-img.jpg');
    res.sendFile(noImagePath);
  }
});

module.exports = app;
