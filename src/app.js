const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const helpers = require('./helpers/helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Create DB connection
const db = require('./config/db');

// Import DB models
require('./models/Projects');
require('./models/Tasks');
require('./models/Users');

db.sync()
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.error(error));
  
// Create express app 
const app = express();

// Public folder (static files)
app.use(express.static('src/public'));

// Activate Pug
app.set('view engine', 'pug');

// Activate body-parser to read data from the form
app.use(bodyParser.urlencoded({extended: true}));

// Add views folder
app.set('views', path.join(__dirname, 'views'));

// Flash Messages
app.use(flash());

app.use(cookieParser());

// Sessions
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
}));

// Var_dump
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.messages = req.flash();
    next();
});

// Learning Middleware - Creating a global varianble
app.use((req, res, next) => {
    res.locals.year = new Date().getFullYear();
    next();
});

app.use('/', routes());

app.listen(3000);