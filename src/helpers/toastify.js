import Toastify from 'toastify-js'

export function alertSuccess(alert) {
    Toastify({
        text: alert,
        duration: 1000
      }).showToast();
}