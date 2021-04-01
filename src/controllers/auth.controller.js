const passport = require('passport');

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