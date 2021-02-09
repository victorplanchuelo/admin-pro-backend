require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Base de Datos
dbConnection();

//console.log(process.env);

// Rutas
app.get('/', (req, resp) => {
    resp
    //.status(404)
        .json({
        ok: true,
        msg: 'Hola mundo'
    });
});


app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});