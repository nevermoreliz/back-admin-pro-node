require('dotenv').config();

const express = require('express');
const cors =require('cors');

const { dbConnection } = require('./database/config');

// crear el servidor de express
const app = express();

// configurar cors
app.use(cors());

// base de datos
dbConnection();

app.listen(process.env.PORT, () => {
    console.log('servidor corriendo en el puerto ' + process.env.PORT);
});

