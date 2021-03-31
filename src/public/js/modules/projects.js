import Swal from 'sweetalert2';
import axios from 'axios';

const btnDelete = document.querySelector('#delete-project');

if(btnDelete){
    btnDelete.addEventListener('click', (e) => {
        const projectUrl = e.target.dataset.projectUrl;
        
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
                
                // Send request to axios
                const url = `${location.origin}/projects/${projectUrl}`;
                axios.delete(url, { params:  { projectUrl } })
                    .then((res) => {
                        Swal.fire(
                            'Deleted!',
                            res.data,
                            'success'
                        )
                        // Redirect to Home
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 3000);
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                          })
                    });
            }
        })
    });
}

export default btnDelete;