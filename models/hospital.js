

var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;


var hospitalSchema = new Schema({
  name: { type: String, required: [true, "El nombre es necesario"] },
  image: { type: String },
  user: {type:Schema.Types.ObjectId, ref:'User'}
}, {collection:'hospitals'});

module.exports = mongoose.model("Hospital", hospitalSchema);
