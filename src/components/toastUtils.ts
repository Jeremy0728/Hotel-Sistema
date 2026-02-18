import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * Muestra un toast de éxito
 */
export function showSuccessToast(title: string, message?: string) {
  const content = message ? `${title}: ${message}` : title;
  toast.success(content, defaultOptions);
}

/**
 * Muestra un toast de error
 */
export function showErrorToast(title: string, message?: string) {
  const content = message ? `${title}: ${message}` : title;
  toast.error(content, {
    ...defaultOptions,
    autoClose: 4000,
  });
}

/**
 * Muestra un toast de advertencia
 */
export function showWarningToast(title: string, message?: string) {
  const content = message ? `${title}: ${message}` : title;
  toast.warning(content, defaultOptions);
}

/**
 * Muestra un toast de información
 */
export function showInfoToast(title: string, message?: string) {
  const content = message ? `${title}: ${message}` : title;
  toast.info(content, defaultOptions);
}

/**
 * Muestra un toast de carga
 */
export function showLoadingToast(title: string, message?: string) {
  const content = message ? `${title}: ${message}` : title;
  return toast.loading(content);
}

/**
 * Cierra un toast específico
 */
export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId);
}

/**
 * Shows a danger toast notification
 * @param title The title of the toast
 * @param description The description of the toast (optional)
 */
export const showDangerToast = (title: string, description?: string) => {
 toast.error(title, {
    ...defaultOptions,
    autoClose: 4000,
  });
};
