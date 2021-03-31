import Swal from 'sweetalert2';
import axios from 'axios';
import { progressBar } from '../functions/progressBar';

const tasks = document.querySelector('.listado-pendientes');

if(tasks){
    tasks.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')){
            const icon = e.target;
            const taskId = icon.parentElement.parentElement.dataset.task;

            // Request to /tasks/:id
            const url = `${location.origin}/tasks/${taskId}`;
            
            axios.patch(url, { id: taskId })
                .then((res) => {
                    if(res.status === 200){
                        icon.classList.toggle('completo');
                        progressBar();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')){
            const taskHTML = e.target.parentElement.parentElement,
                taskId = taskHTML.dataset.task;

                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const url = `${location.origin}/tasks/${taskId}`;
                        
                        // Send delete through axios
                        axios.delete(url, { params: { taskId } })
                        .then((res) => {
                            if(res.status === 200){
                                // Delete node
                                taskHTML.parentElement.removeChild(taskHTML)

                                // Optional
                                Swal.fire(
                                    'Done',
                                    res.data,
                                    'success'
                                );
                                
                                progressBar();
                            }
                        })
                    }
                })
        }
    });
}

export default tasks;