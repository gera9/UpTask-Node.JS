const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const helpers = require('./helpers/helpers');

// Create DB connection
const db = require('./config/db');

// Import DB model
require('./models/Projects');

db.sync()
    .then(() => console.log('Ok!'))
    .catch(error => console.error(error));
  

// Create express app 
const app = express();

// Public folder (static files)
app.use(express.static('src/public'));

// Activate Pug
app.set('view engine', 'pug');

// Add views folder
app.set('views', path.join(__dirname, 'views'));

// Var_dump
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    next();
});

// Learning Middleware - Creating a global varianble
app.use((req, res, next) => {
    res.locals.year = new Date().getFullYear();
    next();
});

// Activate body-parser to read data from the form
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', routes());

app.listen(3000);