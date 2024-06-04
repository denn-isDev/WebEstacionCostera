import Swal from "sweetalert2"
export const msgSessionClose= async () =>{
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción cerrara sesion. ¿Deseas continuar?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
    });
    return result;
}