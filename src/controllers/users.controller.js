const Users = require('../models/Users');

exports.formCreateAccount = (req, res) => {
    res.render('create-account', {
        pageName: 'Create Account'
    });
};

exports.formLogIn = (req, res) => {
    const { error } = res.locals.messages;
    res.render('log-in', {
        pageName: 'Log In',
        error: error
    });
};

exports.createAccount = async (req, res) => {
    // Read data
    const { email, password } = req.body;

    try {
        // Create user
        await Users.create({
            email: email,
            password: password
        });

        res.redirect('/log-in');

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('create-account', {
            pageName: 'Create Account',
            messages: req.flash(),
            email: email,
            password: password
        });
    }
};