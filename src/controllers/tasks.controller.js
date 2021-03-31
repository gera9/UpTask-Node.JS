// Import Models
const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');

exports.addTask = async (req, res, next) => {
    // Get current project
    const project = await Projects.findOne({ 
        where: { url: req.params.url } 
    });
    
    // Read the data of the input
    const { task } = req.body;

    // Task State
    const state = 0;
    
    // ID Project
    const projectId = project.id;

    // Insert to DB
    const result = await Tasks.create({ task, state, projectId }); 

    if(!result) next();

    // Reload
    res.redirect(`/projects/${req.params.url}`);
};

exports.updateStateTask = async (req, res, next) => {
    const { id } = req.params;
    const task = await Tasks.findOne({ where: { id: id } });
    
    // Change state
    let state = 0;
    if(task.state === state){
        state = 1;
    }

    task.state = state;

    const result = await task.save();

    if(!result) next();

    res.status(200).send('Updated');
};

exports.deleteTask = async (req, res, next) => {

    const { id } = req.params;

    // Delete Task
    const result = await Tasks.destroy({ where: { id: id } });

    if(!result){
        return next();
    }

    res.status(200).send('Task deleted successfully.');
};