import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: false,
    icon: 'success',
    title: 'General Title',
    animation: false,
    position: 'center',
    showConfirmButton: true,
    timer: 2000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

export const toastAlert = (message,type) => {
    Toast.fire({
        animation: true,
        icon: type,
        title: message,
    });
}