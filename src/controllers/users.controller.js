const Users = require('../models/Users');
const sendEmail = require('../handlers/email');

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

        // Create a URL to confirm account
        const confirmURL = `http://${req.headers.host}/confirm/${email}`;
        
        // Create a user object
        const user = {
            email
        }
        // Send Email
        await sendEmail.send({
            user: user,
            subject: 'Confirm Account',
            confirmURL: confirmURL,
            file: 'confirm-account'
        });

        // Redirect
        req.flash('success', 'Check your email and then confirm your account');
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

exports.formRestorePass = async (req, res) => {
    res.render('restore-pass', {
        pageName: 'Restore Password'
    });
};

exports.confirmAccount = async (req, res) => {
    const user = await Users.findOne({
        where: {
            email: req.params.email
        }
    });

    if(!user){
        req.flash('error', 'Not valid');
        res.redirect('/create-account');
    }

    user.active = 1;
    await user.save();
    req.flash('success', 'Account Activated');
    res.redirect('/log-in');
};