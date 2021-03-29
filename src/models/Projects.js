const Sequelize = require('sequelize');
const db = require('../config/db');
// Slug
const slug = require('slug');
// Short Id
const id = require('shortid');

const Projects = db.define('projects', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: Sequelize.STRING
    },

    url: Sequelize.STRING

}, {
    hooks: {
        beforeCreate(project) {
            project.url = `${slug(project.name).toLowerCase()}-${id.generate()}`;
        }
    }
});

module.exports = Projects;