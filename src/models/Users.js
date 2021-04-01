const Sequelize = require('sequelize');
const db =  require('../config/db');
const Projects = require('./Projects');
const bcrypt = require('bcrypt-nodejs');

const Users = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Add a valid E-mail'
            },
            notEmpty: {
                msg: 'E-mail empty'
            }
        },
        unique: {
            args: true,
            msg: 'E-mail already registered'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Password empty.'
            }
        }
    },
    active: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiration: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(user) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        }
    }
});

// Custom Methods
Users.prototype.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

Users.hasMany(Projects);

module.exports = Users;