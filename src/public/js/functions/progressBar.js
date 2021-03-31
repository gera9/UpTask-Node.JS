import Swal from "sweetalert2";

export const progressBar = () => {
    // Select existing tasks
    const tasks = document.querySelectorAll('li.tarea');
    
    if(tasks.length){
        // Select completed tasks
        const completedTasks = document.querySelectorAll('i.completo');
        
        // Calculate progress
        const percentage = Math.round((completedTasks.length / tasks.length) * 100);
        
        // Show progress
        const bar = document.querySelector('#percentage');
        bar.style.width = percentage+'%';

        if(percentage === 100){
            Swal.fire(
                'Well Done!',
                'Project Completed',
                'success'
            );
        }
    }
};