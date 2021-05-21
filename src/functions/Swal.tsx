import Swal from 'sweetalert2';

export const successMessage = (title: string) => {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title,
        showConfirmButton: false,
        timer: 2500
    });
}

export const errorMessage = (title: string) => {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title,
        showConfirmButton: false,
        timer: 2500
    });
}

export const confirmDialg = async(text: string, comfirmText: string) => {
    let resp = false;
    resp = await Swal.fire({
        title: '¿Estás seguro?',
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: comfirmText,
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            return resp = true;
        } else {
            return resp = false;
        }
    });

    return resp;
}





