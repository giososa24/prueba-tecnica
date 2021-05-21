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

export const confirmDialg = async() => {
    let resp = false;
    resp = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Eliminarás la tarea seleccionada",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
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





