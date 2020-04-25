var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var validRoles = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} no es un rol permitido",
};

var userSchema = new Schema({
  name: { type: String, required: [true, "El nombre es necesario"] },
  surname: { type: String },
  email: {
    type: String,
    unique: true,
    required: [true, "El correo es necesario"],
  },
  password: { type: String, required: [true, "El password es necesario"] },
  image: { type: String },
  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
    enum: validRoles,
  },
  google: {type: Boolean, default: false}
});

userSchema.plugin(uniqueValidator, { message: "El {PATH} debe de ser unico" });

module.exports = mongoose.model("User", userSchema);
