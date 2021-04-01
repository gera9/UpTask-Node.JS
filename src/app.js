const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const helpers = require('./helpers/helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// Extract data from variables.env
require('dotenv').config({
    path: 'variables.env'
});

// Create DB connection
const db = require('./config/db');
const { env } = require('process');

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

// Cookie Parser
app.use(cookieParser());

// Session
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Var_dump
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.messages = req.flash();
    res.locals.user = {...req.user || null};
    next();
});

// Learning Middleware - Creating a global varianble
app.use((req, res, next) => {
    res.locals.year = new Date().getFullYear();
    next();
});

app.use('/', routes());

// Server and Port

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, (error) => {
    if(error) return console.error(error);
    console.log('Server is up and listening on port ', port);
});