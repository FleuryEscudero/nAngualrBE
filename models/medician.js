var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var medicianSchema = new Schema(
  {
    name: { type: String, required: [true, "El nombre es necesario"] },
    image: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required:true},
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      required: [true,'El Id hospital es un campo obligatorio']
    },
  },
  { collection: "medicians" }
);

module.exports = mongoose.model("Medician", medicianSchema);
