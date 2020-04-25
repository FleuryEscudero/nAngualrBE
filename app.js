//Required

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Iniciar variables

var app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Importar Rutas

var appRoute = require('./routes/app.routes');
var userRoute = require('./routes/user.route');
var loginRoute = require('./routes/login.routes');
var hospitalRoute = require('./routes/hospital.route');
var medicianRoute = require('./routes/medician.route');
var searchRoute = require('./routes/search.route');
var uploadRoute = require('./routes/upload.route');
var imageRoute = require ('./routes/images.routes');

// Conexion DB

mongoose.connect('mongodb://localhost:27017/hospitalDB', (err, res)=>{
    if(err)throw err;
    console.log('Mongo DB :\x1b[32m%s\x1b[0m','online')
} );




// Rutas
app.use('/user', userRoute);
app.use('/login', loginRoute);
app.use('/hospital', hospitalRoute);
app.use('/medician', medicianRoute);
app.use('/search', searchRoute);
app.use('/upload', uploadRoute);
app.use('/img', imageRoute);
app.use('/', appRoute);


//Escuchar peticiones

app.listen(3000, ()=>{
console.log('Express server corriendo puerto 3000:\x1b[32m%s\x1b[0m','online')
})