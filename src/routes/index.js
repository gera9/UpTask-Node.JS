const express = require('express');
const router = express.Router();

// Import express-validator
const { body } = require('express-validator');

// Import controller
const projectsController = require('../controllers/projects.controller');

module.exports = function(){
    // Home
    router.get('/', projectsController.homeProjects);

    // New Project
    router.get('/new-project', projectsController.formNewProject);
    router.post('/new-project', 
        body('name').not().isEmpty().trim().escape(),
        projectsController.newProject
    );

    // Show Project
    router.get('/projects/:url', projectsController.projectByUrl);
    
    // Update Project
    router.get('/projects/edit/:id', projectsController.formEdit);
    router.post('/new-project/:id', 
        body('name').not().isEmpty().trim().escape(),
        projectsController.editProject
    );

    // 404 Not Found
    router.get('*', projectsController.notFound);
    
    return router;
};