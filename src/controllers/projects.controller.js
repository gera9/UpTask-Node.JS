// Import Models
const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');

exports.homeProjects = async (req, res) => {
    const userId = res.locals.user.id;

    const projects = await Projects.findAll({
        where: {
            userId: userId
        }
    });

    res.render('index', {
        pageName: 'Projects - ' + res.locals.year,
        projects
    });
};

exports.formNewProject = async (req, res) => {
    const userId = res.locals.user.id;

    const projects = await Projects.findAll({
        where: {
            userId: userId
        }
    });

    res.render('new-project', {
        pageName: 'New Project',
        projects
    });
};

exports.newProject = async (req, res) => {
    const userId = res.locals.user.id;

    const projects = await Projects.findAll({
        where: {
            userId: userId
        }
    });

    // Validate
    const { name } = req.body;
    let errors = [];

    if(!name){
        errors.push({'text': 'Add a name'});
    }

    if(errors.length > 0){
        res.render('new-project', {
            pageName: 'New Project',
            errors, 
            projects
        });
    
    }else{
        // Connect to DB
        const userId = res.locals.user.id;
        await Projects.create({ 
            name : name,
            userId: userId
        });
        res.redirect('/');
    }
};

exports.projectByUrl = async (req, res, next) => {
    const userId = res.locals.user.id;

    const projectsPromise = Projects.findAll({
        where: {
            userId: userId
        }
    });
    const projectPromise = Projects.findOne({
        where: {
            url: req.params.url,
            userId: userId
        }
    });

    const [projects, project] = await Promise.all([projectsPromise, projectPromise]);
    
    // Get Task's Project
    const tasks = await Tasks.findAll({
        where: {
            projectId: project.id
        },
        include: [
            { model: Projects }
        ]
    });

    if(!project) next();

    res.render('tasks', {
        pageName: 'Tasks',
        project,
        projects,
        tasks
    });
};

exports.formEdit = async (req, res) => {
    const userId = res.locals.user.id;

    const projectsPromise = Projects.findAll({
        where: {
            userId: userId
        }
    });

    const projectPromise = Projects.findOne({
        where: {
            id: req.params.id,
            userId: userId
        }
    });

    const [projects, project] = await Promise.all([projectsPromise, projectPromise]);

    res.render('new-project', {
        pageName: 'Edit Project',
        project,
        projects
    });
}

exports.editProject = async (req, res) => {
    const userId = res.locals.user.id;

    const projects = await Projects.findAll({
        where: {
            userId: userId
        }
    });

    // Validate
    const { name } = req.body;
    let errors = [];

    if(!name){
        errors.push({'text': 'Add a name'});
    }

    if(errors.length > 0){
        res.render('new-project', {
            pageName: 'New Project',
            errors, 
            projects
        });
    
    }else{
        // Connect to DB
        await Projects.update(
            { name : name },
            {where: { id: req.params.id }}
        );
        res.redirect('/');
    }
};

exports.deleteProject = async (req, res, next) => {
    const { projectUrl } = req.query;
    const result = await Projects.destroy({ where: { url: projectUrl } });
    
    if(!result){
        res.status(404).send('Something went wrong!')
        return next();
    }

    res.status(200).send('Your project has been deleted.');
};

exports.notFound = (req, res) => {
    res.render('404');
};