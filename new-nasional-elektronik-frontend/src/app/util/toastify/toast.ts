import { toast, ToastPosition } from 'react-toastify';

export enum ToastStatus {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info',
    WARNING = 'warning',
}

export const execToast = (status: ToastStatus, message: string) => {
    const configuration = {
        position: "bottom-right" as ToastPosition,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    }
    switch (status) {
        case ToastStatus.SUCCESS:
          toast.success(message, {...configuration});
          break;
        case ToastStatus.ERROR:
          toast.error(message, {...configuration});
          break;
        case ToastStatus.INFO:
          toast.info(message, {...configuration});
          break;
        case ToastStatus.WARNING:
          toast.warning(message, {...configuration});
          break;
        default:
          toast(message, {...configuration});
    }
}