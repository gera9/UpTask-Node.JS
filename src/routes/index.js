const express = require('express');
const router = express.Router();

// Import express-validator
const { body } = require('express-validator');

// Import controllers
const projectsController = require('../controllers/projects.controller');
const tasksController = require('../controllers/tasks.controller');
const usersController = require('../controllers/users.controller');
const authController = require('../controllers/auth.controller');

module.exports = function(){
    // Home
    router.get('/', 
        authController.checkUserAuth,
        projectsController.homeProjects
    );

    // New Project
    router.get('/new-project', 
        authController.checkUserAuth,
        projectsController.formNewProject
    );
    router.post('/new-project', 
        authController.checkUserAuth,
        body('name').not().isEmpty().trim().escape(),
        projectsController.newProject
    );

    // Show Project
    router.get('/projects/:url', 
        authController.checkUserAuth,
        projectsController.projectByUrl
    );
    
    // Update Project
    router.get('/projects/edit/:id', 
        authController.checkUserAuth,
        projectsController.formEdit
    );
    router.post('/new-project/:id',
        authController.checkUserAuth,
        body('name').not().isEmpty().trim().escape(),
        projectsController.editProject
    );

    // Delete Project
    router.delete('/projects/:url', 
        authController.checkUserAuth,
        projectsController.deleteProject
    );

    // Add task
    router.post('/projects/:url', 
        authController.checkUserAuth,
        tasksController.addTask
    );

    // Update Task
    router.patch('/tasks/:id', 
        authController.checkUserAuth,
        tasksController.updateStateTask
    );

    // Delete Task
    router.delete('/tasks/:id', 
        authController.checkUserAuth,
        tasksController.deleteTask
    );

    // Create Account
    router.get('/create-account', 
        usersController.formCreateAccount
    );
    router.post('/create-account', 
        usersController.createAccount
    );
    
    // Log In
    router.get('/log-in', 
        usersController.formLogIn
    );
    router.post('/log-in', 
        authController.authUser
    );

    // Log Out
    router.get('/log-out', 
        authController.logOut
    );
    
    // Restore Password
    router.get('/restore-pass', usersController.formRestorePass);
    router.post('/restore-pass', authController.sendToken);
    router.get('/restore-pass/:token', authController.restorePass);
    router.post('/restore-pass/:token', authController.updatePass);

    // 404 Not Found
    router.get('*', projectsController.notFound);
    
    return router;

};