const path = require('path');
const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
require('dotenv').config();

const app = express();

//DB

dbConnection();

//CORS

app.use(cors());

app.use(express.static('public'));

//lectura y parseo del body

app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));

app.use('/api/events', require('./routes/events'));

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


app.listen(process.env.PORT, () => {
    console.log("Server corriendo "+ process.env.PORT);
});