const passport = require('passport');
const Users = require('../models/Users');
const crypto = require('crypto');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const sendEmail = require('../handlers/email');

exports.authUser = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
    failureFlash: true,
    badRequestMessage: 'Fill the fields in'
});

// Check if the user is logged in
exports.checkUserAuth = (req, res, next) => {
    // If the user is logged in:
    if(req.isAuthenticated()){
        return next()
    }
    // If the user does not logged in:
    return res.redirect('/log-in');
};

// Log Out
exports.logOut = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/log-in');
    });
};

// Send Token if the user is valid
exports.sendToken = async (req, res) => {
    // Verify if the user exists
    const user = await Users.findOne({
        where: { email: req.body.email }
    });

    // If the user does not exists
    if(!user){
        req.flash('error', 'The account does not exists');
        res.redirect('/restore-pass');
    }

    // The user exists
    user.token = crypto.randomBytes(20).toString('hex');
    user.expiration = Date.now() + 3600000;
    

    // Save on the DB
    await user.save();

    // URL Reset
    const resetUrl = `http://${req.headers.host}/restore-pass/${user.token}`;
    
    // Send Email with Token

    await sendEmail.send({
        user: user,
        subject: 'Password Reset',
        resetUrl: resetUrl,
        file: 'restore-pass'
    });

    req.flash('success', 'Check your email and then change your password');
    res.redirect('/restore-pass');
};

exports.restorePass = async (req, res) => {
    const user = await Users.findOne({
        where: {
            token: req.params.token
        }
    });

    if(!user){
        req.flash('error', 'Not valid');
        res.redirect('/restore-pass');
    }

    // Form to generate password
    res.render('change-pass', {
        pageName: 'Change Password'
    });
};

exports.updatePass = async (req, res) => {
    // Verify if the token is valid and the expiration date
    const user = await Users.findOne({
        where: {
            token: req.params.token,
            expiration: {
                [Op.gte]: Date.now()
            }
        }
    });

    // Check if the user exists
    if(!user){
        req.flash('error', 'Not valid');
        res.redirect('/restore-pass');
    }

    // Hash the new password
    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    user.token = null;
    user.expiration = null;

    // Save the user
    await user.save();

    req.flash('success', 'Password changed successfully');
    res.redirect('/log-in');
};