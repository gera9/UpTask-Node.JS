const express = require('express');
const router = express.Router();

// Import express-validator
const { body } = require('express-validator');

// Import controllers
const projectsController = require('../controllers/projects.controller');
const tasksController = require('../controllers/tasks.controller');
const usersController = require('../controllers/users.controller');

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

    // Delete Project
    router.delete('/projects/:url', projectsController.deleteProject);

    // Add task
    router.post('/projects/:url', tasksController.addTask);

    // Update Task
    router.patch('/tasks/:id', tasksController.updateStateTask);

    // Delete Task
    router.delete('/tasks/:id', tasksController.deleteTask);

    // Create Account
    router.get('/create-account', usersController.formCreateAccount);
    router.post('/create-account', usersController.createAccount);
    // 404 Not Found
    router.get('*', projectsController.notFound);
    
    return router;

};