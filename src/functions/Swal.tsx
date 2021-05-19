import Swal from 'sweetalert2';

export const successMessage = (title: string) => {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title,
        showConfirmButton: false,
        timer: 1500
    });
}

export const errorMessage = (title: string) => {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title,
        showConfirmButton: false,
        timer: 1500
    });
}



